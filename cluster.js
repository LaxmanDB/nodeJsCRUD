const cluster = require('cluster');
const http = require('http');
const os = require('os');

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);

  const numWorkers = os.cpus().length - 1; // Use available parallelism - 1

  for (let i = 0; i < numWorkers; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
    console.log('Forking a new worker...');
    cluster.fork();
  });

  // Load Balancer
  const server = http.createServer((req, res) => {
    const worker = Object.values(cluster.workers).find(w => w.isOnline());
    if (worker) {
      // Forward the request to a worker
      proxy.web(req, res, { target: `http://127.0.0.1:${worker.process.env.PORT || 3000}` });
    } else {
      res.writeHead(500);
      res.end('No available workers');
    }
  });

  const PORT = 4000;
  server.listen(PORT, () => {
    console.log(`Load balancer listening on http://localhost:${PORT}/api`);
  });
} else {
  require('./dist/index.js'); // Path to your bundled file
  console.log(`Worker ${process.pid} started`);
}
