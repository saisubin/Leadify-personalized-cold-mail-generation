export const generateColdEmailPrompt = (record: any): string => {
    // TODO: USER - INSERT YOUR PROMPT ENGINEERING HERE
    // Use the 'record' object to access CSV columns (e.g., record['First Name'], record.Company)

    // Default Placeholder:
    const prompt = `
        Context:
        - Recipient: ${record['First Name'] || 'Prospective Client'}
        - Company: ${record['Company'] || 'Target Company'}
        - Data: ${JSON.stringify(record)}

        Task:
        Write a personalized cold email selling our services.
        

    `;

    return prompt;
};
