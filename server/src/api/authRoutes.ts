import express from 'express';
import { getAuthUrl, getToken } from '../services/authService';

const router = express.Router();

// Simple store for demo purposes
export let storedAccessToken: string | null = null;
export let currentMsalId: string | null = 'test-msal-id-123';

router.get('/signin', async (req, res) => {
    try {
        const url = await getAuthUrl();
        res.redirect(url);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error during auth init');
    }
});

router.get('/callback', async (req, res) => {
    const code = req.query.code as string;
    if (!code) {
        res.status(400).send('No code provided');
        return;
    }

    try {
        const result = await getToken(code);
        storedAccessToken = result.accessToken;
        currentMsalId = result.msalId;
        res.send('Authentication successful! Your session is now persistent. You can close this window.');
    } catch (error) {
        console.log(error);
        res.status(500).send('Error getting token');
    }
});

export default router;
