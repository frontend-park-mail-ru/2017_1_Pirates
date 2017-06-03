const CACHE_NAME = 'app_serviceworker_v_1';

const cacheUrls = [

];

self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                return cache.addAll(cacheUrls);
            })
    );
});

self.addEventListener('fetch', function (event) {
    console.log(event);
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {

            if (cachedResponse) {
                return cachedResponse;
            }

            return fetch(event.request);
        })
    );
});
