import dayjs from "dayjs";
import type { School } from "../@types/School";
import { HOST } from "../ScheduleDarius_old";
import Utils from "../Utils";
import type { Holiday } from "./types";
import UntisManager from "./UntisManager";

export type CompiledHoliday = Holiday & {
    school: School;
    startDateParsed: Date;
    endDateParsed: Date;
}

export class HolidayLoader {

    constructor(private managers: UntisManager[]) { }

    public async getHolidays(): Promise<{ [key: string]: CompiledHoliday[] }> {
        const holidays: {
            [key: string]: Holiday[];
        } = {};


        const holidayLoadPromises: Promise<Holiday[]>[] = [];

        for (const manager of this.managers) {
            const promise = this.getHolidayOfManager(manager);
            promise.then(h => {
                holidays[manager.getSchoolUUID()] = h;
            })
            holidayLoadPromises.push(promise);
        }

        await Promise.all(Object.values(holidayLoadPromises));

        const startDates: Date[] = [];
        const endDates: Date[] = [];

        const holidaysList: {
            [key: string]: CompiledHoliday[];
        } = {};
        const currentYear = new Date().getFullYear();

        for (const key of Object.keys(holidays)) {
            if (!holidays[key]) continue;

            for (const holiday of holidays[key]) {
                const startDate = UntisManager.formatUntisDateAsDate(holiday.startDate + "");
                const endDate = UntisManager.formatUntisDateAsDate(holiday.endDate + "");

                if (startDate.getFullYear() != currentYear) continue;

                if (startDates.includes(startDate) && endDates.includes(endDate)) {
                    continue;
                }

                startDates.push(startDate);
                endDates.push(endDate);

                const holidayCompiled = holiday as CompiledHoliday;
                holidayCompiled.school = key as School;
                holidayCompiled.startDateParsed = startDate;
                holidayCompiled.endDateParsed = endDate;
                if (!holidaysList[key]) holidaysList[key] = [];
                holidaysList[key].push(holidayCompiled);
            }
        }

        return holidaysList;
    }

    private async getHolidayOfManager(manager: UntisManager): Promise<Holiday[]> {
        const reloadHolidays = localStorage.getItem("lastReloadOfHolidays");
        let forceReload = false;
        if (reloadHolidays) {
            const lastReloadOfHolidays = new Date();
            lastReloadOfHolidays.setUTCDate(parseInt(reloadHolidays))
            const today = new Date();
            const diff = dayjs(today).diff(lastReloadOfHolidays, "days");
            if (diff > 10) {
                forceReload = true;
            }
        }
        if (!forceReload) {
            const contantFromDB = await Utils.loadFromDB("OfflineData", "UntisHolidays", manager.getSchool());
            if (contantFromDB) {
                try {
                    return contantFromDB as Holiday[];
                } catch (e) {
                    console.error("Error loading holidays from DB:", e);
                }
            }
        }

        try {
            const untis = manager.getUntis();
            const response = await fetch(HOST + "/getHolidays.php?noCache", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: untis.username,
                    password: untis.password,
                    school: untis.schoolId,
                    baseurl: untis.host
                })
            });

            if (!response.ok) {
                // throw new Error("Failed to fetch timetable: " + response.statusText);
                console.error("Failed to fetch timetable: " + response.statusText);
                return [];
            }

            const responseData = await response.json();

            if (!responseData || responseData.error) {
                // throw new Error("Failed to fetch timetable: " + responseData.error);
                console.error("Failed to fetch timetable: " + responseData.error);
                return [];
            }

            const holidays = responseData as Holiday[];
            Utils.saveInDB("OfflineData", "UntisHolidays", manager.getSchool(), holidays);

            return holidays;

            // return this.compileLesson(responseData as WebAPITimetable[]);
        } catch (e) {
            console.error("Error fetching timetable via proxy:", e);
            return [];
        }

    }

}