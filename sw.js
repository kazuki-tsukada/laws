const C='kbh-v10';
const F=['./','index.html','data.json','manifest.webmanifest','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(F)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET') return;
  const u=new URL(e.request.url);
  const fresh = e.request.mode==='navigate' || /\.(html|json)$/i.test(u.pathname);
  if(fresh){
    e.respondWith(fetch(e.request).then(r=>{const cc=r.clone();caches.open(C).then(c=>c.put(e.request,cc));return r}).catch(()=>caches.match(e.request,{ignoreSearch:true})));
  }else{
    e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(r=>r||fetch(e.request)));
  }
});
