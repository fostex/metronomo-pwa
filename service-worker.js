const CACHE_NAME = 'metronomo-v1';
const urlsToCache = [
  '/',
  '/index3.html',
  '/manifest.json',
  'https://cdn.tailwindcss.com', // Caching della libreria esterna (se usata)
  // Assicurati di aggiungere tutte le icone che specifichi nel manifest
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

self.addEventListener('install', (event) => {
  // Forza il service worker a essere attivo immediatamente
  self.skipWaiting(); 
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Ritorna il file dalla cache se presente
        if (response) {
          return response;
        }
        // Altrimenti, va in rete
        return fetch(event.request);
      })
  );
});

self.addEventListener('activate', (event) => {
  // Rimuovi le vecchie cache per assicurare che gli utenti abbiano la versione più recente
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});