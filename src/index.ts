import express from 'express';
import { config } from './config.js';
import { chatRouter } from './api/chat.js';

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Routes
app.use('/api', chatRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'nova-core',
    timestamp: new Date().toISOString(),
  });
});

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message,
  });
});

// Start server
const port = config.port;
app.listen(port, () => {
  console.log(`🧠 Nova Core running on port ${port}`);
  console.log(`Environment: ${config.nodeEnv}`);
  console.log(`Health check: GET http://localhost:${port}/health`);
  console.log(`Chat endpoint: POST http://localhost:${port}/api/chat`);
});
