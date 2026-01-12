import prisma from './src/lib/prisma';

async function seed() {
    const user = await prisma.user.upsert({
        where: { email: 'test@leadify.dev' },
        update: {},
        create: {
            email: 'test@leadify.dev',
            name: 'Test Administrator',
            msalId: 'test-msal-id-123'
        }
    });
    console.log('Seed successful: Created/found test user:', user);
    process.exit(0);
}

seed().catch(err => {
    console.error('Seed failed:', err);
    process.exit(1);
});
