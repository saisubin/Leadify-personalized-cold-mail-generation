import express from 'express';
import prisma from '../lib/prisma';

const router = express.Router();

// 1x1 Transparent tracking pixel
const TRACKING_PIXEL = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64');

router.get('/open/:trackingId', async (req, res) => {
    const { trackingId } = req.params;

    try {
        const content = await prisma.emailContent.update({
            where: { trackingId },
            data: {
                openCount: { increment: 1 },
                lastOpenedAt: new Date()
            },
            include: { lead: true }
        });

        // Update lead status if it was just SENT
        if (content.lead.status === 'SENT') {
            await prisma.lead.update({
                where: { id: content.leadId },
                data: { status: 'SENT' } // Status stays SENT but open count increased
            });
        }
    } catch (error) {
        console.error('[Track] Open tracking failed:', error);
    }

    res.writeHead(200, {
        'Content-Type': 'image/gif',
        'Content-Length': TRACKING_PIXEL.length,
        'Cache-Control': 'no-cache, no-store, must-revalidate'
    });
    res.end(TRACKING_PIXEL);
});

router.get('/suppressions', async (req, res) => {
    try {
        const { currentMsalId } = require('./authRoutes');
        const dbUser = await prisma.user.findUnique({ where: { msalId: currentMsalId } });

        if (!dbUser) {
            res.status(401).send('User not authenticated');
            return;
        }

        const suppressions = await prisma.suppression.findMany({
            where: { userId: dbUser.id },
            orderBy: { createdAt: 'desc' }
        });

        res.json(suppressions);
    } catch (error) {
        res.status(500).send('Error fetching suppressions');
    }
});

router.get('/unsubscribe/:trackingId', async (req, res) => {
    const { trackingId } = req.params;

    try {
        const content = await prisma.emailContent.findUnique({
            where: { trackingId },
            include: { lead: { include: { campaign: true } } }
        });

        if (content && content.lead) {
            // Mark lead as unsubscribed
            await prisma.lead.update({
                where: { id: content.leadId },
                data: { unsubscribed: true }
            });

            // Add to global suppression list for this user
            await prisma.suppression.upsert({
                where: {
                    userId_mailid: {
                        userId: content.lead.campaign.userId,
                        mailid: content.lead.mailid
                    }
                },
                update: { reason: 'Unsubscribed' },
                create: {
                    userId: content.lead.campaign.userId,
                    mailid: content.lead.mailid,
                    reason: 'Unsubscribed'
                }
            });

            res.send('<h1>Unsubscribed</h1><p>You have been successfully removed from our list.</p>');
        } else {
            res.status(404).send('Invalid link.');
        }
    } catch (error) {
        console.error('[Track] Unsubscribe failed:', error);
        res.status(500).send('An error occurred.');
    }
});

export default router;
