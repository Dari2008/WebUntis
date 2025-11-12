
import StartToastifyInstance from "toastify-js";
import { v4 } from "uuid";
import type { CompiledLesson } from "./@types/Schedule";
import { UserManagement } from "./userManagement/UserManagement";


declare class Toastify {
    readonly options: StartToastifyInstance.Options;
    readonly toastElement: Element | null;
    showToast(): void;
    hideToast(): void;
}

export default class Utils {

    private static MESSAGE_TAGS_SUCCESS: {
        [key: string]: Toastify;
    } = {};
    private static MESSAGE_TAGS_ERRORS: {
        [key: string]: Toastify;
    } = {};

    static error(text: string, tag?: string) {
        if (tag && Utils.MESSAGE_TAGS_ERRORS[tag]) {

            const toast = Utils.MESSAGE_TAGS_ERRORS[tag];
            if (toast.toastElement) toast.toastElement.innerHTML = text;

            toast.toastElement?.dispatchEvent(new MouseEvent("mouseover"));
            toast.toastElement?.dispatchEvent(new MouseEvent("mouseleave"));

            return;
        }

        const toast = StartToastifyInstance({
            text: text,
            duration: 3000,
            position: "right",
            stopOnFocus: true,
            gravity: "bottom",
            style: {
                background: "linear-gradient(135deg, #ff7373, #f55454)",
                boxShadow: "0 3px 6px -1px rgba(0, 0, 0, 0.12), 0 10px 36px -4px rgba(232, 77, 77, 0.3)"
            }
        });
        toast.showToast();

        if (tag) Utils.MESSAGE_TAGS_ERRORS[tag] = toast;

    }

    static success(text: string, tag?: string) {
        if (tag && Utils.MESSAGE_TAGS_SUCCESS[tag]) {

            const toast = Utils.MESSAGE_TAGS_SUCCESS[tag];
            if (toast.toastElement) toast.toastElement.innerHTML = text;

            toast.toastElement?.dispatchEvent(new MouseEvent("mouseover"));
            toast.toastElement?.dispatchEvent(new MouseEvent("mouseleave"));

            const isVisible = toast.toastElement?.checkVisibility();

            if (!isVisible) {
                toast.showToast();
            }

            return;
        }

        const toast = StartToastifyInstance({
            text: text,
            duration: 3000,
            position: "right",
            stopOnFocus: true,
            gravity: "bottom",
            style: {
                background: "linear-gradient(135deg, #83ff73ff, #54f554ff)",
                boxShadow: "0 3px 6px -1px rgba(0, 0, 0, 0.12), 0 10px 36px -4px rgba(90, 232, 77, 0.3)"
            }
        });
        toast.showToast();

        if (tag) Utils.MESSAGE_TAGS_SUCCESS[tag] = toast;
    }

    static uuidv4() {
        return v4();
    }

    static uuidv4Exclude(allreadyused: string[]) {
        let uuid = null;
        do {
            uuid = v4();
        } while (allreadyused.includes(uuid));
        return uuid;
    }


    static checkForExam(lesson: CompiledLesson): boolean {
        const date = this.parseDate(lesson.date);
        return UserManagement.ALL_DATA!.exams.some(exam => (exam.sign === (lesson.studentGroup ? lesson.studentGroup : lesson.sg)) && exam.date === date);
    }


    static parseDate(date: number): string {
        const dateString = date.toString();
        const day = dateString.substring(6, 8);
        const month = dateString.substring(4, 6);
        const year = dateString.substring(0, 4);
        if (year !== new Date().getFullYear().toString()) return "";
        return `${day}.${month}`;
    }


    static addOnclickOutside(element: HTMLElement, closeCallback: () => void): (() => void) {
        const onclick = (e: Event) => {
            if (!e.target) return;
            if (element.contains(e.target as Node)) return;
            removeListeners();
            closeCallback();
        };

        const onkeyboard = (e: KeyboardEvent) => {
            if (e.code == "Escape") {

                removeListeners();
                closeCallback();
                e.preventDefault();
                e.stopPropagation();
            }
        };
        const removeListeners = () => {
            document.removeEventListener("keydown", onkeyboard);
            document.removeEventListener("keyup", onkeyboard);
            document.removeEventListener("click", onclick);
        };

        document.addEventListener("click", onclick);
        document.addEventListener("keydown", onkeyboard);
        document.addEventListener("keyup", onkeyboard);

        return removeListeners;
    }


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
        });
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

    public static clearAllDBs() {
        indexedDB.deleteDatabase("OfflineData");
        indexedDB.deleteDatabase("NotificationStorage");
    }

}