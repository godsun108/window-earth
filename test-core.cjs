const fs=require('fs'),vm=require('vm');
global.window=global; global.location={href:'https://example.test/'};
global.fetch=async()=>({ok:false,json:async()=>({})});
for(const f of ['cameras.js','adapters.js','route.js','routing.js']) vm.runInThisContext(fs.readFileSync(f,'utf8'),{filename:f});
function ok(name,v){if(!v)throw new Error(name); console.log('✓ '+name)}
ok('camera registry exists',Array.isArray(WINDOW_CAMERAS)&&WINDOW_CAMERAS.length>0);
ok('adapter registry exists',WINDOW_ADAPTERS&&WINDOW_ADAPTERS.list().length>=2);
ok('routing adapter exists',WINDOW_ROUTING&&WINDOW_ROUTING.modes().includes('driving'));
ok('route engine exists',WINDOW_ROUTE&&typeof WINDOW_ROUTE.watchRoute==='function');
const samples=WINDOW_ROUTE.samples([{lat:27,lng:-80},{lat:27.5,lng:-80}],20);
ok('route sampling returns ordered samples',samples.length>=2&&samples.at(-1).routeKm>=samples[0].routeKm);
console.log('WINDOW CORE: PASS');
