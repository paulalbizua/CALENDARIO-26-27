const CACHE='temporada-v2-cera';
const FILES=['./','index.html','manifest.json','icon-180.png','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{ e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting())); });
self.addEventListener('activate',e=>{ e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())); });
self.addEventListener('fetch',e=>{
  const req=e.request; if(req.method!=='GET') return;
  const url=new URL(req.url);
  if(url.origin!==location.origin){
    e.respondWith(caches.open(CACHE).then(c=>c.match(req).then(hit=>{ const net=fetch(req).then(r=>{ if(r.ok||r.type==='opaque') c.put(req,r.clone()); return r; }).catch(()=>hit); return hit||net; })));
    return;
  }
  e.respondWith(fetch(req).then(r=>{ const copy=r.clone(); caches.open(CACHE).then(c=>c.put(req,copy)); return r; }).catch(()=>caches.match(req).then(hit=>hit||caches.match('index.html'))));
});
