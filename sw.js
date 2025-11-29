const CACHE_NAME = "wagyu-omamori-v1";

// 必要なファイルを列挙（最低限）
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./omamori_base.png",
  "./omamori_base_ocean.png",
  "./omamori_base_flowers.png",
  "./omamori_base_character.png",
  "./icons/wagyu-omamori-192.png",
  "./icons/wagyu-omamori-512.png"
];

// インストール時にキャッシュ
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
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
});

// ネット優先＋フォールバックでキャッシュ
self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request).catch(() =>
      caches.match(event.request, { ignoreSearch: true })
    )
  );
});
