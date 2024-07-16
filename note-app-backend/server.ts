import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import noteRoutes from './api/routes/noteRoutes';
import authRoutes from './api/routes/authRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 9000;

app.use(cors({
    origin: 'http://localhost:5173', // Update this to match your frontend origin
    credentials: true
  }));
app.use(bodyParser.json());

mongoose.set('strictQuery', true); 
mongoose.connect(process.env.MONGODB_URI!)
    .then(() => console.log('Connected to Database'))
    .catch((error) => console.error('Database connection error:', error));

app.use('/api', noteRoutes);
app.use('/auth', authRoutes); 

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
