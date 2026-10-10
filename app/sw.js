// A telepíthetőséghez kell egy service worker. Mindig a hálózatról tölt,
// gyorsítótár nélkül, így a felület mindig a legfrissebb.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', () => {});
