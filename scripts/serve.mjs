import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
const dir=path.resolve('dist');
const port=Number(process.env.PORT||4173);
const types={'.js':'text/javascript;charset=utf-8','.css':'text/css;charset=utf-8','.html':'text/html;charset=utf-8','.svg':'image/svg+xml'};
http.createServer((req,res)=>{
  let u;try{u=decodeURIComponent((req.url||'/').split('?')[0]);}catch{res.writeHead(400).end();return;}
  if(u==='/')u='/index.html';
  const target=path.resolve(dir,'.'+u);
  if(target!==dir&&!target.startsWith(dir+path.sep)){res.writeHead(403).end();return;}
  fs.readFile(target,(error,body)=>{if(error){res.writeHead(404).end('Not found');return;}res.writeHead(200,{'Content-Type':types[path.extname(target)]||'application/octet-stream','Cache-Control':'no-cache'}).end(body);});
}).listen(port,'127.0.0.1',()=>console.log(`Preview: http://127.0.0.1:${port}/`));
