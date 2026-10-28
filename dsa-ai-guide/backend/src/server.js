const http = require('http');
const app = require('./app');
const config = require('./config/env');
const { connectDB } = require('./config/db');
const { ensureDefaultDemoAccounts } = require('./services/bootstrapService');

const startServer = async () => {
  await connectDB();
  await ensureDefaultDemoAccounts();

  let port = config.port || 5000;
  const maxRetries = 10;
  let attempts = 0;

  const server = http.createServer(app);

  const tryListen = () => {
    server.listen(port);
  };

  server.on('listening', () => {
    const address = server.address();
    const actualPort = typeof address === 'string' ? address : address.port;
    console.log(`====================================================`);
    console.log(`🚀 DSA AI GUIDE SERVER RUNNING`);
    console.log(`📡 Environment: ${config.env}`);
    console.log(`🌐 API Endpoint: http://localhost:${actualPort}/api`);
    console.log(`🤖 AI Provider: ${config.ai.provider} (${config.ai.model})`);
    console.log(`====================================================`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      attempts++;
      console.warn(`[Server Notice] Port ${port} is currently in use.`);
      if (attempts < maxRetries) {
        port = port + 1;
        console.log(`[Server] Retrying on port ${port}...`);
        setTimeout(tryListen, 500);
      } else {
        console.error(`[Server Fatal] Could not bind to an available port after ${maxRetries} attempts.`);
        process.exit(1);
      }
    } else {
      console.error('[Server Error]', err);
    }
  });

  tryListen();

  const handleShutdown = () => {
    console.log('\n[Server] Gracefully shutting down...');
    server.close(() => {
      console.log('[Server] HTTP server closed.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', handleShutdown);
  process.on('SIGINT', handleShutdown);
};

startServer();