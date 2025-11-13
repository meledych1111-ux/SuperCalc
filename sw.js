// Версия кэша — меняй при каждом обновлении проекта
const CACHE_NAME = 'SuperCalc-pwa-v2';

// Список ресурсов для предзагрузки
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
  'converter.js',
  'holidays.js',
  'physics.js',
  'rules.js',
  'stylistWheel.js',
  'tabs.js',
  'main.js',
  'colorwheel.js',
  'manifest.json',
  'icons/IMG_9787.png'
];

// Установка: кэшируем все нужные файлы
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  // сразу активируем новый SW
  self.skipWaiting();
});

// Активация: очищаем старые кэши и применяем новый SW
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      )
    )
  );
  // сразу применяем новый SW ко всем вкладкам
  return self.clients.claim();
});

// Обработка запросов: сначала сеть, потом кэш
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(networkResponse => {
        // если сеть доступна — обновляем кэш
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
      })
      .catch(() => {
        // если офлайн — берём из кэша
        return caches.match(event.request).then(cachedResponse => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // fallback: если документ не найден — index.html
          if (event.request.destination === 'document') {
            return caches.match('index.html');
          }
        });
      })
  );
});
