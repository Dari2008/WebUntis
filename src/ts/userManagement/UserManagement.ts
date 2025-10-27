import type { ExamList } from "../@types/Exam";
import type { BreaksRawByDay } from "../@types/Schedule";
import type { School } from "../@types/School";
import type { TeacherDatabase } from "../@types/Teachers";
import { HOST, type UntisAccess } from "../ScheduleDarius";
import Utils from "../Utils";

type RequestResponse = {
    status: "error" | "success";
    errorMessage?: string;
    [key: string]: any;
}

export type All = {
    untisAccesses: UntisAccess[];
    breaks: BreaksRawByDay;
    teachers: TeacherDatabase;
    exams: ExamList;
    schedule: ExamList;
    schools: School[];
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

    public static async loadAll(): Promise<boolean | All> {
        const result = await this.request("http://" + HOST + "/untis/users/data/getData.php", { "jwt": this.jwt, dataType: "allData" });
        if (!result) return false;
        const all = result as All;
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

    public static async getSchedule() {
        const result = await this.request("http://" + HOST + "/untis/users/data/getData.php", { "jwt": this.jwt, dataType: "schedule" });
        if (!result) return false;
        return result as ExamList;
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

}