import { HOST } from "../ScheduleDarius_old";
import { UserManagement } from "../userManagement/UserManagement";
import { UAParser } from "ua-parser-js";

export type PushSubscriptionData = PushSubscriptionJSON & {
    userAgentData: PushSubscriptionUserAgentData;
}

export type PushSubscriptionUserAgentData = {
    osName: string;
    platform: string;
    browserName: string;
}

export class PushService {

    public static pushSubscription: PushSubscriptionData | null = null;

    public static async updateEndpoint(force: boolean = false): Promise<boolean> {
        if (!this.isSupported()) return false;

        if (Notification.permission != "granted") {
            const allowed = await this.requestPermission();
            if (!allowed) return false;
        }

        const needNewEndpoint = await this.checkForNewEndpoint();
        if (!needNewEndpoint && !force) {
            return await this.updatePushSubscription();
        }
        await this.loadEndpoint();

        const response = await (await fetch("http://" + HOST + "/untis/users/notifications/updateEndpoint.php?noCache", {
            method: "POST",
            body: JSON.stringify({
                jwt: UserManagement.jwt,
                endpoint: this.pushSubscription,
                action: "update"
            })
        })).json();

        if (response.status == "success") return true;
        return false;
    }


    private static getUserAgentData(): { osName: string; platform: string; browserName: string } {
        const parser = new UAParser();
        const ua = parser.getResult();
        return {
            osName: ua.os.name || "Unknown",
            browserName: ua.browser.name || "Unknown",
            platform: ua.device.type || "Desktop"
        }
    }

    public static async updatePushSubscription(): Promise<boolean> {
        const serviceWorker = await navigator.serviceWorker.ready;
        const sub = await serviceWorker.pushManager.getSubscription();
        if (sub) {
            this.pushSubscription = {
                ...sub.toJSON(),
                userAgentData: this.getUserAgentData()
            };
            return true;
        }
        return false;
    }

    private static async checkForNewEndpoint(): Promise<boolean> {
        const serviceWorker = await navigator.serviceWorker.ready;
        const sub = await serviceWorker.pushManager.getSubscription();
        if (sub) {
            const lastValue = localStorage.getItem("endpointLastValue")
            if (!lastValue) {
                return true;
            }
            if (lastValue != sub.endpoint) return true;
            return false;
        }
        return true;
    }

    private static getPublicKey(): string {
        return "BMxbneXZpRFm3VOFcmRMqQoeUf0Cab_80cpOHDAbtOfcIuQGm8R34EXOFTXf1V-9Xfcw8Y7EQ1qVHgKDis8OUlk";
    }

    private static async loadEndpoint(): Promise<void> {
        const serviceWorker = await navigator.serviceWorker.ready;
        const registrationResult = await serviceWorker.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: this.getPublicKey() })
        this.pushSubscription = {
            ...registrationResult.toJSON(),
            userAgentData: this.getUserAgentData()
        };
        if (this.pushSubscription.endpoint) localStorage.setItem("endpointLastValue", this.pushSubscription.endpoint)
    }

    public static async disablePushNotifications(): Promise<boolean> {
        if (!this.pushSubscription) return false;
        const result = await (await fetch("http://" + HOST + "/untis/users/notifications/updateEndpoint.php?noCache", {
            method: "POST",
            body: JSON.stringify({
                jwt: UserManagement.jwt,
                endpoint: this.pushSubscription,
                action: "remove"
            })
        })).json();

        if (result.status == "success") {
            const serviceWorker = await navigator.serviceWorker.ready;
            const sub = await serviceWorker.pushManager.getSubscription();
            sub?.unsubscribe();
            this.pushSubscription = null;
            localStorage.removeItem("endpointLastValue");
            return true;
        }
        return false;
    }

    public static async getAllSubscriptions(): Promise<PushSubscriptionData[]> {
        const response = await (await fetch("http://" + HOST + "/untis/users/notifications/getAllSubscriptions.php?noCache", {
            method: "POST",
            body: JSON.stringify({
                jwt: UserManagement.jwt
            }),
            headers: {
                "Content-Type": "application/json"
            }
        })).json();

        if (response.status == "success") {
            return response.endpoints;
        }
        return [];
    }

    public static async removePushSubscription(endpointData: PushSubscriptionData): Promise<boolean> {
        const response = await (await fetch("http://" + HOST + "/untis/users/notifications/updateEndpoint.php?noCache", {
            method: "POST",
            body: JSON.stringify({
                jwt: UserManagement.jwt,
                endpoint: endpointData,
                action: "remove"
            })
        })).json();

        if (response.status == "success") return true;
        return false;

    }

    public static async isPushEnabled(): Promise<boolean> {
        if (!this.isSupported()) return false;
        const serviceWorker = await navigator.serviceWorker.ready;
        const sub = await serviceWorker.pushManager.getSubscription();
        return sub !== null;
    }
    public static async requestPermission(): Promise<boolean> {
        const response = await Notification.requestPermission();
        if (response == "granted") return true;
        return false;
    }

    public static isSupported(): boolean {
        return "Notification" in window && "serviceWorker" in navigator && "PushManager" in window;
    }

}