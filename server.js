import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import roleRoutes from './routes/roleRoutes.js';
import classRoutes from './routes/classRoutes.js';
import recordBookRoutes from './routes/recordBookRoutes.js';

dotenv.config();
const app = express();

// Basic middlewares
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));

// Connect to Mongo
connectDB();

// Routes
app.use('/auth', authRoutes);
app.use('/roles', roleRoutes);
app.use('/classes', classRoutes);
app.use('/recordbook', recordBookRoutes);

// Health
app.get('/', (req, res) => {
  res.json({ ok: true, message: 'School Role-Based Backend running' });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server listening on :${PORT}`));
