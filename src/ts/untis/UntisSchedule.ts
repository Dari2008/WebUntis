import dayjs from "dayjs";
import type { CompiledLesson, DayName, LessonRaw, LessonSlot, ScheduleRawData, ScheduleRawDay, TypeScheduleRawDayTimes } from "../@types/Schedule";
import { UserManagement } from "../userManagement/UserManagement";
import UntisManager from "./UntisManager";
import type { Holiday } from "./types";
import Utils from "../Utils";
import type { UntisAccess } from "../@types/UntisAccess";

export default class UntisSchedule {

    private mondayLessons: TimedScheduleDay | HolidayScheduleDay = {};
    private tuesdayLessons: TimedScheduleDay | HolidayScheduleDay = {};
    private wednesdayLessons: TimedScheduleDay | HolidayScheduleDay = {};
    private thursdayLessons: TimedScheduleDay | HolidayScheduleDay = {};
    private fridayLessons: TimedScheduleDay | HolidayScheduleDay = {};

    constructor(public lessons: CompiledLesson[], public className: string, public mondayOfWeek: Date, public untisAccess: UntisAccess) {
        this.init();
    }

    private init() {

        for (const clesson of this.lessons) {
            const time = UntisManager.formatTime(clesson.startTime);
            const timeEnd = UntisManager.formatTime(clesson.endTime);

            if (!clesson.dayName) continue;

            let scheduleDay = (this as any)[`${clesson.dayName}Lessons`] as TimedScheduleDay | HolidayScheduleDay;
            if (scheduleDay.type != "HolidayScheduleDay") {
                scheduleDay = scheduleDay as TimedScheduleDay;
                if (clesson.dayName && time) {
                    if (scheduleDay[time] == undefined) {
                        (this as any)[`${clesson.dayName}Lessons`][time] = { lessons: [] };
                    }
                    if (scheduleDay[time].lessons.find(l => (l.id === clesson.id && l.startTime === clesson.startTime && l.endTime === clesson.endTime))) {
                        continue;
                    }
                    scheduleDay[time].lessons.push(clesson);
                }

                if (clesson.dayName && timeEnd) {
                    const startTimeOfLesson = this.getTimeStartFromTimeEnd(timeEnd);
                    if (scheduleDay[startTimeOfLesson] == undefined) {
                        (this as any)[`${clesson.dayName}Lessons`][startTimeOfLesson] = { lessons: [] };
                    }

                    if (scheduleDay[startTimeOfLesson].lessons.find(l => (l.id === clesson.id && l.startTime === clesson.startTime && l.endTime === clesson.endTime))) {
                        continue;
                    }
                    scheduleDay[startTimeOfLesson].lessons.push(clesson);
                }
            }
        }
        // console.log(this);
        if (UserManagement.ALL_DATA) {

            const datesInWeek = [];
            const dayJsObj = dayjs(this.mondayOfWeek);
            const daysOfWeek = [
                "monday",
                "tuesday",
                "wednesday",
                "thursday",
                "friday"
            ]
            for (let i = 0; i < 5; i++) {
                datesInWeek.push(dayJsObj.add(i, "days"));
            }

            const daysFree: {
                [key: string]: Holiday & {
                    days: Set<dayjs.Dayjs>;
                }
            } = {};
            for (const holiday of UserManagement.ALL_DATA.holidays[this.untisAccess.uuid]) {
                const startDate = holiday.startDateParsed;
                const endDate = holiday.endDateParsed;

                const uuid = Utils.uuidv4Exclude(Object.keys(daysFree));

                daysFree[uuid] = {
                    days: new Set(),
                    ...holiday
                };

                datesInWeek.filter((date) => {
                    if (date.isAfter(startDate, "days") && date.isBefore(endDate, "days") || date.isSame(startDate, "days") || date.isSame(endDate, "days")) {
                        return true;
                    }
                    return false;
                }).forEach(e => daysFree[uuid].days.add(e));
                if (!daysFree[uuid] || daysFree[uuid].days.size <= 0) {
                    delete daysFree[uuid];
                }
            }

            if (Object.keys(daysFree).length > 0) {

                for (const holiday of Object.values(daysFree)) {
                    for (const freeDay of holiday.days) {
                        const indexOfDayOfWeek: number = freeDay.day();
                        if (indexOfDayOfWeek == 0 || indexOfDayOfWeek == 6) continue;
                        const dayOfWeek = daysOfWeek[indexOfDayOfWeek - 1];

                        // if((this as any)[`${dayOfWeek}Lessons`].type == "")
                        let scheduleDay = (this as any)[`${dayOfWeek}Lessons`] as TimedScheduleDay | HolidayScheduleDay;
                        if (!scheduleDay) continue;
                        if (scheduleDay.type && scheduleDay.type == "HolidayScheduleDay") continue;
                        // if ((scheduleDay as ScheduleDay).lessons) continue;
                        scheduleDay = scheduleDay as HolidayScheduleDay;
                        // if (scheduleDay == undefined) {
                        scheduleDay = {
                            endDate: UntisManager.formatUntisDateAsDate(holiday.endDate + ""),
                            startDate: UntisManager.formatUntisDateAsDate(holiday.startDate + ""),
                            holidayLongName: holiday.longName,
                            holidayName: holiday.name,
                            type: "HolidayScheduleDay"
                        };
                        (this as any)[`${dayOfWeek}Lessons`] = scheduleDay;
                        // }
                    }
                }
                console.log(this);

            }


        }
    }

    public filter(schedule: ScheduleRawData) {
        for (const day of [
            "monday",
            "tuesday",
            "wednesday",
            "thursday",
            "friday"
        ] as DayName[]) {
            let lessons = this.getDayLessons(day);
            if (lessons) {
                if (lessons.type == "HolidayScheduleDay") continue;
                lessons = lessons as TimedScheduleDay;
                for (const time of Object.keys(lessons)) {
                    const slot = lessons[time];
                    slot.lessons = slot.lessons
                        .filter(lesson => lesson !== undefined)
                        .filter(l => l !== undefined)
                        .filter(l => this.isIdContainedInSchedule(day, l, (l.studentGroup ?? l.sg ?? ""), schedule));

                    slot.lessons.forEach(lesson => lesson.school = this.untisAccess.school);
                }
                (this as any)[`${day}Lessons`] = lessons;
            }
        }
    }



    private isIdContainedInSchedule(day: DayName, lesson: CompiledLesson, sign: string, schedule: ScheduleRawData): boolean {
        if (lesson.lessonCode === "UNTIS_ADDITIONAL" || lesson.cellState == "ADDITIONAL" || lesson.cellState == "EVENT") return true;
        const lessonStartString = lesson.startTimeParsed.hour.toString().padStart(2, "0") + ":" + lesson.startTimeParsed.minute.toString().padStart(2, '0');
        const lessonSign = schedule[day][lessonStartString as TypeScheduleRawDayTimes]?.sign || [];
        return lessonSign == sign;
    }

    public getAllLessons(): CompiledLesson[] {
        const allLessons: CompiledLesson[] = [];
        for (const day of [
            "monday",
            "tuesday",
            "wednesday",
            "thursday",
            "friday"
        ]) {
            const lessons = this.getDayLessons(day);
            if (lessons) {
                if (lessons.type == "HolidayScheduleDay") continue;
                allLessons.push(...Object.values(lessons).flatMap(slot => slot.lessons));
            }
        }
        return allLessons;
    }

    public getHolidays(): HolidayScheduleDay[] {
        const allHolidays: HolidayScheduleDay[] = [];
        for (const day of [
            "monday",
            "tuesday",
            "wednesday",
            "thursday",
            "friday"
        ]) {
            const lessons = this.getDayLessons(day);
            if (lessons?.type == "HolidayScheduleDay") {
                allHolidays.push(lessons as HolidayScheduleDay);
            }
        }
        return allHolidays;
    }

    public getAllLessonSlots(): LessonSlot[] {
        const allSlots: LessonSlot[] = [];
        for (const day of [
            "monday",
            "tuesday",
            "wednesday",
            "thursday",
            "friday"
        ]) {
            const lessons = this.getDayLessons(day);
            if (lessons) {
                if (lessons.type == "HolidayScheduleDay") continue;
                allSlots.push(...Object.values(lessons));
            }
        }
        return allSlots;
    }

    public getSpecialLessons(): CompiledLesson[] {
        const specialties: CompiledLesson[] = [];
        this.lessons.forEach(lesson => {
            if (lesson.code && lesson.cellState != "STANDARD") {
                specialties.push(lesson);
            }
        });
        return specialties;
    }

    public getCanceledLessons(): CompiledLesson[] {
        const specialties: CompiledLesson[] = [];
        this.lessons.forEach(lesson => {
            if (lesson.code && lesson.cellState == "CANCEL") {
                specialties.push(lesson);
            }
        });
        return specialties;
    }

    public getIrregularLessons(): CompiledLesson[] {
        const specialties: CompiledLesson[] = [];
        this.lessons.forEach(lesson => {
            if (lesson.code && lesson.cellState != "STANDARD" && lesson.cellState != "CANCEL") {
                specialties.push(lesson);
            }
        });
        return specialties;
    }

    public getDayLessons(day: string): TimedScheduleDay | HolidayScheduleDay | null {
        switch (day.toLowerCase()) {
            case "monday": return this.mondayLessons;
            case "tuesday": return this.tuesdayLessons;
            case "wednesday": return this.wednesdayLessons;
            case "thursday": return this.thursdayLessons;
            case "friday": return this.fridayLessons;
            default: return null;
        }
    }

    public getTimeSlot(day: string, time: keyof TimedScheduleDay): LessonSlot | null {
        let lessons = this.getDayLessons(day);
        if (lessons?.type == "HolidayScheduleDay") return null;
        lessons = lessons as TimedScheduleDay;
        return lessons ? lessons[time] as LessonSlot || null : null;
    }

    public getTimeStartFromTimeEnd(timeEnd: string): string {
        const [hours, minutes] = timeEnd.split(":").map(Number);
        let startHours = hours;
        let startMinutes = minutes - 45;
        if (startMinutes < 0) {
            startMinutes += 60;
            startHours -= 1;
        }
        return `${startHours.toString().padStart(2, '0')}:${startMinutes.toString().padStart(2, '0')}`;
    }




}

export type TimedScheduleDay = ({
    [key: string]: LessonSlot;
});

export type HolidayScheduleDay = {
    type: "HolidayScheduleDay";
    holidayName: string;
    holidayLongName: string;
    startDate: Date;
    endDate: Date;
}