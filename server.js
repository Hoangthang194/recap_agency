const { createServer } = require('https');
const { parse } = require('url');
const next = require('next');
const fs = require('fs');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

// Đọc certificate PEM từ Win-ACME
const httpsOptions = {
  key: fs.readFileSync('C:\\certs\\zerra.blog\\zerra.blog-key.pem'),
  cert: fs.readFileSync('C:\\certs\\zerra.blog\\zerra.blog-crt.pem'),
  ca: fs.readFileSync('C:\\certs\\zerra.blog\\zerra.blog-chain.pem')
};

app.prepare().then(() => {
  createServer(httpsOptions, (req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(443, (err) => {
    if (err) throw err;
    console.log('> Next.js HTTPS server running on port 443');
  });
});
