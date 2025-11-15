import dayjs from "dayjs";
import Utils from "../../src/ts/Utils";
import { HOST } from "../../src/ts/ScheduleDarius_old";


type ForgotPasswordResponse = {
    status: "success" | "error";
    message: string;
};

async function init() {

    if (localStorage.getItem("jwt")) {
        if (localStorage.getItem("allowedUntil")) {
            const allowedUntil = localStorage.getItem("allowedUntil");
            if (allowedUntil) {
                const allowedUntilParsed = parseInt(allowedUntil) * 1000;
                const allowedUntilDate = new Date(allowedUntilParsed);
                if (dayjs(allowedUntilDate).isAfter(new Date())) {
                    location.replace("/");
                }
            }
        }
    }

    const resetBtn = document.getElementById('resetBtn') as HTMLButtonElement;
    const username = document.getElementById("username") as HTMLInputElement;
    const email = document.getElementById("email") as HTMLInputElement;

    const login = async () => {
        const valueUsername = username.value;
        const valueEmail = email.value;

        if (valueUsername.trim().length == 0 || valueEmail.trim().length == 0) {
            Utils.error("Username or Email can't be empty");
            return;
        }

        try {

            const response = await (await fetch(HOST + "/users/forgotPassword.php?noCache", {
                method: "post",
                body: JSON.stringify({
                    username: valueUsername,
                    email: valueEmail
                }),
                mode: "cors"
            })).json() as ForgotPasswordResponse;

            if (response) {
                if (response.status == "error") {
                    Utils.error(response.message);
                    return;
                } else {
                    Utils.success(response.message);
                    return;
                }
            } else {
                Utils.error("Server error! Please try again later");
            }
        } catch (e) {
            console.log(e);
            Utils.error("Client error! Please try again later");
        }

    };

    resetBtn.addEventListener('click', login);
}

init();