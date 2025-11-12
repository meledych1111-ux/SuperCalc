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

// Обработка запросов: сначала ищем в кэше, потом в сети
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      // если есть в кэше — отдаем
      if (cachedResponse) {
        return cachedResponse;
      }
      // иначе идем в сеть и при успехе кладем в кэш
      return fetch(event.request).then(networkResponse => {
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
      }).catch(() => {
        // можно вернуть заглушку, если нужно
      });
    })
  );
});
