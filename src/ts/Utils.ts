
import Toastify from "toastify-js";

export default class Utils {
    static error(text: string) {

        const toast = Toastify({
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
    }

    static success(text: string) {
        const toast = Toastify({
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
    }
}