import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config';
import apiRouter from './routes';
import { errorHandler } from './middlewares/error.middleware';
import { startBackgroundJobs } from './workers';

const app = express();

// Security and middleware
app.use(helmet());
app.use(cors({
  origin: config.frontendUrl || true,
  credentials: true
}));
app.use(express.json());
app.use(morgan('dev'));

// Main API V1 routing
app.use('/api/v1', apiRouter);

// Global Error Handler
app.use(errorHandler);

const server = app.listen(config.port, () => {
  console.log(`===============================================`);
  console.log(`🏥 PulsePoint Core Backend Running on Port ${config.port}`);
  console.log(`🌐 API Gateway: http://localhost:${config.port}/api/v1`);
  console.log(`===============================================`);

  // Start background schedulers
  startBackgroundJobs();
});

export default app;
