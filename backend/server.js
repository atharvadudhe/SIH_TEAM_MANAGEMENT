import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { PORT, MONGO_URI, NODE_ENV } from './config.js';
import authRoutes from './routes/auth.js';
import teamRoutes from './routes/teams.js';
import lookupRoutes from './routes/lookup.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

app.use(express.json());
app.use(cookieParser());

// CORS - allow frontend dev origin
app.use(cors({
  origin: process.env.FRONT_END_URL,
  credentials: true
}));

app.use('/api/auth', authRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/lookups', lookupRoutes);

app.use(errorHandler);

const start = async () => {
  try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

start();