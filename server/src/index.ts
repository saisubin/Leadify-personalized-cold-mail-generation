import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './api/authRoutes';
import emailRoutes from './api/emailRoutes';
import aiRoutes from './api/aiRoutes';
import trackRoutes from './api/trackRoutes';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/api', emailRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/track', trackRoutes);

app.get('/', (req, res) => {
    res.send('Leadify Server is running');
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
