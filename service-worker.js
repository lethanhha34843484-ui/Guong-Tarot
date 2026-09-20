const CACHE = 'guong-tarot-v1';
const PRECACHE = ['/', '/index.html', '/manifest.webmanifest', '/favicon.ico', '/apple-touch-icon.png', '/assets/hero.jpg', '/assets/social-preview.jpg', '/assets/icons/icon-192.png', '/assets/icons/icon-512.png'];
self.addEventListener('install', event => event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(PRECACHE)).then(() => self.skipWaiting())));
self.addEventListener('activate', event => event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener('fetch', event => {
  const req = event.request;
  const url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== self.location.origin || url.pathname.startsWith('/api/')) return;
  if (req.mode === 'navigate') {
    event.respondWith(fetch(req).then(r => { const c=r.clone(); caches.open(CACHE).then(cache=>cache.put('/index.html',c)); return r; }).catch(()=>caches.match('/index.html')));
    return;
  }
  event.respondWith(caches.match(req).then(hit => hit || fetch(req).then(r => { if(r.ok){const c=r.clone();caches.open(CACHE).then(cache=>cache.put(req,c));} return r; })));
});
