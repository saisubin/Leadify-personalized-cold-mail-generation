import { Client } from '@microsoft/microsoft-graph-client';
import 'isomorphic-fetch';

export const sendMail = async (accessToken: string, to: string, subject: string, body: string, isHtml: boolean = true) => {
    const client = Client.init({
        authProvider: (done) => {
            done(null, accessToken);
        },
    });

    const sendMail = {
        message: {
            subject: subject,
            body: {
                contentType: isHtml ? 'HTML' : 'Text',
                content: body,
            },
            toRecipients: [
                {
                    emailAddress: {
                        address: to,
                    },
                },
            ],
        },
        saveToSentItems: 'true', // Better to save for manual verification
    };

    await client.api('/me/sendMail').post(sendMail);
};
