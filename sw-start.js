//! CHECKING  serive worker is avialable in browser

if('serviceWorker' in navigator){
  navigator.serviceWorker.register('/sw.js')    //!     ('/sw.js)  place of seriv work file
    .then(reg => console.log('service worker registered', reg))
    .catch(err => console.log('service worker not registered', err));
} 