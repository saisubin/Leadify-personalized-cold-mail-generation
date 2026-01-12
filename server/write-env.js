const fs = require('fs');
const content = `AZURE_CLIENT_ID=YOUR_CLIENT_ID
AZURE_CLIENT_SECRET=YOUR_CLIENT_SECRET
AZURE_TENANT_ID=common
`;
fs.writeFileSync('.env', content, 'utf8');
console.log('.env file written with placeholder values');
