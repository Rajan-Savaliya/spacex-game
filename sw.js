const staticCacheName = "site-static"; //bowser-cathc sotage --name
const dynamicCacheName = "site-dynamic-v1";
const assets = [
  //TODO: all staic file that is save to offline that is
  "/",
  "/index.html",
  "/sw-start.js",
  "/style.css",
  "/script.js",
  "/images/bg2.png",
  "/css/materialize.min.css",
  "/img/dish.png",
  "/images/bg2.png",
  "/images/life.png",
  "/images/keys.png",
  "/images/bg-o.png",
  "/images/sprite.png",
  "/images/site-bg.jpg",
  "/images/explosion.png",
  "/images/explosion2.png",
  "/sounds/shoot.ogg",
  "/sounds/shoot.mp3",
  "/sounds/howler.js",
  "/sounds/explosion.ogg",
  "/sounds/explosion.mp3",
  "/sounds/background.ogg",
  "/sounds/background.mp3"
];


//!-->LIMIT FOR CHACH-STOGE {{|}} HOW:==> OLD DELETE AND NEW ADD
const limitCacheSize = (name, size) => {
  caches.open(name).then(cache => {
    cache.keys().then(keys => {
      if(keys.length > size){
        cache.delete(keys[0]).then(limitCacheSize(name, size));
      }
    });
  });
};


//! install serive worker
self.addEventListener("install", evt => {
  console.log("service worker installed");

  //TODO:  offline system--which file need to save it
  evt.waitUntil(
    caches.open(staticCacheName).then(cache => {
      console.log("caching shell assets");
      cache.addAll(assets);
    })
  );
});

//! activate event
self.addEventListener("activate", evt => {
  //console.log('service worker activated');

  //TODO: statick file chage==> old chache-staong offline save that is delete
  evt.waitUntil(
    caches.keys().then(keys => {
      //console.log(keys);
      return Promise.all(
        keys
          .filter(key => key !== staticCacheName && key !== dynamicCacheName)
          .map(key => caches.delete(key))
      );
    })
  );
});

//! fetch events
self.addEventListener("fetch", evt => {
  //console.log('fetch event', evt);

  //TODO: selected offlie file==go-to==chache-storage  //and offlie supprt done..BOOMMMM
  evt.respondWith(
    caches
      .match(evt.request)
      .then(cacheRes => {
        return (
          cacheRes ||
          fetch(evt.request).then(fetchRes => {//TODO: contac page/about page===> offlie save it==dynamic offlice supprot==>anoter page save it as well
            return caches.open(dynamicCacheName).then(cache => {
              cache.put(evt.request.url, fetchRes.clone());
              //!limit== check cached items size {{|}} 15 MEAN  15 item save chach-stoge {{you can chage it if you want--10/20/26/etc..}}
               limitCacheSize(dynamicCacheName, 35); 
              return fetchRes;
            });
          })
        );
      })
      .catch(() => {   //TODO: somePAGE not save to cache-storge //--see this fallback page; 
        if (evt.request.url.indexOf(".html") > -1) {
          return caches.match("/fallback.html");
        }
      })
  );
});


