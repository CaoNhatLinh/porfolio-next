const http = require('node:http');
const server = http.createServer((request, response) => {
  if (request.method === 'GET' && request.url === '/') { response.writeHead(200, {'Content-Type':'text/html; charset=utf-8'}); response.end(require('node:fs').readFileSync('public/setup-local-env.html')); return; }
  if (request.method !== 'POST' || request.url !== '/config') { response.writeHead(404); response.end(); return; }
  let body = '';
  request.on('data', chunk => { body += chunk; });
  request.on('end', () => {
    const fields = new URLSearchParams(body);
    const publicKey = fields.get('publicKey') || '';
    const serverKey = fields.get('serverKey') || '';
    if (!/^sb_publishable_[A-Za-z0-9_-]+$/.test(publicKey) || !/^sb_secret_[A-Za-z0-9_-]+$/.test(serverKey)) { response.writeHead(400); response.end('Invalid config'); return; }
    console.log(Buffer.from(JSON.stringify({publicKey, serverKey})).toString('base64'));
    response.writeHead(200, {'Content-Type':'text/plain; charset=utf-8'}); response.end('Đã chuyển cấu hình về local.');
    server.close();
  });
});
server.listen(4177, '127.0.0.1');
