// Версия кэша — меняй при каждом обновлении проекта
const CACHE_NAME = 'SuperCalc-pwa-v3';

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
  self.skipWaiting(); // сразу активируем новый SW
});

// Активация: очищаем старые кэши
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim(); // применяем новый SW ко всем вкладкам
});

// Обработка запросов: сначала сеть, потом кэш
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // сеть доступна — обновляем кэш
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return response;
      })
      .catch(() => {
        // офлайн — берём из кэша
        return caches.match(event.request).then(cached => {
          if (cached) return cached;
          // fallback: если документ не найден — index.html
          if (event.request.destination === 'document') {
            return caches.match('index.html');
          }
        });
      })
  );
});
