import assert from 'node:assert/strict';
import { seek } from './server/seek.mjs';

const originalFetch=global.fetch;
const payload={webcams:[
 {webcamId:42,title:'Test public camera',location:{latitude:27.25,longitude:-80.25,city:'Testville'},player:{day:{embed:'https://player.example.test/42'}},urls:{detail:'https://source.example.test/42'}},
 {webcamId:43,title:'No media',location:{latitude:27.3,longitude:-80.3},urls:{detail:'https://source.example.test/43'}}
]};
global.fetch=async (url,opts)=>{
 assert.match(String(url),/api\.windy\.com\/webcams\/api\/v3\/webcams/);
 assert.match(String(url),/nearby=27\.2%2C-80\.2%2C250/);
 assert.equal(opts.headers['x-windy-api-key'],'test-secret');
 return new Response(JSON.stringify(payload),{status:200,headers:{'content-type':'application/json'}});
};

let r=await seek(new Request('https://window.test/api/seek?lat=27.2&lng=-80.2'),{WINDY_WEBCAMS_API_KEY:'test-secret'});
assert.equal(r.status,200);
let j=await r.json();
assert.deepEqual(j.query,{lat:27.2,lng:-80.2});
assert.equal(j.providers[0].id,'windy');
assert.equal(j.providers[0].ok,true);
assert.equal(j.providers[0].count,1);
assert.equal(j.cameras.length,1);
assert.equal(j.cameras[0].id,'windy:42');
assert.equal(j.cameras[0].status,'NEAR-LIVE');
assert.equal(j.cameras[0].provider,'Windy Webcams');
assert.equal(j.cameras[0].type,'iframe');
assert.equal(j.cameras[0].source,'https://source.example.test/42');

r=await seek(new Request('https://window.test/api/seek?lat=999&lng=-80.2'),{WINDY_WEBCAMS_API_KEY:'test-secret'});
assert.equal(r.status,400);

r=await seek(new Request('https://window.test/api/seek?lat=27.2&lng=-80.2'),{});
j=await r.json();
assert.equal(j.providers[0].ok,false);
assert.equal(j.providers[0].reason,'not-configured');
assert.deepEqual(j.cameras,[]);

global.fetch=originalFetch;
console.log('WINDOW DISCOVERY CONTRACT: PASS');
