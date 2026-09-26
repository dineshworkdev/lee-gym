import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';

import healthRoutes from './routes/health.routes.js';

// Express application setup.
// This is only the architectural foundation — no business logic,
// authentication, or database-backed routes are implemented yet.
const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

app.use('/api/health', healthRoutes);

export default app;
