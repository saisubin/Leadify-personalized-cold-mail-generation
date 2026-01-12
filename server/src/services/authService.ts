import { ConfidentialClientApplication, Configuration, AuthorizationUrlRequest, AuthorizationCodeRequest, RefreshTokenRequest } from '@azure/msal-node';
import prisma from '../lib/prisma';
import { encrypt, decrypt } from '../lib/encryption';

const getMsalConfig = (): Configuration => {
    return {
        auth: {
            clientId: (process.env.AZURE_CLIENT_ID || '').trim(),
            authority: `https://login.microsoftonline.com/${(process.env.AZURE_TENANT_ID || 'common').trim()}`,
            clientSecret: (process.env.AZURE_CLIENT_SECRET || '').trim(),
        },
    };
};

const redirectUri = 'http://localhost:3000/auth/callback';
const scopes = ['user.read', 'mail.send', 'offline_access'];

export const getAuthUrl = async () => {
    const cca = new ConfidentialClientApplication(getMsalConfig());
    const authCodeUrlParameters: AuthorizationUrlRequest = {
        scopes: scopes,
        redirectUri: redirectUri,
    };

    return await cca.getAuthCodeUrl(authCodeUrlParameters);
};

export const getToken = async (code: string) => {
    const cca = new ConfidentialClientApplication(getMsalConfig());
    const tokenRequest: AuthorizationCodeRequest = {
        code: code,
        scopes: scopes,
        redirectUri: redirectUri,
    };

    const response = await cca.acquireTokenByCode(tokenRequest);

    if (response && response.account && (response as any).refreshToken) {
        const { accessToken, expiresOn, account } = response;
        const refreshToken = (response as any).refreshToken;
        const encryptedRefreshToken = encrypt(refreshToken);

        await prisma.user.upsert({
            where: { msalId: account.homeAccountId },
            update: {
                email: account.username,
                name: account.name,
                tokens: {
                    upsert: {
                        create: {
                            accessToken,
                            refreshToken: encryptedRefreshToken,
                            expiresAt: expiresOn || new Date(Date.now() + 3600000)
                        },
                        update: {
                            accessToken,
                            refreshToken: encryptedRefreshToken,
                            expiresAt: expiresOn || new Date(Date.now() + 3600000)
                        }
                    }
                }
            },
            create: {
                msalId: account.homeAccountId,
                email: account.username,
                name: account.name,
                tokens: {
                    create: {
                        accessToken,
                        refreshToken: encryptedRefreshToken,
                        expiresAt: expiresOn || new Date(Date.now() + 3600000)
                    }
                }
            }
        });

        return {
            accessToken,
            msalId: account.homeAccountId
        };
    }

    throw new Error('Failed to acquire token or missing platform support for refresh tokens');
};

export const getValidToken = async (msalId: string) => {
    const user = await prisma.user.findUnique({
        where: { msalId },
        include: { tokens: true }
    });

    if (!user || !user.tokens) throw new Error("User or tokens not found in database. Please sign in again.");

    const { accessToken, refreshToken: encryptedRefreshToken, expiresAt } = user.tokens;
    const refreshToken = decrypt(encryptedRefreshToken);

    // Check if token is expired (or expires in the next 5 minutes)
    if (expiresAt.getTime() - Date.now() < 5 * 60 * 1000) {
        console.log(`[Auth] Token for ${user.email} expired. Refreshing...`);
        const cca = new ConfidentialClientApplication(getMsalConfig());
        const refreshTokenRequest: RefreshTokenRequest = {
            refreshToken,
            scopes: ['user.read', 'mail.send'],
        };

        const response = await cca.acquireTokenByRefreshToken(refreshTokenRequest);
        if (response && response.accessToken) {
            await prisma.authToken.update({
                where: { userId: user.id },
                data: {
                    accessToken: response.accessToken,
                    refreshToken: encrypt((response as any).refreshToken || refreshToken),
                    expiresAt: response.expiresOn || new Date(Date.now() + 3600000)
                }
            });
            return response.accessToken;
        }
    }

    return accessToken;
};
