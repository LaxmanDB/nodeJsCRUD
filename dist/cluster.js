"use strict";

var cluster = require('cluster');
var http = require('http');
var os = require('os');
if (cluster.isMaster) {
  console.log("Master ".concat(process.pid, " is running"));
  var numWorkers = os.cpus().length - 1; // Use available parallelism - 1

  for (var i = 0; i < numWorkers; i++) {
    cluster.fork();
  }
  cluster.on('exit', function (worker, code, signal) {
    console.log("Worker ".concat(worker.process.pid, " died"));
    console.log('Forking a new worker...');
    cluster.fork();
  });

  // Load Balancer
  var server = http.createServer(function (req, res) {
    var worker = Object.values(cluster.workers).find(function (w) {
      return w.isOnline();
    });
    if (worker) {
      // Forward the request to a worker
      proxy.web(req, res, {
        target: "http://127.0.0.1:".concat(worker.process.env.PORT || 3000)
      });
    } else {
      res.writeHead(500);
      res.end('No available workers');
    }
  });
  var PORT = 4000;
  server.listen(PORT, function () {
    console.log("Load balancer listening on http://localhost:".concat(PORT, "/api"));
  });
} else {
  require('./dist/index.js'); // Path to your bundled file
  console.log("Worker ".concat(process.pid, " started"));
}