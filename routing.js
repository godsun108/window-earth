// WINDOW standalone routing adapter.
// Public prototype uses OSRM's demo routing service. Production should use a
// dedicated/self-hosted routing backend or another adapter with suitable terms/capacity.
(function(){
 async function osrm(origin,destination){
  const coords=origin.lng+','+origin.lat+';'+destination.lng+','+destination.lat;
  const u='https://router.project-osrm.org/route/v1/driving/'+coords+'?overview=full&geometries=geojson&steps=false';
  const r=await fetch(u);if(!r.ok)throw Error('route-provider');
  const j=await r.json(),x=j.routes&&j.routes[0];if(!x)throw Error('route-not-found');
  return{origin,destination,distanceKm:x.distance/1000,durationSeconds:x.duration,points:x.geometry.coordinates.map(([lng,lat])=>({lat,lng})),provider:'OSRM DEMO'};
 }
 const adapters={driving:osrm};
 window.WINDOW_ROUTING={
  async route(origin,destination,{mode='driving'}={}){const fn=adapters[mode];if(!fn)throw Error('route-mode');return fn(origin,destination)},
  modes(){return Object.keys(adapters)}
 };
})();