const CACHE_NAME="kwg-shell-v2";
const APP_FILES=["./","./index.html","./manifest.webmanifest","./icon.svg"];
self.addEventListener("install",event=>{
 event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(APP_FILES)).then(()=>self.skipWaiting()));
});
self.addEventListener("activate",event=>{
 event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE_NAME).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));
});
self.addEventListener("push",event=>{
 let data={title:"KICKOFF WINS GIFTS",body:"Kuna taarifa mpya za mashindano.",url:"./"};
 try{if(event.data)data={...data,...event.data.json()}}catch(e){if(event.data)data.body=event.data.text()}
 event.waitUntil(self.registration.showNotification(data.title,{
  body:data.body,icon:"./icon.svg",badge:"./icon.svg",tag:data.tag||"kwg-push",
  data:{url:data.url||"./"},renotify:false
 }));
});
self.addEventListener("notificationclick",event=>{
 event.notification.close();
 const target=new URL(event.notification.data?.url||"./",self.registration.scope).href;
 event.waitUntil(self.clients.matchAll({type:"window",includeUncontrolled:true}).then(list=>{
  for(const client of list){if(new URL(client.url).origin===self.location.origin){client.navigate(target);return client.focus()}}
  return self.clients.openWindow(target);
 }));
});
