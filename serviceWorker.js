/// <reference lib="WebWorker" />
self.addEventListener("install", (e) => {
    self.skipWaiting();
    e.waitUntil(loadResourcesToCache());
});
const CACHE_NAME = "offlineData_v1";
const CACHE_FILES = [
    "/offline/offline.html"
];
const loadResourcesToCache = async () => {
    const cache = await caches.open(CACHE_NAME);
    cache.addAll(CACHE_FILES);
};
const checkForCacheMatch = async (request) => {
    try {
        if (request.url.includes("?noCache")) {
            const netResponse = await fetch(request);
            return netResponse;
        }
        const cache = await caches.open(CACHE_NAME);
        if (!navigator.onLine) {
            const cacheRes = await cache.match(request);
            if (cacheRes)
                return cacheRes;
            const fallback = await cache.match("./offline/offline.html");
            if (fallback)
                return fallback;
            return new Response("There Was an error on the client side! And btw you are offline!");
        }
        const netResponse = await fetch(request);
        console.log(request);
        await cache.put(request, netResponse.clone());
        return netResponse;
    }
    catch (ex) {
        const cache = await caches.open(CACHE_NAME);
        const fallback = await cache.match("./offline/offline.html");
        if (fallback)
            return fallback;
        return new Response("There Was an error on the client side! And btw you are offline!");
    }
};
self.addEventListener("fetch", async (event) => {
    event.respondWith(checkForCacheMatch(event.request));
});
// Push Notifications
self.addEventListener("push", (event) => {
    if (!event.isTrusted)
        return;
    console.log("[Service Worker]: Received Push: ", event);
    if (!event.data)
        return;
    const data = event.data.json();
    if (data.type == "notification") {
        event.waitUntil(self.registration.showNotification(data.title, {
            body: data.body || "",
            tag: data.tag || undefined,
            silent: data.silent || undefined,
            badge: data.badge || undefined,
            data: data,
            icon: data.icon || undefined
        }));
    }
    else if (data.type == "notifications") {
        const notifications = data.notifications || [];
        const sendAll = async () => {
            for (const notification of notifications) {
                await self.registration.showNotification(notification.title, {
                    body: notification.body || "",
                    tag: notification.tag || undefined,
                    silent: notification.silent || undefined,
                    badge: notification.badge || undefined,
                    data: notification.data || undefined,
                    icon: notification.icon || undefined
                });
            }
        };
        event.waitUntil(sendAll());
    }
});

