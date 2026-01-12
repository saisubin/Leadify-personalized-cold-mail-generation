const fetch = require('isomorphic-fetch');

async function testEmail() {
    try {
        const response = await fetch('http://localhost:3000/api/send-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                to: 'saisubinsv@gmail.com',
                subject: 'Test from Leadify (Node Script)',
                body: 'This confirms the Graph API is working via a proper POST request.',
            }),
        });

        if (response.ok) {
            console.log('Success:', await response.text());
        } else {
            console.log('Error:', response.status, await response.text());
        }
    } catch (error) {
        console.error('Fetch Error:', error);
    }
}

testEmail();
