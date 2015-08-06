import Scheduler from './src/Scheduler';
import 'serviceworker-cache-polyfill';

var caheName = 'sw-demo';

self.oninstall = function (event) {
  	self.skipWaiting();
	
	event.waitUntil(
		caches.open(caheName).then(function (cache) {
			return cache.addAll([
				'./', 
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
  	let requestURL = new URL(event.request.url),
      	request = event.request.clone(),
      	type = requestURL.href.split('.').pop();

	//Adding to Scheduler
	Scheduler.add(type, request);

	


	event.respondWith(
		caches.match(request).then(function (response) {
			if (response) {
			  return response;
			}
			console.log('Trying Fetch - Cache Not Available ' + request.url);
			return fetch(request).then(function (response) {
			  	caches.open(caheName).then(function (cache) {
			    	cache.put(request, response);
			  	});
			  	return response.clone();
			});
		})
	);
};