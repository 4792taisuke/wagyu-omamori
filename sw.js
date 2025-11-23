// sw.js
const CACHE_NAME = "wagyu-omamori-v1";
const APP_SHELL = [
  "./",
  "./index.html",
  "./manifest.webmanifest"
];

// インストール時：基本ファイルをキャッシュ
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

// 古いキャッシュを削除
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// オフライン対応
self.addEventListener("fetch", (event) => {
  // ページ遷移（navigate）は index.html を返す
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch(() => caches.match("./index.html"))
    );
    return;
  }

  // それ以外のリクエストは、キャッシュ→ネットワークの順
  event.respondWith(
    caches.match(event.request).then((response) => {
      return (
        response ||
        fetch(event.request).then((networkResp) => {
          // 取得できたものは後からキャッシュしておく（任意）
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, networkResp.clone());
          });
          return networkResp;
        })
      );
    })
  );
});
