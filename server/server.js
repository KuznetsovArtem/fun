const http = require('http'),
  httpProxy = require('http-proxy');


const gagApiUrl = 'http://developerslife.ru/random?json=true';
// const gagApiUrl = 'http://developerslife.ru';
//
// Create your proxy server and set the target in the options.
//

const proxy = httpProxy.createProxyServer();


http.createServer(function (req, res) {
  // This simulates an operation that takes 500ms to execute
  setTimeout(function () {
    proxy.web(req, res, {
      target: gagApiUrl,
      xfwd: true
    });
  }, 500);
}).listen(8007);

//
// Create your target server
//
http.createServer(function (req, res) {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.write('request successfully proxied to: ' + req.url + '\n' + JSON.stringify(req.headers, true, 2));
  res.end();
}).listen(9008);

console.log('server - ok');

//  -p 8088 -f "/api=http://developerslife.ru/random?json=true" -f "/=http://localhost:9000"