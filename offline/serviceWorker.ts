
/// <reference lib="WebWorker" />

// export empty type because of tsc --isolatedModules flag
export { };
declare const self: ServiceWorkerGlobalScope;

self.addEventListener("install", (e) => {
    self.skipWaiting();
    e.waitUntil(loadResourcesToCache());
});

const CACHE_NAME = "offlineData_v1";

const CACHE_FILES: RequestInfo[] = [
    "/offline/offline.html"
];

const loadResourcesToCache = async () => {
    const cache = await caches.open(CACHE_NAME);
    cache.addAll(CACHE_FILES);
};

const checkForCacheMatch = async (request: Request): Promise<Response> => {

    try {

        const cache = await caches.open(CACHE_NAME);
        if (!navigator.onLine) {
            const cacheRes = await cache.match(request);
            if (cacheRes) return cacheRes;
            const fallback = await cache.match("./offline/offline.html");
            if (fallback) return fallback;
            return new Response("There Was an error on the client side! And btw you are offline!");
        }

        const netResponse = await fetch(request);
        // console.log(request);
        await cache.put(request, netResponse.clone());
        return netResponse;
    } catch (ex) {
        if (request.url.includes("?noCache")) {
            return new Response(ex + "");
        }
        const cache = await caches.open(CACHE_NAME);
        const fallback = await cache.match("./offline/offline.html");
        if (fallback) return fallback;
        return new Response("There Was an error on the client side! And btw you are offline!");
    }

}


self.addEventListener("fetch", async (event) => {
    if (event.request.url.includes("?noCache")) return;
    event.respondWith(checkForCacheMatch(event.request));
});



// Push Notifications


self.addEventListener("push", (event) => {
    if (!event.isTrusted) return;
    console.log("[Service Worker]: Received Push: ", event);
    if (!event.data) return;
    const data = event.data.json();

    if (data.type == "notification") {
        event.waitUntil(new Promise<void>(async (resolve, reject) => {

            await self.registration.showNotification(data.title, {
                body: data.body || "",
                tag: data.tag || undefined,
                silent: data.silent || undefined,
                badge: data.badge || undefined,
                data: data,
                icon: data.icon || undefined
            });
            await updateNotReadNotificationList([data]);
            await updateBadgeCount(1);
            await updateCurrentlyOpenedPages();
            resolve();
        }));
    } else if (data.type == "notifications") {
        const notifications = (data.notifications as any[]) || [];
        if (notifications.length == 0) return;
        const sendAll = async () => {
            for (const notification of notifications) {
                await self.registration.showNotification(notification.title, {
                    body: notification.body || "",
                    tag: notification.tag || undefined,
                    silent: notification.silent || undefined,
                    badge: notification.badge || undefined,
                    data: notification.data || undefined,
                    icon: notification.icon || undefined
                })
            }
            await updateNotReadNotificationList(notifications);
            await updateBadgeCount(notifications.length);
            await updateCurrentlyOpenedPages();
        };
        event.waitUntil(sendAll());
    }

});

async function updateCurrentlyOpenedPages() {
    const windows = await self.clients.matchAll({
        type: "window",
        includeUncontrolled: true
    });
    for (const window of windows) {
        window.postMessage({
            type: "newNotifications"
        });
    }
}

async function updateNotReadNotificationList(notificationsToAdd: any[]) {
    let notifications = (await Utils.loadFromDB("NotificationStorage", "notifications", "unread") ?? []) as any[];
    for (const notification of notificationsToAdd) {
        const found = notifications.find((a: any) => {
            return a.tag == notification.tag;
        });
        if (found) {
            notifications = notifications.filter(e => e !== found);
        }
        notifications.push(notification);
    }
    await Utils.saveInDB("NotificationStorage", "notifications", "unread", notifications);
}

async function updateBadgeCount(numberToAdd: number) {
    console.log(numberToAdd);
    if (!navigator.setAppBadge) return;
    const badgeCount = await Utils.loadFromDB("NotificationStorage", "notifications", "badgeCount") ?? {};
    if (!badgeCount.value) badgeCount.value = 0;
    badgeCount.value += numberToAdd;
    await Utils.saveInDB("NotificationStorage", "notifications", "badgeCount", badgeCount);
    await navigator.setAppBadge(badgeCount.value ?? 0);
}

class Utils {

    public static async openDB(DB_NAME: string, STORE_NAME: string): Promise<IDBDatabase> {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, 11);
            request.onupgradeneeded = event => {
                if (!event.target) return;
                const db = (event.target as IDBOpenDBRequest).result;
                // if (!db.objectStoreNames.contains(STORE_NAME)) {
                //     db.createObjectStore(STORE_NAME);
                // }

                if (DB_NAME == "NotificationStorage") {
                    if (db.objectStoreNames.contains("notifications")) {
                        db.deleteObjectStore("notifications");
                    }
                    db.createObjectStore("notifications");

                } else if (DB_NAME == "OfflineData") {
                    if (db.objectStoreNames.contains("OfflineAllData")) {
                        db.deleteObjectStore("OfflineAllData");
                    }
                    db.createObjectStore("OfflineAllData");

                    if (db.objectStoreNames.contains("OfflineStorageOfTimetable")) {
                        db.deleteObjectStore("OfflineStorageOfTimetable");
                    }
                    db.createObjectStore("OfflineStorageOfTimetable");

                    if (db.objectStoreNames.contains("UntisHolidays")) {
                        db.deleteObjectStore("UntisHolidays");
                    }
                    db.createObjectStore("UntisHolidays");
                }


            };

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }


    public static async contains(DB_NAME: string, STORE_NAME: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME);

            request.onsuccess = () => {
                const db = request.result;
                const hasStore = db.objectStoreNames.contains(STORE_NAME);
                db.close();
                resolve(hasStore);
            };

            request.onerror = () => reject(request.error);
            request.onblocked = () => reject(new Error("Database is blocked"));
        });
    }


    public static async saveInDB(DB_NAME: string, STORE_NAME: string, key: string, offlineData: any) {
        return new Promise<void>(async (resolve, reject) => {

            // const STORE_NAME = "OfflineStorageOfTimetable";
            // const DB_NAME = "OfflineData";
            const db = await this.openDB(DB_NAME, STORE_NAME);
            // const db = event.target.result;

            // Add data
            const tx = db.transaction(STORE_NAME, "readwrite");
            const store = tx.objectStore(STORE_NAME);
            store.put(offlineData, key);

            tx.oncomplete = () => resolve();
            tx.onerror = (e) => reject(e);
        })
    }

    public static async loadFromDB(DB_NAME: string, STORE_NAME: string, key: string): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {

            // const STORE_NAME = "OfflineStorageOfTimetable";
            // const DB_NAME = "OfflineData";
            const db = await this.openDB(DB_NAME, STORE_NAME);

            const tx2 = db.transaction(STORE_NAME, "readonly");
            const store2 = tx2.objectStore(STORE_NAME);
            const getRequest = store2.get(key);

            getRequest.onsuccess = () => {
                resolve(getRequest.result);
            };
            getRequest.onerror = reject;
        });
    }

}