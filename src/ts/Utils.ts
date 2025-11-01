
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

}