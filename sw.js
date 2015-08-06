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


    //Need to fix it
    let finalType = type.substr(0, type.indexOf('?'));
	
	//Adding to Scheduler
	Scheduler.add(finalType, request);

	event.respondWith(
		caches.match(request).then((response) => {
			if (response) {
			  return response;
			}
			goThroughScheduler(request);
		})
	);
};

function goThroughScheduler(request) {

	console.log('Not there in Cache, Trying to Fetch - ' + request.url);
	let resources = Scheduler.resources;
	let sortedRes = sortResource(resources, 'js');

	if(sortedRes !== null){
		resources.map(req => {
			return fetch(req).then(function (response) {
			  	caches.open(caheName).then(function (cache) {
			    	cache.put(req, response);
			  	});
			  	return response.clone();
			});
		});
	}else{ //HTML & CSS Files
		return fetch(request).then(function (response) {
		  	caches.open(caheName).then(function (cache) {
		    	cache.put(request, response);
		  	});
		  	return response.clone();
		});
	}
}

//Assumption - Resource Array ==> Array of Objects
function sortResource(res, type) {
	debugger;
	let resArr = res[type];

	if(resArr !== undefined){
		resArr.sort((a,b) => {
			return parseInt(a.priority) - parseInt(b.priority)
		});
	}
	return null;
}