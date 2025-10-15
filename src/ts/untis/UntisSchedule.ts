import type { DayName, LessonRaw, ScheduleRawData, ScheduleRawDay } from "../ScheduleDarius";
import type { Lesson, ShortData, WebAPITimetable, WebElement, WebElementData } from "./";
import type { Time as ScheduleTime } from "./Schedule";
import { type School, type Subject, type Teacher } from "./TeacherDatabase";
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

// export type Time =
//   | "08:00" | "08:45" | "09:30" | "09:50"
//   | "10:35" | "11:20" | "11:35" | "12:20"
//   | "13:20" | "14:05" | "14:50" | "15:00"
//   | "15:45" | "16:30" | "17:50" | "10:00"
//   | "10:45" | "11:00" | "11:45" | "12:00" 
//   | "12:45" | "13:00" | "13:45" | "14:00" 
//   | "14:45";

// export const LESSON_TIMES = [
//         "08:00",
//         "08:45",
//         "09:50",
//         "10:35",
//         "11:35",
//         "12:20",
//         "13:20",
//         "14:05",
//         "15:00",
//         "15:45",
//         "16:30",
//         "17:15",
//         "18:00",

//         "10:00",
//         "10:45",
//         "11:00",
//         "11:45",
//         "12:00",
//         "12:45",
//         "13:00",
//         "13:45",
//         "14:00",
//         "14:45",
//         // "15:00"?: LessonDarius;
//         // "15:45"?: LessonDarius;
//         "16:00",
//         "16:45",
//         "17:00",
//         "17:45",


// ].sort((a, b) => {
//     const [aHour, aMinute] = a.split(":").map(Number);
//     const [bHour, bMinute] = b.split(":").map(Number);
//     if (aHour === bHour) {
//         return aMinute - bMinute;
//     }
//     return aHour - bHour;
// });

export type ScheduleDay = {
    [key: string]: LessonSlot;
    // "08:00": LessonSlot;
    // "08:45": LessonSlot;
    // "09:50": LessonSlot;
    // "10:35": LessonSlot;
    // "11:35": LessonSlot;
    // "12:20": LessonSlot;
    // "13:20": LessonSlot;
    // "14:05": LessonSlot;
    // "15:00": LessonSlot;
    // "15:45": LessonSlot;
    // "16:30": LessonSlot;
    // "17:15": LessonSlot;

    // "10:00": LessonSlot;
    // "10:45": LessonSlot;
    // "11:00": LessonSlot;
    // "11:45": LessonSlot;
    // "12:00": LessonSlot;
    // "12:45": LessonSlot;
    // "13:00": LessonSlot;
    // "13:45": LessonSlot;
    // "14:00": LessonSlot;
    // "14:45": LessonSlot;
    // "16:00": LessonSlot;
    // "16:45": LessonSlot;
    // "17:00": LessonSlot;
    // "17:45": LessonSlot;
}

export type LessonSlot = {
    lessons: CompiledLesson[];
}

type Wrapper = WebAPITimetable & {
};



export type AllLessons = {
    type: string;
    // id: number;
    school: School;
    lessonId?: number;
    lessonNumber?: number;
    lessonCode?: string;
    lessonText?: string;
    periodText?: string;
    hasPeriodText?: false;
    periodInfo?: string;
    periodAttachments?: [];
    // substText: string;
    // date: number;
    // startTime: number;
    // endTime: number;
    elements?: WebElement[];
    studentGroup?: string;
    hasInfo?: boolean;
    // code: number;
    cellState?: 'STANDARD' | 'SUBSTITUTION' | 'ROOMSUBSTITUTION' | 'CANCEL' | 'ADDITIONAL' | 'EVENT';
    priority?: number;
    is?: {
        roomSubstitution?: boolean;
        substitution?: boolean;
        standard?: boolean;
        event?: boolean;
    };
    roomCapacity?: number;
    studentCount?: number;
    classes?: WebElementData[];
    teachers?: WebElementData[];
    subjects?: WebElementData[];
    rooms?: WebElementData[];
    students?: WebElementData[];

    id: number;
    date: number;
    startTime: number;
    endTime: number;
    kl?: ShortData[];
    te?: ShortData[];
    su?: ShortData[];
    ro?: ShortData[];
    lstext?: string;
    lsnumber?: number;
    activityType?: 'Unterricht' | string;
    code: 'cancelled' | 'irregular';
    info?: string;
    substText: string;
    statflags?: string;
    sg?: string;
    bkRemark?: string;
    bkText?: string;

    subjectFullName?: string;
    subjectShortName?: string;
    subjectId?: number;
    roomFullName?: string;
    roomShortName?: string;
    roomId?: number;
    teacher?: Teacher;
    originalTeacher?: Teacher;
    teacherFullName?: string;
    teacherShortName?: string;
    teacherSubjectString?: string;
    teacherStatus?: 'REGULAR' | 'ABSENT' | 'SUBSTITUTED';
    teacherSubjectStringParsed?: string;
    teacherSubjects?: Subject[];
    startTimeParsed: ScheduleTime;
    endTimeParsed: ScheduleTime;
    dayName?: DayName;

    multipleTeachers?: boolean;
    cTeachers?: Teacher[];

}

export type CompiledLesson = AllLessons;

// export type CompiledLesson = WebAPITimetable & {
//     subjectFullName?: string;
//     subjectShortName?: string;
//     subjectId?: number;
//     roomFullName?: string;
//     roomShortName?: string;
//     roomId?: number;
//     teacher?: Teacher;
//     originalTeacher?: Teacher;
//     teacherFullName?: string;
//     teacherShortName?: string;
//     teacherSubjectString?: string;
//     teacherStatus?: 'REGULAR' | 'ABSENT' | 'SUBSTITUTED';
//     teacherSubjectStringParsed?: string;
//     teacherSubjects?: Subject[];
//     startTimeParsed: ScheduleTime;
//     endTimeParsed: ScheduleTime;
//     dayName?: DayName;
// }