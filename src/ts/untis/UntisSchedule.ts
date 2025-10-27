import type { CompiledLesson, LessonRaw, LessonSlot, ScheduleRawData, ScheduleRawDay } from "../@types/Schedule";
import type { School } from "../@types/School";
import UntisManager from "./UntisManager";

export default class UntisSchedule {

    private mondayLessons: ScheduleDay = {};
    private tuesdayLessons: ScheduleDay = {};
    private wednesdayLessons: ScheduleDay = {};
    private thursdayLessons: ScheduleDay = {};
    private fridayLessons: ScheduleDay = {};

    constructor(public lessons: CompiledLesson[], public className: string, public school: School) {
        this.init();
    }

    private init() {

        for (const clesson of this.lessons) {
            const time = UntisManager.formatTime(clesson.startTime);
            const timeEnd = UntisManager.formatTime(clesson.endTime);

            if (clesson.dayName && time) {
                if ((this as any)[`${clesson.dayName}Lessons`][time] == undefined) {
                    ((this as any)[`${clesson.dayName}Lessons`] as ScheduleDay)[time] = { lessons: [] };
                }
                if (((this as any)[`${clesson.dayName}Lessons`][time] as LessonSlot).lessons.find(l => (l.id === clesson.id && l.startTime === clesson.startTime && l.endTime === clesson.endTime))) {
                    continue;
                }
                ((this as any)[`${clesson.dayName}Lessons`][time] as LessonSlot).lessons.push(clesson);
            }

            if (clesson.dayName && timeEnd) {
                const startTimeOfLesson = this.getTimeStartFromTimeEnd(timeEnd);
                if ((this as any)[`${clesson.dayName}Lessons`][startTimeOfLesson] == undefined) {
                    ((this as any)[`${clesson.dayName}Lessons`] as ScheduleDay)[startTimeOfLesson] = { lessons: [] };
                }

                if (((this as any)[`${clesson.dayName}Lessons`][startTimeOfLesson] as LessonSlot).lessons.find(l => (l.id === clesson.id && l.startTime === clesson.startTime && l.endTime === clesson.endTime))) {
                    continue;
                }
                ((this as any)[`${clesson.dayName}Lessons`][startTimeOfLesson] as LessonSlot).lessons.push(clesson);
            }
        }
        console.log(this);
    }

    public filter(schedule: ScheduleRawData) {
        for (const day of [
            "monday",
            "tuesday",
            "wednesday",
            "thursday",
            "friday"
        ]) {
            let lessons = this.getDayLessons(day);
            if (lessons) {
                for (const time of Object.keys(lessons)) {
                    const slot = lessons[time];
                    slot.lessons = slot.lessons
                        .filter(lesson => lesson !== undefined)
                        .filter(l => l !== undefined)
                        .filter(l => this.isIdContainedInSchedule(l, (l.studentGroup ? l.studentGroup : (l.sg ? l.sg : l.id)), schedule));

                    slot.lessons.forEach(lesson => lesson.school = this.school);
                }
                (this as any)[`${day}Lessons`] = lessons;
            }
        }
    }



    private isIdContainedInSchedule(lesson: CompiledLesson, sign: string | number, schedule: ScheduleRawData): boolean {
        if (lesson.lessonCode === "UNTIS_ADDITIONAL" || lesson.cellState == "ADDITIONAL" || lesson.cellState == "EVENT") return true;
        if (typeof sign === "number") {
            const ids = Object.values(schedule).flatMap((day: ScheduleRawDay) => {
                return Object.values(day).flatMap((lesson: LessonRaw) => {
                    return lesson ? [lesson.id] : [];
                });
            });
            return ids.includes(sign);
        } else {
            const signs = Object.values(schedule).flatMap((day: ScheduleRawDay) => {
                return Object.values(day).flatMap((lesson: LessonRaw) => {
                    return lesson ? [lesson.sign] : [];
                });
            });
            return signs.includes(sign);
        }
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
                allLessons.push(...Object.values(lessons).flatMap(slot => slot.lessons));
            }
        }
        return allLessons;
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

    public getDayLessons(day: string): ScheduleDay | null {
        switch (day.toLowerCase()) {
            case "monday": return this.mondayLessons;
            case "tuesday": return this.tuesdayLessons;
            case "wednesday": return this.wednesdayLessons;
            case "thursday": return this.thursdayLessons;
            case "friday": return this.fridayLessons;
            default: return null;
        }
    }

    public getTimeSlot(day: string, time: keyof ScheduleDay): LessonSlot | null {
        const lessons = this.getDayLessons(day);
        return lessons ? lessons[time] || null : null;
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

export type ScheduleDay = {
    [key: string]: LessonSlot;
}