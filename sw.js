import Scheduler from './src/Scheduler';
import 'serviceworker-cache-polyfill';

var caheName = 'sw-priority';

self.oninstall = function (event) {
    self.skipWaiting();
    
    event.waitUntil(
        caches.open(caheName).then(function (cache) {
            return cache.addAll([
                'lib/bundle.js'
            ]);
        })
    );
};

self.onactivate = function (event) {
    if (self.clients && clients.claim) {
        clients.claim();
    }
    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.map(function (cacheName) {
                    return caches.delete(cacheName);
                }
            ));
        })
    );
};

self.onfetch = function (event) {
    const request = event.request.clone();
    // Adding to Scheduler
    Scheduler.add(request, fetchAndCacheRequest);

    // event.respondWidth();
};

function fetchAndCacheRequest (requestArr) {
    requestArr.map((req) => {
        Scheduler.remove(req);
        return fetch(req).then(function (response) {
            caches.open(caheName).then(function (cache) {
                cache.put(req, response);
            });
            return response.clone();
        });
    });
}
