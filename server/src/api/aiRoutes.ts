import express, { Request, Response } from 'express';
import { jobQueue } from '../services/queue/jobQueue';
import prisma from '../lib/prisma';
import { currentMsalId } from './authRoutes';

const router = express.Router();

// SSE Stream for Real-time Updates
router.get('/stream', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const sendEvent = (event: string, data: any) => {
        res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
    };

    sendEvent('status', jobQueue.getQueueStatus());

    const onJobStart = (job: any) => sendEvent('jobStart', job);
    const onJobComplete = (job: any) => sendEvent('jobComplete', job);
    const onJobFail = (job: any) => sendEvent('jobFail', job);

    jobQueue.on('jobStart', onJobStart);
    jobQueue.on('jobComplete', onJobComplete);
    jobQueue.on('jobFail', onJobFail);

    req.on('close', () => {
        jobQueue.off('jobStart', onJobStart);
        jobQueue.off('jobComplete', onJobComplete);
        jobQueue.off('jobFail', onJobFail);
        res.end();
    });
});

// Post Jobs (Batch) with Database Persistence
router.post('/generate', async (req: Request, res: Response) => {
    const { records, campaignName } = req.body;

    if (!records || !Array.isArray(records)) {
        res.status(400).send('Invalid input. Expected "records" array.');
        return;
    }

    try {
        // Find the current user in DB
        let dbUser = null;
        if (currentMsalId) {
            dbUser = await prisma.user.findUnique({ where: { msalId: currentMsalId } });
        }

        if (!dbUser) {
            res.status(401).send('User session not found in DB. Please sign in first.');
            return;
        }

        // Create Campaign
        const campaign = await prisma.campaign.create({
            data: {
                name: campaignName || `Campaign ${new Date().toISOString()}`,
                userId: dbUser.id,
                status: 'RUNNING'
            }
        });

        // Add Leads and Queue Jobs
        const jobIds = [];
        for (const record of records) {
            // Check suppression list first
            const isSuppressed = await prisma.suppression.findUnique({
                where: {
                    userId_mailid: {
                        userId: dbUser.id,
                        mailid: record.mailid
                    }
                }
            });

            if (isSuppressed) continue;

            const lead = await prisma.lead.create({
                data: {
                    campaignId: campaign.id,
                    mailid: record.mailid || record.Email,
                    name: record.name || record['First Name'],
                    designation: record.designation || record.Role,
                    companyName: record.companyname || record.Company,
                    companyUrl: record.companyurl,
                    metadata: record,
                    status: 'PENDING'
                }
            });

            jobIds.push(jobQueue.addJob(record, lead.id));
        }

        res.json({
            message: `Created campaign "${campaign.name}" and added ${jobIds.length} jobs to queue.`,
            campaignId: campaign.id,
            jobIds: jobIds,
            status: jobQueue.getQueueStatus()
        });
    } catch (error: any) {
        console.error('[AiRoute] Generation failed:', error);
        res.status(500).send('Failed to initialize generation: ' + error.message);
    }
});

// Get Campaign Metrics
router.get('/campaigns/:id/metrics', async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const leads = await prisma.lead.findMany({
            where: { campaignId: id },
            include: { emailContent: true }
        });

        const metrics = {
            total: leads.length,
            sent: leads.filter((l: any) => ['SENT', 'NO_RESPONSE', 'REPLIED'].includes(l.status)).length,
            opened: leads.filter((l: any) => l.emailContent?.openCount && l.emailContent.openCount > 0).length,
            replied: leads.filter((l: any) => l.emailContent?.repliedAt).length,
            failed: leads.filter((l: any) => l.status === 'FAILED').length,
            pending: leads.filter((l: any) => ['PENDING', 'GENERATED'].includes(l.status)).length,
        };

        res.json(metrics);
    } catch (error) {
        res.status(500).send('Error fetching metrics');
    }
});

// Get Single Campaign with Leads
router.get('/campaigns/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const campaign = await prisma.campaign.findUnique({
            where: { id },
            include: {
                leads: {
                    include: { emailContent: true },
                    orderBy: { createdAt: 'desc' }
                }
            }
        });

        if (!campaign) {
            res.status(404).send('Campaign not found');
            return;
        }

        res.json(campaign);
    } catch (error) {
        res.status(500).send('Error fetching campaign');
    }
});

// Get All Campaigns
router.get('/campaigns', async (req: Request, res: Response) => {
    try {
        let dbUser = null;
        if (currentMsalId) {
            dbUser = await prisma.user.findUnique({ where: { msalId: currentMsalId } });
        }

        if (!dbUser) {
            res.status(401).send('User not authenticated');
            return;
        }

        const campaigns = await prisma.campaign.findMany({
            where: { userId: dbUser.id },
            orderBy: { createdAt: 'desc' },
            include: {
                _count: {
                    select: { leads: true }
                }
            }
        });

        res.json(campaigns);
    } catch (error) {
        res.status(500).send('Error fetching campaigns');
    }
});

// Get Global Metrics
router.get('/metrics', async (req: Request, res: Response) => {
    try {
        let dbUser = null;
        if (currentMsalId) {
            dbUser = await prisma.user.findUnique({ where: { msalId: currentMsalId } });
        }

        if (!dbUser) {
            res.status(401).send('User not authenticated');
            return;
        }

        const stats = await prisma.$transaction([
            prisma.lead.count({ where: { campaign: { userId: dbUser.id }, status: 'SENT' } }),
            prisma.emailContent.count({ where: { lead: { campaign: { userId: dbUser.id } }, openCount: { gt: 0 } } }),
            prisma.emailContent.count({ where: { lead: { campaign: { userId: dbUser.id } }, repliedAt: { not: null } } }),
            prisma.lead.count({ where: { campaign: { userId: dbUser.id }, status: 'FAILED' } }),
            prisma.suppression.count({ where: { userId: dbUser.id } }),
            prisma.lead.count({ where: { campaign: { userId: dbUser.id }, status: 'PENDING' } })
        ]);

        res.json({
            totalSent: stats[0],
            totalOpened: stats[1],
            totalReplied: stats[2],
            totalFailed: stats[3],
            totalSuppressed: stats[4],
            totalNotSent: stats[5],
        });
    } catch (error) {
        res.status(500).send('Error fetching global metrics');
    }
});

export default router;
