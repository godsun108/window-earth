import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';
import { seek } from './server/seek.mjs';

const root=fileURLToPath(new URL('.',import.meta.url)),port=Number(process.env.PORT)||3000;
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.ico':'image/x-icon'};
const cors={'access-control-allow-origin':'*','access-control-allow-methods':'GET, POST, OPTIONS','access-control-allow-headers':'content-type','x-content-type-options':'nosniff'};
const pool=process.env.DATABASE_URL?new pg.Pool({connectionString:process.env.DATABASE_URL,max:5}):null;
let tracesReady=false;
async function ensureTraces(){
  if(!pool)throw new Error('trace database unavailable');
  if(tracesReady)return;
  await pool.query(`CREATE TABLE IF NOT EXISTS portal_traces (
    id BIGSERIAL PRIMARY KEY,
    text VARCHAR(240) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`);
  tracesReady=true;
}
function json(res,status,body,extra={}){res.writeHead(status,{'content-type':'application/json; charset=utf-8','cache-control':'no-store',...cors,...extra});res.end(JSON.stringify(body))}
async function body(req,max=2048){let s='';for await(const c of req){s+=c;if(Buffer.byteLength(s)>max)throw Object.assign(new Error('too large'),{status:413})}return s}
function cleanTrace(value){if(typeof value!=='string')return '';return value.replace(/[\u0000-\u001f\u007f]/g,' ').replace(/\s+/g,' ').trim().slice(0,240)}

http.createServer(async(req,res)=>{try{const u=new URL(req.url,'http://localhost');
if(req.method==='OPTIONS'){res.writeHead(204,cors);return res.end()}
if(u.pathname==='/health'){res.writeHead(200,{'content-type':'application/json',...cors});return res.end(JSON.stringify({ok:true,service:'window-earth',traces:Boolean(pool)}))}
if(u.pathname==='/api/traces'){
  await ensureTraces();
  if(req.method==='GET'){
    const {rows}=await pool.query('SELECT id,text,created_at FROM portal_traces ORDER BY id DESC LIMIT 120');
    return json(res,200,{traces:rows.map(r=>({id:String(r.id),text:r.text,at:r.created_at}))});
  }
  if(req.method==='POST'){
    let payload;try{payload=JSON.parse(await body(req))}catch{return json(res,400,{error:'invalid json'})}
    const text=cleanTrace(payload?.text);
    if(!text)return json(res,400,{error:'trace required'});
    const {rows}=await pool.query('INSERT INTO portal_traces(text) VALUES($1) RETURNING id,text,created_at',[text]);
    const r=rows[0];return json(res,201,{trace:{id:String(r.id),text:r.text,at:r.created_at}});
  }
  return json(res,405,{error:'method not allowed'},{allow:'GET, POST, OPTIONS'});
}
if(u.pathname==='/api/seek'){const response=await seek(new Request('https://window.local'+u.pathname+u.search),process.env),headers=Object.fromEntries(response.headers);Object.assign(headers,cors);res.writeHead(response.status,headers);return res.end(await response.text())}
let rel=decodeURIComponent(u.pathname);if(rel==='/'||rel==='')rel='/index.html';let file=normalize(join(root,rel));if(!file.startsWith(root)){res.writeHead(403);return res.end('Forbidden')}
try{const s=await stat(file);if(s.isDirectory())file=join(file,'index.html')}catch{}const data=await readFile(file);res.writeHead(200,{'content-type':types[extname(file).toLowerCase()]||'application/octet-stream','cache-control':extname(file)==='.html'?'no-cache':'public, max-age=300'});res.end(data)
}catch(e){if(e?.code==='ENOENT'){res.writeHead(404,{'content-type':'text/plain'});res.end('Not found')}else{console.error(e);json(res,e?.status||500,{error:'internal error'})}}}).listen(port,'0.0.0.0',()=>console.log('WINDOW listening on '+port));
