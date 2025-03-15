// service-worker.js
importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js');

workbox.setConfig({
    debug: false,
});

// キャッシュ名の設定
const CACHE_NAME = 'morning-routine-cache-v1';

// プリキャッシュするファイルの指定
workbox.precaching.precacheAndRoute([
    { url: '/', revision: '1' },
    { url: '/index.html', revision: '1' },
    { url: '/static/js/main.chunk.js', revision: '1' },
    { url: '/static/js/bundle.js', revision: '1' },
    { url: '/manifest.json', revision: '1' },
    { url: '/logo192.png', revision: '1' },
    { url: '/logo512.png', revision: '1' },
    { url: '/favicon.ico', revision: '1' },
]);

// フォントと画像のキャッシュ設定
workbox.routing.registerRoute(
    ({ request }) => request.destination === 'image' ||
        request.destination === 'font',
    new workbox.strategies.CacheFirst({
        cacheName: 'assets-cache',
        plugins: [
            new workbox.expiration.ExpirationPlugin({
                maxEntries: 60,
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30日
            }),
        ],
    })
);

// アプリケーションのJSとCSSファイルのキャッシュ設定
workbox.routing.registerRoute(
    ({ request }) => request.destination === 'script' ||
        request.destination === 'style',
    new workbox.strategies.StaleWhileRevalidate({
        cacheName: 'static-resources',
    })
);

// オフライン対応
workbox.routing.registerRoute(
    ({ request }) => request.mode === 'navigate',
    new workbox.strategies.NetworkFirst({
        cacheName: 'pages-cache',
        plugins: [
            new workbox.expiration.ExpirationPlugin({
                maxEntries: 30,
                maxAgeSeconds: 7 * 24 * 60 * 60, // 1週間
            }),
        ],
    })
);

// オフライン時のフォールバックページ
workbox.routing.setCatchHandler(async ({ event }) => {
    if (event.request.destination === 'document') {
        return workbox.precaching.matchPrecache('/offline.html');
    }
    return Response.error();
});

// バックグラウンドでの同期のサポート
self.addEventListener('sync', (event) => {
    if (event.tag === 'routineComplete') {
        event.waitUntil(syncRoutineData());
    }
});

// データ同期機能（オプション）
async function syncRoutineData() {
    const cachedData = await localforage.getItem('pendingRoutines');
    if (cachedData && cachedData.length > 0) {
        try {
            // オンラインになった時のデータ同期処理をここに記述
            await localforage.removeItem('pendingRoutines');
        } catch (error) {
            console.error('Failed to sync data:', error);
        }
    }
}