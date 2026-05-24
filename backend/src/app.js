import express from 'express';
import heroesRoutes from './routes/heroes.routes.js';
import metaRoutes from './routes/meta.routes.js';
import { errorMiddleware, notFoundMiddleware } from './middlewares/error.middleware.js';

const app = express();
const frontendUrl = process.env.FRONTEND_URL || process.env.CORS_ORIGIN || 'http://localhost:5173';

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', frontendUrl);
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  return next();
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'dota-meta-insights-api'
  });
});

app.use('/api/heroes', heroesRoutes);
app.use('/api/meta', metaRoutes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;
