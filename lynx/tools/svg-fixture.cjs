const http = require('http');
const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32"><path fill="currentColor" d="M16 2 L30 30 L2 30 Z"/></svg>';
http.createServer((req,res)=>{ console.log(new Date().toISOString(),req.url);res.writeHead(200,{'Content-Type':'image/svg+xml'});res.end(svg); }).listen(9349,'127.0.0.1',()=>console.log('Local SVG fixture on 127.0.0.1:9349'));
