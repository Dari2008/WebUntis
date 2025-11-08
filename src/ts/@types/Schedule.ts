import type { ShortData, WebAPITimetable, WebElement, WebElementData } from "../untis/types";
import type { School } from "./School";
import type { Teacher } from "./Teachers";

export type LessonSlot = {
    lessons: CompiledLesson[];
}

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
    startTimeParsed: Time;
    endTimeParsed: Time;
    dayName?: DayName;

    multipleTeachers?: boolean;
    cTeachers?: Teacher[];

}

export type CompiledLesson = AllLessons;



export type Subject =
    "Mus" | "Deu" | "Spa" | "Spo" | "Ges" | "PGW" | "Ma" |
    "Bio" | "NuT" | "Phy" | "Mat" | "Kun" | "Eng" | "Wir" |
    "Frz" | "Geo" | "Phi" | "The" | "Inf" | "Rel" | "Che" |
    "Lat" | "Mu" | "Fra" | "Psy" | "NaWi" | "Italienisch" | "Journalismus" | "Film";




export type ScheduleDay = {
    lessons: ScheduleLesson[];
};

export type ScheduleData = {
    monday: ScheduleDay;
    tuesday: ScheduleDay;
    wednesday: ScheduleDay;
    thursday: ScheduleDay;
    friday: ScheduleDay;
};

export type ScheduleLesson = {
    lessonStart: Time;
    lessonEnd: Time;
    subject: string | string[];
    id?: number;
    day?: number;
}

export type Time = {
    hour: number;
    minute: number;
};


export type ScheduleRawData = {
    "monday": ScheduleRawDay;
    "tuesday": ScheduleRawDay;
    "wednesday": ScheduleRawDay;
    "thursday": ScheduleRawDay;
    "friday": ScheduleRawDay;
}

export const ScheduleRawDayTimes = [
    "08:00",
    "08:45",
    "09:50",
    "10:35",
    "11:35",
    "12:20",
    "13:20",
    "14:05",
    "15:00",
    "15:45",
    "16:30",
    "17:50",
    "10:00",
    "10:45",
    "11:00",
    "11:45",
    "12:00",
    "12:45",
    "13:00",
    "13:45",
    "14:00",
    "14:45",
    "16:00",
    "16:45",
    "17:00",
    "17:45"
];

export type TypeScheduleRawDayTimes = keyof typeof ScheduleRawDayTimes;

export type ScheduleRawDay = {
    [key in TypeScheduleRawDayTimes]?: LessonRaw;
    // "08:00"?: LessonRaw;
    // "08:45"?: LessonRaw;
    // "09:50"?: LessonRaw;
    // "10:35"?: LessonRaw;
    // "11:35"?: LessonRaw;
    // "12:20"?: LessonRaw;
    // "13:20"?: LessonRaw;
    // "14:05"?: LessonRaw;
    // "15:00"?: LessonRaw;
    // "15:45"?: LessonRaw;
    // "16:30"?: LessonRaw;
    // "17:50"?: LessonRaw;

    // "10:00"?: LessonRaw;
    // "10:45"?: LessonRaw;
    // "11:00"?: LessonRaw;
    // "11:45"?: LessonRaw;
    // "12:00"?: LessonRaw;
    // "12:45"?: LessonRaw;
    // "13:00"?: LessonRaw;
    // "13:45"?: LessonRaw;
    // "14:00"?: LessonRaw;
    // "14:45"?: LessonRaw;
    // // "15:00"?: LessonDarius;
    // // "15:45"?: LessonDarius;
    // "16:00"?: LessonRaw;
    // "16:45"?: LessonRaw;
    // "17:00"?: LessonRaw;
    // "17:45"?: LessonRaw;
};

export type BreaksRawByDay = {
    "monday": ScheduleBreak[];
    "tuesday": ScheduleBreak[];
    "wednesday": ScheduleBreak[];
    "thursday": ScheduleBreak[];
    "friday": ScheduleBreak[];
    "others": ScheduleBreak[];
}

export type ScheduleBreak = {
    start: string;
    end: string;
    school: School;
    uuid: string;
}

export type LessonRaw = {
    school: School;
    sign: string;
    uuid: string;
}

export type DayName = "monday" | "tuesday" | "wednesday" | "thursday" | "friday";

export type LessonTime = {
    start: string;
    end: string;
};

export type LessonTimes = {
    [key in School]?: LessonTime[];
};

export type LessonTimesString = {
    [key in School]?: string[];
}