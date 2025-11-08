import Utils from "../Utils";

export type Notification = {
    body: string;
    title: string;
    tag: string;
}

export default class NotificationManager {

    private static hasUnread = false;

    public static async initNotificationManager() {

        const notificationBell = document.querySelector("#notificationsBell") as HTMLElement;
        if (notificationBell) {
            notificationBell.addEventListener("mouseover", async () => {
                if (!this.hasUnread) return;
                console.log("Mouse Over");
                this.clearNotifications();
                await this.convertUnreadToPastNotifications();
                this.checkForNotificationsOnHtmlElements();
                // this.updateList(true);
                this.hasUnread = false;
            });
        }

        const markAllRead = document.querySelector("#notificationsBell .markAllRead") as HTMLElement;
        if (markAllRead) {
            markAllRead.addEventListener("click", async () => {
                await this.clearNotifications();
                await Utils.saveInDB("NotificationStorage", "notifications", "unread", []);
                await Utils.saveInDB("NotificationStorage", "notifications", "notifications", []);
                await this.updateList();
            });
        }

        this.updateList();
    }

    public static async checkForNotificationsOnHtmlElements() {
        const hamburgerHeader = document.querySelector("header.hamburger");
        const notificationsDiv = document.querySelector("#notificationsBell");
        const notificationList = document.querySelector("#notificationsBell .notificationList");
        if (!hamburgerHeader) return;
        if (!notificationsDiv) return;
        if (!notificationList) return;

        const notifications = (await Utils.loadFromDB("NotificationStorage", "notifications", "unread") ?? []) as Notification[];
        if (notifications.length <= 0) {
            hamburgerHeader.classList.add("noNotifications");
            notificationsDiv.classList.add("noNotifications");
        } else {
            hamburgerHeader.classList.remove("noNotifications");
            notificationsDiv.classList.remove("noNotifications");
            this.hasUnread = true;
        }
    }

    public static async convertUnreadToPastNotifications() {
        const notifications = (await Utils.loadFromDB("NotificationStorage", "notifications", "unread") ?? []) as Notification[];
        let oldNotifications = (await Utils.loadFromDB("NotificationStorage", "notifications", "notifications") ?? []) as Notification[];
        const oldTags = oldNotifications.map(e => e.tag);
        for (const notification of notifications) {
            if (oldTags.includes(notification.tag)) {
                oldNotifications = oldNotifications.filter(e => e.tag !== notification.tag);
            }
            oldNotifications.push(notification);
        }
        await Utils.saveInDB("NotificationStorage", "notifications", "unread", []);
        await Utils.saveInDB("NotificationStorage", "notifications", "notifications", oldNotifications);
    }

    public static async updateList() {
        const hamburgerHeader = document.querySelector("header.hamburger");
        const notificationsDiv = document.querySelector("#notificationsBell");
        const notificationList = document.querySelector("#notificationsBell .notificationList");
        if (!hamburgerHeader) return;
        if (!notificationsDiv) return;
        if (!notificationList) return;

        const notifications = (await Utils.loadFromDB("NotificationStorage", "notifications", "unread") ?? []) as Notification[];
        const oldNotifications = (await Utils.loadFromDB("NotificationStorage", "notifications", "notifications") ?? []) as Notification[];
        if (notifications.length <= 0) {
            hamburgerHeader.classList.add("noNotifications");
            notificationsDiv.classList.add("noNotifications");
        } else {
            hamburgerHeader.classList.remove("noNotifications");
            notificationsDiv.classList.remove("noNotifications");
            this.hasUnread = true;
        }
        [...notificationList.children].forEach(e => {
            console.log(e);
            if (e instanceof HTMLElement && e.classList.contains("markAllRead")) return;
            e.remove();
        });

        if (oldNotifications.length == 0 && notifications.length == 0) return;

        hamburgerHeader.setAttribute("data-notificationCount", notifications.length + "");
        notificationsDiv.setAttribute("data-notificationCount", notifications.length + "");

        const add = (notification: Notification, isOld: boolean) => {

            const notificationWrapper = document.createElement("div");
            const titleE = document.createElement("h3");
            const textE = document.createElement("p");
            const closeE = document.createElement("button");
            titleE.innerText = notification.title || "";
            textE.innerText = notification.body || "";
            titleE.innerText = notification.title || "";
            closeE.innerHTML = "&checkmark;";

            notificationWrapper.classList.add("notificationWrapper");
            if (isOld) notificationWrapper.classList.add("old");
            titleE.classList.add("title");
            textE.classList.add("text");
            closeE.classList.add("close");

            closeE.addEventListener("click", async () => {
                const contains = await Utils.contains("NotificationStorage", "notifications");
                if (!contains) return;
                let oldNotifications = await Utils.loadFromDB("NotificationStorage", "notifications", "notifications") as Notification[];
                oldNotifications = oldNotifications.filter(e => e.tag !== notification.tag);
                await Utils.saveInDB("NotificationStorage", "notifications", "notifications", oldNotifications);
                notificationList.removeChild(notificationWrapper);
            });

            notificationWrapper.appendChild(titleE);
            notificationWrapper.appendChild(textE);
            notificationWrapper.appendChild(closeE);
            notificationList.appendChild(notificationWrapper);
        };

        notifications.forEach(e => add(e, false));
        oldNotifications.forEach(e => add(e, true));

    }

    public static async clearNotifications() {
        if (!navigator.clearAppBadge) return;
        const badgeCount = await Utils.loadFromDB("NotificationStorage", "notifications", "badgeCount") ?? {};
        badgeCount.value = 0;
        await Utils.saveInDB("NotificationStorage", "notifications", "badgeCount", badgeCount);
        navigator.clearAppBadge();
    }

}