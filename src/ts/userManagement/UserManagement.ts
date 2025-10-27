import type { ExamList } from "../@types/Exam";
import type { BreaksRawByDay, ScheduleRawData } from "../@types/Schedule";
import type { School } from "../@types/School";
import type { TeacherDatabase } from "../@types/Teachers";
import type { AllData, UpdateDataBreaks, UpdateDataExams, UpdateDataPreferences, UpdateDataSchedule, UpdateDataTeachers, UpdateDataUntisAccess, UpdateMethod } from "../@types/UserManagement";
import { HOST, type UntisAccess } from "../ScheduleDarius";
import Utils from "../Utils";

type RequestResponse = {
    status: "error" | "success";
    errorMessage?: string;
    [key: string]: any;
}

type UpdateResponse = {
    success: boolean;
}

export class UserManagement {

    public static jwt = "";
    public static allowedUntil = 0;
    public static validJwt = false;

    public static async init() {
        const goToLogin = () => {
            localStorage.setItem("allowedUntil", "");
            localStorage.setItem("jwt", "");
            location.replace("/login/");
        };

        if (localStorage.getItem("jwt")) {
            this.jwt = localStorage.getItem("jwt") || "";
            if (localStorage.getItem("allowedUntil")) {
                this.allowedUntil = parseInt(localStorage.getItem("allowedUntil") || "-1");
                if (this.allowedUntil == -1) {
                    goToLogin();
                    return;
                }
            }
            if (!this.jwt) {
                goToLogin();
                return;
            }
        } else {
            goToLogin();
            return;
        }
        this.validJwt = true;

        console.log(await this.loadAll());
    }

    public static async loadAll(): Promise<boolean | AllData> {
        const result = await this.request("http://" + HOST + "/untis/users/data/getData.php", { "jwt": this.jwt, dataType: "allData" });
        if (!result) return false;
        const all = result as AllData;
        all.schools = all.untisAccesses.map(e => e.school) as School[];
        return all;
    }

    public static async getUntisAccesses(): Promise<UntisAccess[] | boolean> {
        const result = await this.request("http://" + HOST + "/untis/users/data/getData.php", { "jwt": this.jwt, dataType: "untisAccesses" });
        if (!result) return false;
        return result as UntisAccess[];
    }

    public static async getBreaks(): Promise<BreaksRawByDay | boolean> {
        const result = await this.request("http://" + HOST + "/untis/users/data/getData.php", { "jwt": this.jwt, dataType: "breaks" });
        if (!result) return false;
        return result as BreaksRawByDay;
    }

    public static async getTeachers(): Promise<TeacherDatabase | boolean> {
        const result = await this.request("http://" + HOST + "/untis/users/data/getData.php", { "jwt": this.jwt, dataType: "teachers" });
        if (!result) return false;
        return result as TeacherDatabase;
    }

    public static async getSchedule(): Promise<ScheduleRawData | boolean> {
        const result = await this.request("http://" + HOST + "/untis/users/data/getData.php", { "jwt": this.jwt, dataType: "schedule" });
        if (!result) return false;
        return result as ScheduleRawData;
    }

    public static async getExams(): Promise<ExamList | boolean> {
        const result = await this.request("http://" + HOST + "/untis/users/data/getData.php", { "jwt": this.jwt, dataType: "exams" });
        if (!result) return false;
        return result as ExamList;
    }

    private static async request(url: string, payload: any): Promise<boolean | any> {
        const result = await (await fetch(url, {
            body: JSON.stringify(payload),
            mode: "cors",
            method: "post"
        })).json() as RequestResponse;

        if (result.status == "error") {
            if (result.errorMessage) Utils.error(result.errorMessage);
            else Utils.error("Error loading Data");
            return false;
        } else {
            return result ?? {};
        }
    }

    public static async updateUntisAccesses(updateMethod: UpdateMethod, data: UpdateDataUntisAccess): Promise<boolean> {
        const result = await this.request("http://" + HOST + "/untis/users/data/updateData.php", {
            "jwt": this.jwt,
            dataType: "untisAccesses",
            data: data,
            updateMethod: updateMethod
        }) as UpdateResponse;
        if (!result) return false;
        return result.success;
    }

    public static async updateBreaks(updateMethod: UpdateMethod, data: UpdateDataBreaks): Promise<boolean> {
        const result = await this.request("http://" + HOST + "/untis/users/data/updateData.php", {
            "jwt": this.jwt,
            dataType: "breaks",
            data: data,
            updateMethod: updateMethod
        }) as UpdateResponse;
        if (!result) return false;
        return result.success;
    }

    public static async updateTeachers(updateMethod: UpdateMethod, data: UpdateDataTeachers): Promise<boolean> {
        const result = await this.request("http://" + HOST + "/untis/users/data/updateData.php", {
            "jwt": this.jwt,
            dataType: "teachers",
            data: data,
            updateMethod: updateMethod
        }) as UpdateResponse;
        if (!result) return false;
        return result.success;
    }

    public static async updateSchedule(updateMethod: UpdateMethod, data: UpdateDataSchedule): Promise<boolean> {
        const result = await this.request("http://" + HOST + "/untis/users/data/updateData.php", {
            "jwt": this.jwt,
            dataType: "schedule",
            data: data,
            updateMethod: updateMethod
        }) as UpdateResponse;
        if (!result) return false;
        return result.success;
    }

    public static async updateExams(updateMethod: UpdateMethod, data: UpdateDataExams): Promise<boolean> {
        const result = await this.request("http://" + HOST + "/untis/users/data/updateData.php", {
            "jwt": this.jwt,
            dataType: "exams",
            data: data,
            updateMethod: updateMethod
        }) as UpdateResponse;
        if (!result) return false;
        return result.success;
    }

    public static async updatePreferences(data: UpdateDataPreferences): Promise<boolean> {
        const result = await this.request("http://" + HOST + "/untis/users/data/updateData.php", {
            "jwt": this.jwt,
            dataType: "preferences",
            data: data
        }) as UpdateResponse;
        if (!result) return false;
        return result.success;
    }

}