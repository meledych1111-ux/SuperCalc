const CACHE_NAME = 'SuperCalc-pwa-v1';
const ASSETS = [
  './',
  'index.html',
  'style.css',
  'calc.js',
  'history.js',
  'graph.js',
  'equations.js',
  'equationsAndColors.js',
  'fractions.js',
  'daysCalc.js',
  'holidays.js',
  'physics.js',
  'main.js',
  'manifest.json',
  'icons/IMG_9787.png',
  'icons/IMG_9787.png'
];

// Установка: кэшируем все нужные файлы
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

// Активация: очищаем старые кэши
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
      )
    )
  );
});

// Обработка запросов: сначала сеть, потом кэш
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
