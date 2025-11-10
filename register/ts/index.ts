import dayjs from "dayjs";
import Utils from "../../src/ts/Utils";
import { HOST } from "../../src/ts/ScheduleDarius_old";



type LoginResponse = {
    jwt: string;
    allowedUntil: number;
    status: "error" | "success";
    message?: string;
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

    const registerBtn = document.getElementById('registerBtn') as HTMLButtonElement;
    const username = document.getElementById("username") as HTMLInputElement;
    const password = document.getElementById("password") as HTMLInputElement;
    const email = document.getElementById("email") as HTMLInputElement;
    registerBtn.addEventListener('click', async () => {
        const valueUsername = username.value;
        const valuePassword = password.value;
        const valueEmail = email.value;

        if (valueUsername.trim().length == 0 || valuePassword.trim().length == 0 || valueEmail.trim().length == 0) {
            Utils.error("Username, Password and Email are required");
            return;
        }

        if (!email.validity.valid || email.validity.patternMismatch) {
            Utils.error("Invalid Email");
            return;
        }

        try {

            const response = await (await fetch(HOST + "/users/register.php?noCache", {
                method: "post",
                body: JSON.stringify({
                    username: valueUsername,
                    password: valuePassword,
                    email: valueEmail
                }),
                mode: "cors"
            })).json() as LoginResponse;

            if (response) {
                if (response.jwt) {
                    Utils.success("Successfully Registered");
                    localStorage.setItem("jwt", response.jwt);
                    localStorage.setItem("allowedUntil", response.allowedUntil + "");
                    setTimeout(() => {
                        location.replace("/");
                    }, 1000)
                } else if (response.status == "error") {
                    if (response.message) Utils.error(response.message);
                    else Utils.error("Server error! Please try again later");
                }
            } else {
                Utils.error("Server error! Please try again later");
            }
        } catch (e) {
            console.log(e);
            Utils.error("Client error! Please try again later");
        }

    });
}

init();