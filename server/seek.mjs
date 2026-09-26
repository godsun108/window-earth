// WINDOW SEEKER server endpoint core.
// Deploy behind /api/seek on a serverless/runtime platform that supports fetch.
// Secret: WINDY_WEBCAMS_API_KEY
const WINDY='https://api.windy.com/webcams/api/v3/webcams';

const num=(v,min,max)=>{const n=Number(v);return Number.isFinite(n)&&n>=min&&n<=max?n:null};
const json=(body,status=200)=>new Response(JSON.stringify(body),{status,headers:{'content-type':'application/json; charset=utf-8','cache-control':'public, max-age=60, s-maxage=180'}});
const sourceUrl=w=>w.urls?.detail||w.url||'https://www.windy.com/webcams';
const player=w=>w.player?.day?.embed||w.player?.lifetime?.embed||w.player?.month?.embed||null;
const image=w=>w.images?.current?.preview||w.images?.current?.thumbnail||null;

async function windy(lat,lng,key){
 if(!key)return {id:'windy',ok:false,count:0,reason:'not-configured',cameras:[]};
 const url=new URL(WINDY);
 url.searchParams.set('nearby',lat+','+lng+',250');
 url.searchParams.set('include','location,player,images');
 url.searchParams.set('limit','50');
 const r=await fetch(url,{headers:{'x-windy-api-key':key,'accept':'application/json'}});
 if(!r.ok)return {id:'windy',ok:false,count:0,reason:'http-'+r.status,cameras:[]};
 const data=await r.json();
 const rows=data.webcams||data.result?.webcams||[];
 const cameras=rows.map(w=>{
  const embed=player(w)||image(w); if(!embed)return null;
  const la=Number(w.location?.latitude),lo=Number(w.location?.longitude);
  if(!Number.isFinite(la)||!Number.isFinite(lo))return null;
  return {
   id:'windy:'+String(w.webcamId||w.id),place:w.title||w.location?.city||'Public webcam',
   lat:la,lng:lo,status:'NEAR-LIVE',provider:'Windy Webcams',
   type:player(w)?'iframe':'image',embed,source:sourceUrl(w),
   heading:null,fov:null,freshnessSeconds:null,
   rights:'Windy/provider terms apply'
  };
 }).filter(Boolean);
 return {id:'windy',ok:true,count:cameras.length,cameras};
}

export async function seek(request,env=process.env){
 const u=new URL(request.url),lat=num(u.searchParams.get('lat'),-90,90),lng=num(u.searchParams.get('lng'),-180,180);
 if(lat===null||lng===null)return json({error:'invalid coordinates'},400);
 const results=await Promise.allSettled([windy(lat,lng,env.WINDY_WEBCAMS_API_KEY)]);
 const providers=results.map((r,i)=>r.status==='fulfilled'?{id:r.value.id,ok:r.value.ok,count:r.value.count,reason:r.value.reason||null}:{id:['windy'][i],ok:false,count:0,reason:'adapter-failed'});
 const cameras=results.flatMap(r=>r.status==='fulfilled'?r.value.cameras:[]);
 return json({query:{lat,lng},generated_at:new Date().toISOString(),providers,cameras});
}

export default seek;
