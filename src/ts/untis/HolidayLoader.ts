import type { School } from "../@types/School";
import { HOST } from "../ScheduleDarius_old";
import type { Holiday } from "./types";
import UntisManager from "./UntisManager";

export type CompiledHoliday = Holiday & {
    school: School;
    startDateParsed: Date;
    endDateParsed: Date;
}

export class HolidayLoader {

    constructor(private managers: UntisManager[]) { }

    public async getHolidays(): Promise<CompiledHoliday[]> {
        const holidays: {
            [key: string]: Holiday[];
        } = {};


        const holidayLoadPromises: Promise<Holiday[]>[] = [];

        for (const manager of this.managers) {
            const promise = this.getHolidayOfManager(manager);
            promise.then(h => {
                holidays[manager.getSchool()] = h;
            })
            holidayLoadPromises.push(promise);
        }

        await Promise.all(Object.values(holidayLoadPromises));

        const startDates: Date[] = [];
        const endDates: Date[] = [];

        const holidaysList: CompiledHoliday[] = [];
        const currentYear = new Date().getFullYear();

        for (const key of Object.keys(holidays)) {
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
                holidaysList.push(holidayCompiled);
            }
        }

        return holidaysList;
    }

    private async getHolidayOfManager(manager: UntisManager): Promise<Holiday[]> {
        try {
            const untis = manager.getUntis();
            const response = await fetch("http://" + HOST + "/untis/getHolidays.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: untis.username,
                    password: untis.password,
                    school: untis.school,
                    baseurl: "https://" + untis.host
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

            return responseData;

            // return this.compileLesson(responseData as WebAPITimetable[]);
        } catch (e) {
            console.error("Error fetching timetable via proxy:", e);
            return [];
        }

    }

}