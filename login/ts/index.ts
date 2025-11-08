import dayjs from "dayjs";
import Utils from "../../src/ts/Utils";


type LoginResponse = {
    jwt: string;
    allowedUntil: number;
    status: "success" | "error";
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

    const loginBtn = document.getElementById('loginBtn') as HTMLButtonElement;
    const username = document.getElementById("username") as HTMLInputElement;
    const password = document.getElementById("password") as HTMLInputElement;
    loginBtn.addEventListener('click', async () => {
        const valueUsername = username.value;
        const valuePassword = password.value;

        if (valueUsername.trim().length == 0 || valuePassword.trim().length == 0) {
            Utils.error("Username or Password can't be empty");
            return;
        }

        try {

            const response = await (await fetch("http://localhost:2222/untis/users/login.php?noCache", {
                method: "post",
                body: JSON.stringify({
                    username: valueUsername,
                    password: valuePassword
                }),
                mode: "cors"
            })).json() as LoginResponse;

            if (response) {
                if (response.status == "success" && response.jwt) {
                    Utils.success("Successfully Logged In!");
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
            Utils.error("Client error! Please try again later");
        }

    });
}

init();