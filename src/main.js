if ('serviceWorker' in navigator &&
    (window.location.protocol === 'https:' ||
        window.location.hostname === 'localhost' ||
        window.location.hostname.indexOf('127.') === 0)) {

    navigator.serviceWorker.register('./sw.bundle.js')
        .then(function (registration) {
            console.log('You are offline');
            if (typeof registration.update == 'function') {
                registration.update();
            }
            registration.onupdatefound = function() {
                let installingWorker = registration.installing;

                installingWorker.onstatechange = function() {
                    switch (installingWorker.state) {
                        case 'installed':
                            if (navigator.serviceWorker.controller) {
                                console.log('New or updated content is available.');
                            } else {
                                console.log('Content is cached, and will be available for offline use the ' +
                                      'next time the page is loaded.');
                            }
                            break;
                        case 'redundant':
                            console.error('The installing service worker became redundant.');
                            break;
                    }
                };
        })
        .catch(function (e) {
            console.error('Error during service worker registration:', e);
        });
}
