const EventSourceLib = require('eventsource');
const EventSource = EventSourceLib.EventSource || EventSourceLib.default || EventSourceLib;
const fetch = require('isomorphic-fetch');

async function main() {
    console.log('--- Starting AI Queue Test ---');

    // 1. Setup SSE Listener
    console.log('Connecting to SSE Stream...');
    console.log('EventSource Constructor:', EventSource);
    const eventSource = new EventSource('http://localhost:3000/api/ai/stream');

    eventSource.onopen = () => {
        console.log('✅ SSE Connection Opened');
    };

    eventSource.onmessage = (event) => {
        console.log('SSE Message:', event.data);
    };

    eventSource.addEventListener('status', (e) => console.log('📢 Status Update:', e.data));
    eventSource.addEventListener('jobStart', (e) => console.log('▶️ Job Started:', JSON.parse(e.data).id));

    eventSource.addEventListener('jobComplete', (e) => {
        const job = JSON.parse(e.data);
        console.log(`✅ Job Completed (${job.id})`);
        console.log(`   Model Used: ${job.result.modelUsed} (${job.result.provider})`);
        console.log(`   Preview: "${job.result.content.substring(0, 50)}..."\n`);
    });

    eventSource.addEventListener('jobFail', (e) => {
        const job = JSON.parse(e.data);
        console.log(`❌ Job Failed (${job.id}):`, job.error);
    });

    eventSource.onerror = (err) => {
        // console.error('SSE Error:', err);
    };

    // 2. Submit Jobs after a brief delay to ensure connection
    setTimeout(async () => {
        console.log('Simulating CSV Upload (3 records)...');
        const payload = {
            records: [
                { "First Name": "Alice", "Company": "TechCorp", "Industry": "Software" },
                { "First Name": "Bob", "Company": "FinanceFlow", "Industry": "FinTech" },
                { "First Name": "Charlie", "Company": "EduLearn", "Industry": "EdTech" }
            ]
        };

        try {
            const response = await fetch('http://localhost:3000/api/ai/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await response.json();
            console.log('✅ Batch Submitted. Job IDs:', data.jobIds);
            console.log('Waiting for processing...\n');
        } catch (error) {
            console.error('❌ Error submitting jobs:', error);
        }
    }, 2000);

    // 3. Timeout to end test
    setTimeout(() => {
        console.log('--- Test Finished (Timeout) ---');
        eventSource.close();
        process.exit(0);
    }, 15000);
}

main();
