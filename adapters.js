// WINDOW source adapters: intentionally public observation sources only.
// Never scan arbitrary hosts, guess private camera URLs, or bypass authentication.
(function(){
  const adapters=[];
  function normalize(c,a){
    const x={...c,adapter:a.id};
    x.lat=Number(x.lat); x.lng=Number(x.lng);
    x.status=String(x.status||'NEAR-LIVE').toUpperCase();
    if(!['LIVE','NEAR-LIVE','OFFLINE'].includes(x.status)) x.status='NEAR-LIVE';
    x.type=x.type||'iframe'; x.rights=x.rights||'SOURCE TERMS APPLY';
    return x;
  }
  function valid(x){return Number.isFinite(x.lat)&&Math.abs(x.lat)<=90&&Number.isFinite(x.lng)&&Math.abs(x.lng)<=180&&x.place&&x.provider&&x.source&&x.embed}
  const api={
    register(a){if(!a||!a.id||typeof a.search!=='function'||adapters.some(x=>x.id===a.id))return false;adapters.push(a);return true},
    list(){return adapters.map(a=>({id:a.id,label:a.label||a.id,mode:a.mode||'browser'}))},
    async search(point){
      const settled=await Promise.allSettled(adapters.map(async a=>(await a.search(point)||[]).map(c=>normalize(c,a)).filter(valid)));
      return settled.flatMap(r=>r.status==='fulfilled'?r.value:[]);
    }
  };
  window.WINDOW_ADAPTERS=api;
  api.register({id:'curated',label:'WINDOW VERIFIED REGISTRY',mode:'browser',async search(){return window.WINDOW_CAMERAS||[]}});
  // Keyed providers such as Windy Webcams and 511/DOT belong behind a server-side
  // discovery endpoint. The browser adapter below activates only when that endpoint exists.
  api.register({id:'discovery',label:'WINDOW DISCOVERY SERVICE',mode:'server',async search(p){
    try{
      const base=window.WINDOW_DISCOVERY_ENDPOINT||'./api/seek';const u=new URL(base,location.href);u.searchParams.set('lat',p.lat);u.searchParams.set('lng',p.lng);
      const r=await fetch(u,{headers:{accept:'application/json'}});if(!r.ok)return[];
      const j=await r.json();return Array.isArray(j.cameras)?j.cameras:[];
    }catch{return[]}
  }});
})();