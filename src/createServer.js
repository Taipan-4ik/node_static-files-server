'use strict';

const http = require('http');
const path = require('path');
const fs = require('fs');

function createServer() {
  /* Write your code here */
  // Return instance of http.Server class
  const server = http.createServer((req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);

    if (!url.pathname.startsWith('/file')) {
      res.statusCode = 400;

      return res.end(
        `Please request your files starting with /file/... (e.g. /file/index.html or /file/styles/main.css)`,
      );
    }

    let relativePath = url.pathname.replace(/^\/file/, '') || '/index.html';

    if (/\/{2,}/.test(relativePath)) {
      res.statusCode = 404;

      return res.end('File not found');
    }

    relativePath = path.normalize(relativePath);

    const publicDir = path.resolve(__dirname, '../public');
    const filePath = path.join(publicDir, relativePath);

    if (!filePath.startsWith(publicDir)) {
      res.statusCode = 400;

      return res.end('Access denied!');
    }

    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/plain');
        res.end('File not found');
      } else {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.end(data);
      }
    });
  });

  return server;
}

module.exports = {
  createServer,
};
