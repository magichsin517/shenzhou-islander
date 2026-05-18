// 神州上的島民｜Service Worker
// 策略：app shell 預快取 + 動態快取（cache-first，過期才回網路）
// 版號改變 → 自動清舊快取
const VERSION = 'shenzhou-v0.3.1';
const SHELL_CACHE = `${VERSION}-shell`;

const SHELL = [
  './',
  'index.html',
  'manifest.json',
  'icons/icon.svg',
  'icons/icon-192.png',
  'icons/icon-512.png',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(SHELL_CACHE).then(cache => cache.addAll(SHELL).catch(err => {
      // 個別檔 fetch 失敗不要整個壞掉
      console.warn('SW shell pre-cache 部分失敗', err);
    }))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => !k.startsWith(VERSION)).map(k => caches.delete(k))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const req = e.request;
  // 只處理 GET 同源
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;

  e.respondWith(
    caches.match(req).then(cached => {
      if (cached) {
        // 背景更新（stale-while-revalidate 模式）
        fetch(req).then(fresh => {
          if (fresh && fresh.ok) {
            caches.open(SHELL_CACHE).then(c => c.put(req, fresh));
          }
        }).catch(() => {});
        return cached;
      }
      return fetch(req).then(fresh => {
        if (fresh && fresh.ok) {
          const copy = fresh.clone();
          caches.open(SHELL_CACHE).then(c => c.put(req, copy));
        }
        return fresh;
      }).catch(() => caches.match('index.html')); // 離線 fallback
    })
  );
});

// 收到主程式訊息：強制更新
self.addEventListener('message', e => {
  if (e.data === 'SKIP_WAITING') self.skipWaiting();
});
