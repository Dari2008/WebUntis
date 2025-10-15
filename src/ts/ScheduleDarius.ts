// import type { Time } from "./untis";
import { set } from "date-fns";
import type { Time } from "./untis";
import type { School } from "./untis/TeacherDatabase";
import UntisManager from "./untis/UntisManager";
import type { CompiledLesson } from "./untis/UntisSchedule";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat.js";

dayjs.extend(customParseFormat);

export const SCHEDULE: ScheduleDarius = {

    monday: {
        "08:00": { id: 2828667, sign: "MATO1_11_Wk", school: "Grootmoor" }, // Mathe
        "08:45": { id: 2828670, sign: "MATO1_11_Wk", school: "Grootmoor" }, // Mathe
        "09:50": { id: 2824869, sign: "DEUO2_11_Stk", school: "Grootmoor" }, // Deutsch
        "10:35": { id: 2824872, sign: "DEUO2_11_Stk", school: "Grootmoor" }, // Deutsch
        "11:35": { id: 2852713, sign: "RelO2_11_Hb", school: "Grootmoor" }, // Religion
        "12:20": { id: 2852716, sign: "RelO2_11_Hb", school: "Grootmoor" }, // Religion
        "15:00": { id: 2911377, sign: "SpoBVBSurf_11_Hut", school: "Grootmoor" }, // Sport
        "15:45": { id: 2911380, sign: "SpoBVBSurf_11_Hut", school: "Grootmoor" }, // Sport
    },
    tuesday: {
        "08:00": undefined,
        "08:45": undefined,
        "10:00": { id: 1574013, sign: "PGW_11.2", school: "Meiendorf" }, // PGW
        "10:45": { id: 1574016, sign: "PGW_11.2", school: "Meiendorf" }, // PGW
        "12:00": { id: 1610855, sign: "Phy-pg_11.111.211.3A11.3B11x1", school: "Meiendorf" }, // Physik
        "12:45": { id: 1610858, sign: "Phy-pg_11.111.211.3A11.3B11x1", school: "Meiendorf" }, // Physik
        "13:20": { id: 2836387, sign: "ENGO5_11_Hm", school: "Grootmoor" }, // Englisch
        "14:05": { id: 2836390, sign: "ENGO5_11_Hm", school: "Grootmoor" }, // Englisch
    },
    wednesday: {
        "08:00": { id: 2851681, sign: "WirO1_11_Hus", school: "Grootmoor" }, // Wirtschaft
        "08:45": { id: 2851684, sign: "WirO1_11_Hus", school: "Grootmoor" }, // Wirtschaft
        "09:50": { id: 2828673, sign: "MATO1_11_Wk", school: "Grootmoor" }, // Mathe
        "10:35": { id: 2828676, sign: "MATO1_11_Wk", school: "Grootmoor" }, // Mathe
        "11:35": { id: 2824875, sign: "DEUO2_11_Stk", school: "Grootmoor" }, // Deutsch
        "12:20": { id: 2824878, sign: "DEUO2_11_Stk", school: "Grootmoor" }, // Deutsch
        "13:20": { id: 2836393, sign: "ENGO5_11_Hm", school: "Grootmoor" }, // Englisch
        "14:05": { id: 2836396, sign: "ENGO5_11_Hm", school: "Grootmoor" }, // Englisch
    },
    thursday: {
        "08:00": { id: 2858143, sign: "GeoO1_11_Hd", school: "Grootmoor" }, // GEO
        "08:45": { id: 2858146, sign: "GeoO1_11_Hd", school: "Grootmoor" }, // GEO
        "10:00": { id: 1610861, sign: "Phy-pg_11.111.211.3A11.3B11x1", school: "Meiendorf" }, // Physik
        "10:45": { id: 1610864, sign: "Phy-pg_11.111.211.3A11.3B11x1", school: "Meiendorf" }, // Physik
        "12:00": { id: 1574019, sign: "PGW_11.2", school: "Meiendorf" }, // PGW
        "12:45": { id: 1574022, sign: "PGW_11.2", school: "Meiendorf" }, // PGW
        "14:00": { id: 1577788, sign: "Sem_11.2_ohne_MUN", school: "Meiendorf" }, // Seminar
        "14:45": { id: 1577791, sign: "Sem_11.2_ohne_MUN", school: "Meiendorf" }, // Seminar
    },
    friday: {
        "08:00": undefined,
        "08:45": undefined,
        "09:50": { id: 2854789, sign: "KunO2_11_CP", school: "Grootmoor" }, // Kunst
        "10:35": { id: 2854792, sign: "KunO2_11_CP", school: "Grootmoor" }, // Kunst
        "11:35": { id: 2858137, sign: "GeoO1_11_Hd", school: "Grootmoor" }, // GEO
        "12:20": { id: 2858140, sign: "GeoO1_11_Hd", school: "Grootmoor" }, // GEO
        "13:20": { id: 2857939, sign: "InfO1_1112_Bm", school: "Grootmoor" }, // Informatik
        "14:05": { id: 2857942, sign: "InfO1_1112_Bm", school: "Grootmoor" }, // Informatik
    }
};

export const BREAKS: BreaksRawByDay = {
    monday: [
        {
            start: "09:30",
            end: "09:50",
            school: "Grootmoor"
        },
        {
            start: "11:20",
            end: "11:35",
            school: "Grootmoor"
        },
        {
            start: "13:05",
            end: "15:00",
            school: "Grootmoor"
        }
    ],
    tuesday: [
        {
            start: "11:30",
            end: "12:00",
            school: "Meiendorf"
        }
    ],
    wednesday: [
        {
            start: "09:30",
            end: "09:50",
            school: "Grootmoor"
        },
        {
            start: "11:20",
            end: "11:35",
            school: "Grootmoor"
        },
        {
            start: "13:05",
            end: "13:20",
            school: "Grootmoor"
        }
    ],
    thursday: [
        {
            start: "09:30",
            end: "10:00",
            school: "Meiendorf"
        },
        {
            start: "11:30",
            end: "12:00",
            school: "Meiendorf"
        },
        {
            start: "13:30",
            end: "14:00",
            school: "Meiendorf"
        }
    ],
    friday: [
        {
            start: "09:30",
            end: "09:50",
            school: "Grootmoor"
        },
        {
            start: "11:20",
            end: "11:35",
            school: "Grootmoor"
        },
        {
            start: "13:05",
            end: "13:20",
            school: "Grootmoor"
        }
    ],
    others: [
        {
            start: "14:50",
            end: "15:00",
            school: "Grootmoor"
        }
    ]
};

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

export const LESSON_TIMES: LessonTimes = compileScheduleToLessonTimes();
export const LESSON_TIMES_STRING: LessonTimesString = (() => {

    const times: LessonTimesString = {};

    for (const key of Object.keys(LESSON_TIMES) as School[]) {
        if (!key) continue;
        if (!LESSON_TIMES[key]) continue;
        for (const time of LESSON_TIMES[key]) {
            if (!time) continue;
            if (!times[key]) times[key] = [];
            times[key].push(time.end);
            times[key].push(time.start);
        }
    }



    return times;

})();

export const START_TIME: Time = UntisManager.parseTime(Object.values(LESSON_TIMES).flat().reduce((a, b) => {
    const parsedStartA = UntisManager.parseTime(a.start);
    const parsedStartB = UntisManager.parseTime(b.start);

    const minutesStartA = parsedStartA.hour * 60 + parsedStartA.minute;
    const minutesStartB = parsedStartB.hour * 60 + parsedStartB.minute;

    if (minutesStartA < minutesStartB) return a;
    return b;
}).start);

export const END_TIME: Time = UntisManager.parseTime(Object.values(LESSON_TIMES).flat().reduce((a, b) => {
    const parsedEndA = UntisManager.parseTime(a.end);
    const parsedEndB = UntisManager.parseTime(b.end);

    const minutesEndA = parsedEndA.hour * 60 + parsedEndA.minute;
    const minutesEndB = parsedEndB.hour * 60 + parsedEndB.minute;

    if (minutesEndA < minutesEndB) return b;
    return a;
}).end);

export type ScheduleDarius = ScheduleRawData;

export type ScheduleRawData = {
    "monday": ScheduleRawDay;
    "tuesday": ScheduleRawDay;
    "wednesday": ScheduleRawDay;
    "thursday": ScheduleRawDay;
    "friday": ScheduleRawDay;
}

export type ScheduleRawDay = {
    "08:00"?: LessonRaw;
    "08:45"?: LessonRaw;
    "09:50"?: LessonRaw;
    "10:35"?: LessonRaw;
    "11:35"?: LessonRaw;
    "12:20"?: LessonRaw;
    "13:20"?: LessonRaw;
    "14:05"?: LessonRaw;
    "15:00"?: LessonRaw;
    "15:45"?: LessonRaw;
    "16:30"?: LessonRaw;
    "17:50"?: LessonRaw;

    "10:00"?: LessonRaw;
    "10:45"?: LessonRaw;
    "11:00"?: LessonRaw;
    "11:45"?: LessonRaw;
    "12:00"?: LessonRaw;
    "12:45"?: LessonRaw;
    "13:00"?: LessonRaw;
    "13:45"?: LessonRaw;
    "14:00"?: LessonRaw;
    "14:45"?: LessonRaw;
    // "15:00"?: LessonDarius;
    // "15:45"?: LessonDarius;
    "16:00"?: LessonRaw;
    "16:45"?: LessonRaw;
    "17:00"?: LessonRaw;
    "17:45"?: LessonRaw;
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
}

export type LessonRaw = {
    id: number;
    school: School;
    sign: string;
}

export type DayName = "monday" | "tuesday" | "wednesday" | "thursday" | "friday";



function compileScheduleToLessonTimes(): LessonTimes {
    const times: LessonTimes = {};

    for (const day of Object.keys(SCHEDULE) as DayName[]) {
        const dayLessons = SCHEDULE[day];
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

// Exams

export const EXAMS = {
    get() {
        return _EXAMS;
    },
    set(value: ExamList) {
        _EXAMS = value;
    }
}

let _EXAMS: ExamList = [
    {
        date: "08.10.2025",
        subject: "Englisch",
        sign: "ENGO5_11_Hm"
    },
    {
        date: "10.10.2025",
        subject: "Geo",
        sign: "GeoO1_11_Hd"
    },
    {
        date: "13.10.2025",
        subject: "Deutsch",
        sign: "DEUO2_11_Stk"
    },
    {
        date: "04.11.2025",
        subject: "Kunst",
        sign: "KunO2_11_CP"
    },
    {
        date: "05.11.2025",
        subject: "Wirtschaft",
        sign: "WirO1_11_Hus"
    },
    {
        date: "13.11.2025",
        subject: "Religion",
        sign: "RelO2_11_Hb"
    },
    {
        date: "17.11.2025",
        subject: "Mathe",
        sign: "MATO1_11_Wk"
    },
    {
        date: "21.11.2025",
        subject: "Informatik",
        sign: "InfO1_1112_Bm"
    },
    {
        date: "25.11.2025",
        subject: "Englisch",
        sign: "ENGO5_11_Hm"
    },
    {
        date: "01.12.2025",
        subject: "Deutsch",
        sign: "DEUO2_11_Stk"
    },
    {
        date: "05.12.2025",
        subject: "Geo",
        sign: "GeoO1_11_Hd"
    },
    {
        date: "04.11.2025",
        subject: "PGW",
        sign: "PGW_11.2"
    },
    {
        date: "13.11.2025",
        subject: "Physik",
        sign: "Phy-pg_11.111.211.3A11.3B11x1"
    },
    {
        date: "20.11.2025",
        subject: "Seminar",
        sign: "Sem_11.2"
    },
    {
        date: "20.01.2026",
        subject: "PGW",
        sign: "PGW_11.2"
    },
    {
        date: "15.01.2026",
        subject: "Physik",
        sign: "Phy-pg_11.111.211.3A11.3B11x1"
    }

].sort((a: Exam, b: Exam) => {
    return dayjs(a.date, "DD.MM.YYYY").diff(dayjs(b.date, "DD.MM.YYYY"));
});

export type Exam = {
    date: string;
    subject: string;
    sign: string;
}

export type ExamList = Exam[];

export function checkForExam(lesson: CompiledLesson): boolean {
    const date = parseDate(lesson.date);
    return _EXAMS.some(exam => (exam.sign === (lesson.studentGroup ? lesson.studentGroup : lesson.sg)) && exam.date === date);
}

function parseDate(date: number): string {
    const dateString = date.toString();
    const day = dateString.substring(6, 8);
    const month = dateString.substring(4, 6);
    const year = dateString.substring(0, 4);
    if (year !== new Date().getFullYear().toString()) return "";
    return `${day}.${month}`;
}

export const SCHOOLS: School[] = ["Meiendorf", "Grootmoor"];