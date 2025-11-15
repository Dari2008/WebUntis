import dayjs from "dayjs";
import Utils from "../../src/ts/Utils";
import { HOST } from "../../src/ts/ScheduleDarius_old";


type ResetPasswordResponse = {
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

    const parsedUrlArgs = new URLSearchParams(location.search);

    const errorParsingJWT = () => {
        Utils.error("No access to reset password!");
        setTimeout(() => {
            location.replace("/");
        });
    };

    if (!parsedUrlArgs.has("jwt")) {
        return errorParsingJWT();
    }

    const jwt = parsedUrlArgs.get("jwt");
    if (!jwt) {
        return errorParsingJWT();
    }

    const resetBtn = document.getElementById('resetBtn') as HTMLButtonElement;
    const newPassword = document.getElementById("newPassword") as HTMLInputElement;
    const newPasswordCheck = document.getElementById("newPasswordCheck") as HTMLInputElement;

    const login = async () => {
        const newPasswordValue = newPassword.value;
        const newPasswordValueCheck = newPasswordCheck.value;

        if (newPasswordValue.trim().length == 0 || newPasswordValueCheck.trim().length == 0) {
            Utils.error("Passwords can't be empty");
            return;
        }

        if (newPasswordValue !== newPasswordValueCheck) {
            Utils.error("Passwords don't match!");
            return;
        }

        try {

            const response = await (await fetch(HOST + "/users/changePassword.php?noCache", {
                method: "post",
                body: JSON.stringify({
                    jwt: jwt,
                    newPassword: newPasswordValue
                }),
                mode: "cors"
            })).json() as ResetPasswordResponse;

            if (response) {
                if (response.status == "error") {
                    Utils.error(response.message);
                    return;
                } else {
                    Utils.success(response.message);
                    setTimeout(() => {
                        location.replace("/login/");
                    }, 2000);
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