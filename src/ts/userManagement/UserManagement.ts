import dayjs from "dayjs";
import type { Exam, ExamList } from "../@types/Exam";
import type { BreaksRawByDay, DayName, LessonRaw, LessonTime, LessonTimes, LessonTimesString, ScheduleRawData } from "../@types/Schedule";
import type { School } from "../@types/School";
import type { TeacherDatabase } from "../@types/Teachers";
import type { UntisAccess } from "../@types/UntisAccess";
import type { AllData, SchoolTimes, UpdateDataBreaks, UpdateDataExams, UpdateDataIllDays, UpdateDataPreferences, UpdateDataSchedule, UpdateDataTeachers, UpdateDataUntisAccess, UpdateMethod } from "../@types/UserManagement";
import { HOST } from "../ScheduleDarius_old";
import UntisManager from "../untis/UntisManager";
import Utils from "../Utils";
import { SettingsScheduleList } from "../customSettings/SettingsScheduleList";

type RequestResponse = {
    status: "error" | "success";
    errorMessage?: string;
    [key: string]: any;
}

type UpdateResponse = {
    success: boolean;
    schoolTimes?: SchoolTimes;
}

export class UserManagement {

    public static jwt = "";
    public static allowedUntil = 0;
    public static validJwt = false;
    public static ALL_DATA: AllData | undefined;

    public static init() {
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
    }

    public static async logout() {
        localStorage.setItem("allowedUntil", "");
        localStorage.setItem("jwt", "");
        localStorage.setItem("endpointLastValue", "");
        Utils.clearAllDBs();
        location.replace("/login/");
    }

    public static async loadAll(): Promise<boolean | AllData> {
        if (!navigator.onLine) {
            const localStorageOfflineData = await Utils.loadFromDB("OfflineData", "OfflineAllData", "OFFLINE_ALL_DATA");
            if (localStorageOfflineData) {
                const all = localStorageOfflineData as AllData;
                this.compileAll(all);
                this.ALL_DATA = all;
                return all;
            } else {
                Utils.error("You Are offline! <br> No offline Data available!");
                return {} as any;
            }
        }
        if (this.ALL_DATA) return this.ALL_DATA;
        const result = await this.request(HOST + "/users/data/getData.php", { "jwt": this.jwt, dataType: "allData" });
        if (!result) return false;
        const all = result as AllData;
        this.compileAll(all);
        this.ALL_DATA = all;
        Utils.saveInDB("OfflineData", "OfflineAllData", "OFFLINE_ALL_DATA", this.ALL_DATA);
        return all;
    }

    private static compileAll(all: AllData) {
        function getEndOfLesson(start: string): string {
            const parsed = UntisManager.parseTime(start);
            parsed.minute += 45;
            if (parsed.minute >= 60) {
                parsed.minute = parsed.minute % 60;
                parsed.hour += 1;
                if (parsed.hour >= 24) {
                    parsed.hour = 0;
                }
            }
            return parsed.hour.toString().padStart(2, "0") + ":" + parsed.minute.toString().padStart(2, "0");
        }

        function compileScheduleToLessonTimes(): LessonTimes {
            const times: LessonTimes = {};

            for (const day of Object.keys(all.schedule) as DayName[]) {
                const dayLessons = all.schedule[day];
                if (!dayLessons) continue;
                for (const lessonTime of Object.keys(dayLessons) as string[]) {
                    const element = (dayLessons as any)[lessonTime as string] as LessonRaw;
                    if (!element || !element.school) continue;
                    if (!times[element.school]) {
                        times[element.school] = [];
                    }
                    times[element.school]?.push({
                        start: lessonTime,
                        end: getEndOfLesson(lessonTime)
                    })

                }
            }

            const filtered: LessonTimes = {};

            const contains = (lessonTimes: LessonTime[], search: LessonTime): boolean => {
                for (const l of lessonTimes) {
                    if (l.end == search.end && l.start == search.start) return true;
                }
                return false;
            };

            for (const school of Object.keys(times) as School[]) {
                if (!filtered[school]) filtered[school] = [];
                if (!times[school]) continue;
                for (const time of times[school]) {
                    if (time.start == time.end) continue;
                    if (contains(filtered[school], time)) continue;
                    filtered[school].push(time);
                }
            }


            return filtered;
        }

        const allSchools = new Set<School>();
        all.untisAccesses.map(e => e.school).forEach(s => allSchools.add(s));
        Object.values(all.breaks).flat().forEach(b => allSchools.add(b.school));

        all.schools = Array.from(allSchools).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));
        all.LESSON_TIMES = compileScheduleToLessonTimes();
        all.LESSON_TIMES_STRING = (() => {

            const times: LessonTimesString = {};

            for (const key of Object.keys(all.LESSON_TIMES) as School[]) {
                if (!key) continue;
                if (!all.LESSON_TIMES[key]) continue;
                for (const time of all.LESSON_TIMES[key]) {
                    if (!time) continue;
                    if (!times[key]) times[key] = [];
                    times[key].push(time.end);
                    times[key].push(time.start);
                }
            }



            return times;

        })();

        all.START_TIME = UntisManager.parseTime(Object.values(all.LESSON_TIMES).flat().reduce((a, b) => {
            const parsedStartA = UntisManager.parseTime(a.start);
            const parsedStartB = UntisManager.parseTime(b.start);

            const minutesStartA = parsedStartA.hour * 60 + parsedStartA.minute;
            const minutesStartB = parsedStartB.hour * 60 + parsedStartB.minute;

            if (minutesStartA < minutesStartB) return a;
            return b;
        }, { start: "8:00" }).start);

        all.END_TIME = UntisManager.parseTime(Object.values(all.LESSON_TIMES).flat().reduce((a, b) => {
            const parsedEndA = UntisManager.parseTime(a.end);
            const parsedEndB = UntisManager.parseTime(b.end);

            const minutesEndA = parsedEndA.hour * 60 + parsedEndA.minute;
            const minutesEndB = parsedEndB.hour * 60 + parsedEndB.minute;

            if (minutesEndA < minutesEndB) return b;
            return a;
        }, { end: "16:00" }).end);

        all.exams = all.exams.sort((a: Exam, b: Exam) => {
            return dayjs(a.date, "DD.MM.YYYY").diff(dayjs(b.date, "DD.MM.YYYY"));
        });

    }




    public static async getUntisAccesses(): Promise<UntisAccess[] | boolean> {
        const result = await this.request(HOST + "/users/data/getData.php", { "jwt": this.jwt, dataType: "untisAccesses" });
        if (!result) return false;
        return result as UntisAccess[];
    }

    public static async getBreaks(): Promise<BreaksRawByDay | boolean> {
        const result = await this.request(HOST + "/users/data/getData.php", { "jwt": this.jwt, dataType: "breaks" });
        if (!result) return false;
        return result as BreaksRawByDay;
    }

    public static async getTeachers(): Promise<TeacherDatabase | boolean> {
        const result = await this.request(HOST + "/users/data/getData.php", { "jwt": this.jwt, dataType: "teachers" });
        if (!result) return false;
        return result as TeacherDatabase;
    }

    public static async getSchedule(): Promise<ScheduleRawData | boolean> {
        const result = await this.request(HOST + "/users/data/getData.php", { "jwt": this.jwt, dataType: "schedule" });
        if (!result) return false;
        return result as ScheduleRawData;
    }


    public static async getIllDates(): Promise<UntisAccess[] | boolean> {
        const result = await this.request(HOST + "/users/data/getData.php", { "jwt": this.jwt, dataType: "illDates" });
        if (!result) return false;
        return result as UntisAccess[];
    }

    public static async getExams(): Promise<ExamList | boolean> {
        const result = await this.request(HOST + "/users/data/getData.php", { "jwt": this.jwt, dataType: "exams" });
        if (!result) return false;
        return result as ExamList;
    }

    private static async request(url: string, payload: any): Promise<boolean | any> {
        const result = await (await fetch(url + "?noCache", {
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
        const result = await this.request(HOST + "/users/data/updateData.php", {
            "jwt": this.jwt,
            dataType: "untisAccesses",
            data: data,
            updateMethod: updateMethod
        }) as UpdateResponse;
        if (!result) return false;

        if (result.schoolTimes) {
            this.ALL_DATA!.schoolTimes = result.schoolTimes;
            SettingsScheduleList.INSTANCES.forEach(e => e.updateTable());
        }

        return result.success;
    }

    public static async updateBreaks(updateMethod: UpdateMethod, data: UpdateDataBreaks): Promise<boolean> {
        const result = await this.request(HOST + "/users/data/updateData.php", {
            "jwt": this.jwt,
            dataType: "breaks",
            data: data,
            updateMethod: updateMethod
        }) as UpdateResponse;
        if (!result) return false;
        return result.success;
    }

    public static async updateTeachers(updateMethod: UpdateMethod, data: UpdateDataTeachers): Promise<boolean> {
        const result = await this.request(HOST + "/users/data/updateData.php", {
            "jwt": this.jwt,
            dataType: "teachers",
            data: data,
            updateMethod: updateMethod
        }) as UpdateResponse;
        if (!result) return false;
        return result.success;
    }

    public static async updateSchedule(updateMethod: UpdateMethod, data: UpdateDataSchedule): Promise<boolean> {
        const result = await this.request(HOST + "/users/data/updateData.php", {
            "jwt": this.jwt,
            dataType: "schedule",
            data: data,
            updateMethod: updateMethod
        }) as UpdateResponse;
        if (!result) return false;
        return result.success;
    }

    public static async updateExams(updateMethod: UpdateMethod, data: UpdateDataExams): Promise<boolean> {
        const result = await this.request(HOST + "/users/data/updateData.php", {
            "jwt": this.jwt,
            dataType: "exams",
            data: data,
            updateMethod: updateMethod
        }) as UpdateResponse;
        if (!result) return false;
        return result.success;
    }

    public static async updateIllDays(updateMethod: UpdateMethod | "update", data: UpdateDataIllDays): Promise<boolean> {
        const result = await this.request(HOST + "/users/data/updateData.php", {
            "jwt": this.jwt,
            dataType: "illDates",
            data: data,
            updateMethod: updateMethod
        }) as UpdateResponse;
        if (!result) return false;
        return result.success;
    }

    public static async updatePreferences(data: UpdateDataPreferences): Promise<boolean> {
        const result = await this.request(HOST + "/users/data/updateData.php", {
            "jwt": this.jwt,
            dataType: "preferences",
            data: data
        }) as UpdateResponse;
        if (!result) return false;
        return result.success;
    }

}