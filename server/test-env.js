const dotenv = require('dotenv');
const result = dotenv.config();

console.log('Current Directory:', process.cwd());
if (result.error) {
    console.log('Dotenv Error:', result.error);
} else {
    console.log('Dotenv Loaded:', result.parsed);
}
console.log('AZURE_CLIENT_SECRET:', process.env.AZURE_CLIENT_SECRET);
