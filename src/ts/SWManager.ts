import NotificationManager from "./notificationManager/NotificationManager";
import { PushService } from "./notifications/PushService";

export class SWManager {

    public static async install(pushNotifications: boolean) {
        if (!navigator.serviceWorker) return;
        const registration = await navigator.serviceWorker.register("/serviceWorker.js", {
            updateViaCache: "all"
        });
        registration.addEventListener("updatefound", () => {
            console.log("Found New Service Worker");
        });
        registration.update();
        if (registration.installing) {
            console.log("Service Worker Installing...");
        } else if (registration.active) {
            console.log("Service Worker Active");
            if (pushNotifications) {
                PushService.updateEndpoint().then(console.log);
            }
        }
        navigator.serviceWorker.addEventListener("message", (event) => {
            console.log(event);
            if (event.data.type == "newNotifications") {
                NotificationManager.updateList();
            }
        });
    }

}