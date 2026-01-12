import express, { Request, Response } from 'express';
import { sendMail } from '../services/graphService';
import { getValidToken } from '../services/authService';
import { currentMsalId, storedAccessToken } from './authRoutes';
import prisma from '../lib/prisma';

const router = express.Router();

router.post('/send-email', async (req: Request, res: Response) => {
    let token = storedAccessToken;
    const { to, subject, body, leadId } = req.body;

    if (currentMsalId) {
        try {
            token = await getValidToken(currentMsalId);
        } catch (error) {
            console.error('[EmailRoute] Failed to get valid token:', error);
        }
    }

    if (!token) {
        res.status(401).send('User not authenticated. Please visit /auth/signin first.');
        return;
    }

    if (!to || !subject || !body) {
        res.status(400).send('Missing fields');
        return;
    }

    try {
        let finalBody = body;

        // Inject tracking pixel and unsubscribe link if leadId is provided
        if (leadId) {
            const emailContent = await prisma.emailContent.findUnique({
                where: { leadId }
            });

            if (emailContent) {
                // In production, BASE_URL would be your public domain
                const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
                const trackingPixel = `<img src="${BASE_URL}/api/track/open/${emailContent.trackingId}" width="1" height="1" style="display:none;" />`;
                const unsubscribeLink = `<br><br><p style="font-size: 12px; color: #666;">If you no longer wish to receive these emails, you can <a href="${BASE_URL}/api/track/unsubscribe/${emailContent.trackingId}">unsubscribe here</a>.</p>`;

                finalBody = body + trackingPixel + unsubscribeLink;
            }
        }

        await sendMail(token, to, subject, finalBody, true);

        // Update Lead status in DB
        if (leadId) {
            await prisma.lead.update({
                where: { id: leadId },
                data: { status: 'SENT' }
            });
        }

        res.send('Email sent successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error sending email');
    }
});

export default router;
