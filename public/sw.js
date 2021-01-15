const STATIC_CACHE_VERSION = 'Satic_1';
const DYNAMIC_CACHE_VERSION = 'Dynamic_1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/offline.html',
  '/assets/css/style.css',
  '/assets/js/main.js',
  '/assets/img/placeholder.png',
  '/assets/img/resume.pdf'
];

function preCache() {
  // caches.open('static').then(cache => {
  //   cache.add('/');
  //   cache.add('/index.html');
  // })
  return caches.open(STATIC_CACHE_VERSION).then((cache) => {
    console.log('[SW] pre cached');
    return cache.addAll(STATIC_ASSETS);
  }).catch(error => {
    console.log('[SW] cache ready error');
  })
}

self.addEventListener('install', (event) => {
  console.log('[sw] Installing Service Worker...', event);
  // self.skipWaiting();

  // accepts a promise
  event.waitUntil(preCache());
})

function cleanUp() {
  return caches.keys().then((keys) => {
    console.log(keys);
    return Promise.all(keys.map((key) => {
      if (key !== STATIC_CACHE_VERSION && key !== DYNAMIC_CACHE_VERSION) {
        console.log('[SW] deleting old caches...');
        return caches.delete(key);
      }
    }));
  })
}

self.addEventListener('activate', (event) => {
  console.log('[sw] Activating Service Worker...', event);
  event.waitUntil(cleanUp());
  return self.clients.claim();
})

self.addEventListener('fetch', (event) => {
  // console.log('[sw] Fetch Service Worker...', event);
  console.log('[sw] Fetch...');
  const request = event.request;

  // if(request.url === 'http://127.0.0.1:8080/index.html') {
  event.respondWith(
    caches.match(request).then((response) => {
      return response || fetch(request).then((res) => {
        caches.open(DYNAMIC_CACHE_VERSION).then((cache) => {
          cache.put(request, res);
        });
        return res.clone();
      }).catch((error) => {
        console.error('[SW] cache fetch error')
        return caches.open(STATIC_CACHE_VERSION).then((cache) => {
          if (request.headers.get('accept').includes('text/html')) {
            return cache.match('/offline.html');
          }
          if (request.url.match(/\.(jpe?g|png|gif|svg)$/)) {
            return cache.match('/assets/img/placeholder.png')
          }
        })
      });
    }).catch(console.error)
  )
  // }


  // 1. cache only
  // event.respondWith(
  //   cache.match(request)
  // )

  // 2. Network only 
  // event.respondWith(
  //   fetch(event.request)
  // )

  // 3. cache first, falling back to network
  // event.respondWith(
  //   caches.match(request).then((res) => {
  //           // fallback
  //     return res || fetch(request).then((newRes) => {
  //           // cache fetched response
  //       caches.open(DYNAMIC_CACHE_VERSION).then(cache => cache.put(request, newRes));
  //       return newRes.clone();
  //     })
  //   })
  // )

  // 4. Network first, falling back to cache 
  // event.respondWith(
  //   fetch(request).then((res) => {
  //       // caceh latest version
  //       caches.open(DYNAMIC_CACHE_VERSION).then(cache => cache.put(request, res))
  //       return res.clone();
  //   }) //fallback to cache
  //   .catch(err => caches.match(request))
  // )

  // 5. cache with network update
  // event.respondWith(
  //     // return from cache
  //     caches.match(request).then((res) => {
  //         // Update
  //         const UpdatedResponse = fetch(request).then((newRes) => {
  //             // cache new response 
  //             cache.put(request, newRes.clone())
  //             return newRes;
  //         });

  //         return res || UpdatedResponse;
  //     })
  // )

  // 6. Cache and Network race
  // const promiseRace = new Promise((resolve, reject) => {

  //   let firstRejectionReceived = false;
  //   const rejectOnce = () => {
  //     if(firstRejectionReceived) {
  //       reject('No response received')
  //     } else {
  //       firstRejectionReceived = true;
  //     }
  //   }

  //   // try network //check res ok
  //   fetch(request).then(res => res.ok ? resolve(res) : rejectOnce())
  //     .catch(rejectOnce)


  //   // try cache // check cache found
  //   cache.match(request).then(res => res ? resolve(res) : rejectOnce())
  //     .catch(rejectOnce);
  // });
  
  // event.respondWith(promiseRace);


})