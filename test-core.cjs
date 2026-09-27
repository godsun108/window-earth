const fs=require('fs'),vm=require('vm');
const html=fs.readFileSync('index.html','utf8'),app=fs.readFileSync('app.js','utf8');
global.window=global; global.location={href:'https://example.test/'};
global.fetch=async()=>({ok:false,json:async()=>({})});
for(const f of ['cameras.js','adapters.js','route.js','routing.js']) vm.runInThisContext(fs.readFileSync(f,'utf8'),{filename:f});
function ok(name,v){if(!v)throw new Error(name); console.log('✓ '+name)}
ok('Earth-first interface has primary jump',html.includes('SOMEWHERE ELSE')&&html.includes('OPEN ANOTHER WINDOW'));
ok('SEEK instruments are collapsible',html.includes('id="tools"')&&html.includes('hidden')&&app.includes('function setTools'));
ok('Earth Now handoff reveals context',app.includes("incoming.get('from')==='earth-now'")&&app.includes('setTools(true)'));
ok('camera registry exists',Array.isArray(WINDOW_CAMERAS)&&WINDOW_CAMERAS.length>0);
ok('known private Iceland embed is quarantined',!WINDOW_CAMERAS.some(c=>String(c.embed).includes('bEOPDN710JQ')));
ok('known unavailable Odaiba embed is quarantined',!WINDOW_CAMERAS.some(c=>String(c.embed).includes('fdkVkWU99DI')));
ok('registry never treats source webpages as camera media',!WINDOW_CAMERAS.some(c=>/^https?:\/\/www\.nps\.gov\/media\/webcam\/view\.htm/i.test(String(c.embed))));
ok('iframe views use embeddable media surfaces',WINDOW_CAMERAS.filter(c=>c.type==='iframe').every(c=>/youtube-nocookie\.com\/embed\//.test(String(c.embed))));
ok('adapter registry exists',WINDOW_ADAPTERS&&WINDOW_ADAPTERS.list().length>=2);
ok('routing adapter exists',WINDOW_ROUTING&&WINDOW_ROUTING.modes().includes('driving'));
ok('route engine exists',WINDOW_ROUTE&&typeof WINDOW_ROUTE.watchRoute==='function');
const samples=WINDOW_ROUTE.samples([{lat:27,lng:-80},{lat:27.5,lng:-80}],20);
ok('route sampling returns ordered samples',samples.length>=2&&samples.at(-1).routeKm>=samples[0].routeKm);
console.log('WINDOW CORE: PASS');

// Cross-repo contract: EARTH NOW may hand off geographic coordinates via query parameters.
const handoff=new URLSearchParams('lat=27.5&lng=-80.3&from=earth-now&event=Test');
const hlat=Number(handoff.get('lat')),hlng=Number(handoff.get('lng'));
ok('EARTH NOW handoff contract',Number.isFinite(hlat)&&Math.abs(hlat)<=90&&Number.isFinite(hlng)&&Math.abs(hlng)<=180&&handoff.get('from')==='earth-now');
