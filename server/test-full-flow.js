const EventSourceLib = require('eventsource');
const EventSource = EventSourceLib.EventSource || EventSourceLib.default || EventSourceLib;
const fetch = require('isomorphic-fetch');

async function main() {
    const TEST_EMAIL = "sivakumargopal14@outlook.com"; // Sending to yourself for verification

    console.log('--- Starting Full Workflow Test (AI + Email) ---');

    // 1. Setup SSE Listener to wait for AI result
    console.log('Connecting to AI stream...');
    const eventSource = new EventSource('http://localhost:3000/api/ai/stream');

    eventSource.addEventListener('jobComplete', async (e) => {
        const job = JSON.parse(e.data);
        console.log(`✅ AI Generation Complete for ${job.data['First Name']}`);
        console.log(`   Model: ${job.result.modelUsed}`);

        // 2. Automatically trigger the Send Email API
        console.log(`🚀 Sending email to ${TEST_EMAIL}...`);

        try {
            const sendResponse = await fetch('http://localhost:3000/api/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    to: TEST_EMAIL,
                    subject: `AI Personalized Mail for ${job.data['First Name']}`,
                    body: job.result.content
                })
            });

            const sendResult = await sendResponse.text();
            console.log(`📬 Send Result: ${sendResult}`);

            if (sendResult.includes('successfully')) {
                console.log('\n✨ FULL FLOW SUCCESS! ✨');
                console.log('Check your inbox (and spam folder) for the AI generated mail.');
            }
        } catch (err) {
            console.error('❌ Error in sending phase:', err.message);
        } finally {
            eventSource.close();
            process.exit(0);
        }
    });

    eventSource.addEventListener('jobFail', (e) => {
        console.error('❌ AI Generation Failed:', e.data);
        eventSource.close();
        process.exit(1);
    });

    // 3. Submit a single test record
    setTimeout(async () => {
        console.log('Submitting test record to AI Queue...');
        try {
            const response = await fetch('http://localhost:3000/api/ai/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    records: [{ "First Name": "Sai", "Company": "Leadify AI", "Role": "Founder" }]
                })
            });
            const data = await response.json();
            console.log('✅ Job submitted. ID:', data.jobIds[0]);
        } catch (err) {
            console.error('❌ Error submitting job:', err.message);
            process.exit(1);
        }
    }, 1000);
}

main();
