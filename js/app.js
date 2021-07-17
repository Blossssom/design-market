let http = require('http');

let hostname = '127.0.0l.1';
let port = 3000;

http.createServer(function(req, res) {
    res.writeHead(200, {'Content-Type' : 'text/plain; charset=utf-8'});
    res.end('Hello');
}).listen(port, hostname);