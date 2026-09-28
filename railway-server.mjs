import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { seek } from './server/seek.mjs';
const root=fileURLToPath(new URL('.',import.meta.url)),port=Number(process.env.PORT)||3000;
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.ico':'image/x-icon'};
const cors={'access-control-allow-origin':'*','access-control-allow-methods':'GET, OPTIONS','access-control-allow-headers':'content-type','x-content-type-options':'nosniff'};
http.createServer(async(req,res)=>{try{const u=new URL(req.url,'http://localhost');
if(req.method==='OPTIONS'){res.writeHead(204,cors);return res.end()}
if(u.pathname==='/health'){res.writeHead(200,{'content-type':'application/json',...cors});return res.end(JSON.stringify({ok:true,service:'window-earth'}))}
if(u.pathname==='/api/seek'){const response=await seek(new Request('https://window.local'+u.pathname+u.search),process.env),headers=Object.fromEntries(response.headers);Object.assign(headers,cors);res.writeHead(response.status,headers);return res.end(await response.text())}
let rel=decodeURIComponent(u.pathname);if(rel==='/'||rel==='')rel='/index.html';let file=normalize(join(root,rel));if(!file.startsWith(root)){res.writeHead(403);return res.end('Forbidden')}
try{const s=await stat(file);if(s.isDirectory())file=join(file,'index.html')}catch{}const data=await readFile(file);res.writeHead(200,{'content-type':types[extname(file).toLowerCase()]||'application/octet-stream','cache-control':extname(file)==='.html'?'no-cache':'public, max-age=300'});res.end(data)
}catch(e){if(e?.code==='ENOENT'){res.writeHead(404,{'content-type':'text/plain'});res.end('Not found')}else{console.error(e);res.writeHead(500,{'content-type':'application/json'});res.end(JSON.stringify({error:'internal error'}))}}}).listen(port,'0.0.0.0',()=>console.log('WINDOW listening on '+port));
