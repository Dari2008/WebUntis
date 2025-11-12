// import UntisManager from "./untis/UntisManager";
// import dayjs from "dayjs";
// import customParseFormat from "dayjs/plugin/customParseFormat.js";
// import type { BreaksRawByDay, CompiledLesson, DayName, LessonRaw, LessonTimes, LessonTimesString, ScheduleRawData, Time } from "./@types/Schedule";
// import type { School } from "./@types/School";
// import type { Exam, ExamList } from "./@types/Exam";
// import type { UntisAccess } from "./@types/UntisAccess";

// dayjs.extend(customParseFormat);
// export const HOST = "localhost:2222/untis";
export const HOST = "http://127.0.0.1:2222/untis";
// export const HOST = "http://192.168.178.110:2222/untis";
// export const HOST = "https://untis.frobeen.com/php/";

// export const SCHEDULE: ScheduleDarius = {

//     monday: {
//         "08:00": { id: 2828667, sign: "MATO1_11_Wk", school: "Grootmoor" }, // Mathe
//         "08:45": { id: 2828670, sign: "MATO1_11_Wk", school: "Grootmoor" }, // Mathe
//         "09:50": { id: 2824869, sign: "DEUO2_11_Stk", school: "Grootmoor" }, // Deutsch
//         "10:35": { id: 2824872, sign: "DEUO2_11_Stk", school: "Grootmoor" }, // Deutsch
//         "11:35": { id: 2852713, sign: "RelO2_11_Hb", school: "Grootmoor" }, // Religion
//         "12:20": { id: 2852716, sign: "RelO2_11_Hb", school: "Grootmoor" }, // Religion
//         "15:00": { id: 2911377, sign: "SpoBVBSurf_11_Hut", school: "Grootmoor" }, // Sport
//         "15:45": { id: 2911380, sign: "SpoBVBSurf_11_Hut", school: "Grootmoor" }, // Sport
//     },
//     tuesday: {
//         "08:00": undefined,
//         "08:45": undefined,
//         "10:00": { id: 1574013, sign: "PGW_11.2", school: "Meiendorf" }, // PGW
//         "10:45": { id: 1574016, sign: "PGW_11.2", school: "Meiendorf" }, // PGW
//         "12:00": { id: 1610855, sign: "Phy-pg_11.111.211.3A11.3B11x1", school: "Meiendorf" }, // Physik
//         "12:45": { id: 1610858, sign: "Phy-pg_11.111.211.3A11.3B11x1", school: "Meiendorf" }, // Physik
//         "13:20": { id: 2836387, sign: "ENGO5_11_Hm", school: "Grootmoor" }, // Englisch
//         "14:05": { id: 2836390, sign: "ENGO5_11_Hm", school: "Grootmoor" }, // Englisch
//     },
//     wednesday: {
//         "08:00": { id: 2851681, sign: "WirO1_11_Hus", school: "Grootmoor" }, // Wirtschaft
//         "08:45": { id: 2851684, sign: "WirO1_11_Hus", school: "Grootmoor" }, // Wirtschaft
//         "09:50": { id: 2828673, sign: "MATO1_11_Wk", school: "Grootmoor" }, // Mathe
//         "10:35": { id: 2828676, sign: "MATO1_11_Wk", school: "Grootmoor" }, // Mathe
//         "11:35": { id: 2824875, sign: "DEUO2_11_Stk", school: "Grootmoor" }, // Deutsch
//         "12:20": { id: 2824878, sign: "DEUO2_11_Stk", school: "Grootmoor" }, // Deutsch
//         "13:20": { id: 2836393, sign: "ENGO5_11_Hm", school: "Grootmoor" }, // Englisch
//         "14:05": { id: 2836396, sign: "ENGO5_11_Hm", school: "Grootmoor" }, // Englisch
//     },
//     thursday: {
//         "08:00": { id: 2858143, sign: "GeoO1_11_Hd", school: "Grootmoor" }, // GEO
//         "08:45": { id: 2858146, sign: "GeoO1_11_Hd", school: "Grootmoor" }, // GEO
//         "10:00": { id: 1610861, sign: "Phy-pg_11.111.211.3A11.3B11x1", school: "Meiendorf" }, // Physik
//         "10:45": { id: 1610864, sign: "Phy-pg_11.111.211.3A11.3B11x1", school: "Meiendorf" }, // Physik
//         "12:00": { id: 1574019, sign: "PGW_11.2", school: "Meiendorf" }, // PGW
//         "12:45": { id: 1574022, sign: "PGW_11.2", school: "Meiendorf" }, // PGW
//         "14:00": { id: 1577788, sign: "Sem_11.2_ohne_MUN", school: "Meiendorf" }, // Seminar
//         "14:45": { id: 1577791, sign: "Sem_11.2_ohne_MUN", school: "Meiendorf" }, // Seminar
//     },
//     friday: {
//         "08:00": undefined,
//         "08:45": undefined,
//         "09:50": { id: 2854789, sign: "KunO2_11_CP", school: "Grootmoor" }, // Kunst
//         "10:35": { id: 2854792, sign: "KunO2_11_CP", school: "Grootmoor" }, // Kunst
//         "11:35": { id: 2858137, sign: "GeoO1_11_Hd", school: "Grootmoor" }, // GEO
//         "12:20": { id: 2858140, sign: "GeoO1_11_Hd", school: "Grootmoor" }, // GEO
//         "13:20": { id: 2857939, sign: "InfO1_1112_Bm", school: "Grootmoor" }, // Informatik
//         "14:05": { id: 2857942, sign: "InfO1_1112_Bm", school: "Grootmoor" }, // Informatik
//     }
// };

// export const BREAKS: BreaksRawByDay = {
//     monday: [
//         {
//             start: "09:30",
//             end: "09:50",
//             school: "Grootmoor"
//         },
//         {
//             start: "11:20",
//             end: "11:35",
//             school: "Grootmoor"
//         },
//         {
//             start: "13:05",
//             end: "15:00",
//             school: "Grootmoor"
//         }
//     ],
//     tuesday: [
//         {
//             start: "11:30",
//             end: "12:00",
//             school: "Meiendorf"
//         }
//     ],
//     wednesday: [
//         {
//             start: "09:30",
//             end: "09:50",
//             school: "Grootmoor"
//         },
//         {
//             start: "11:20",
//             end: "11:35",
//             school: "Grootmoor"
//         },
//         {
//             start: "13:05",
//             end: "13:20",
//             school: "Grootmoor"
//         }
//     ],
//     thursday: [
//         {
//             start: "09:30",
//             end: "10:00",
//             school: "Meiendorf"
//         },
//         {
//             start: "11:30",
//             end: "12:00",
//             school: "Meiendorf"
//         },
//         {
//             start: "13:30",
//             end: "14:00",
//             school: "Meiendorf"
//         }
//     ],
//     friday: [
//         {
//             start: "09:30",
//             end: "09:50",
//             school: "Grootmoor"
//         },
//         {
//             start: "11:20",
//             end: "11:35",
//             school: "Grootmoor"
//         },
//         {
//             start: "13:05",
//             end: "13:20",
//             school: "Grootmoor"
//         }
//     ],
//     others: [
//         {
//             start: "14:50",
//             end: "15:00",
//             school: "Grootmoor"
//         }
//     ]
// };

// export const LESSON_TIMES: LessonTimes = compileScheduleToLessonTimes();
// export const LESSON_TIMES_STRING: LessonTimesString = (() => {

//     const times: LessonTimesString = {};

//     for (const key of Object.keys(LESSON_TIMES) as School[]) {
//         if (!key) continue;
//         if (!LESSON_TIMES[key]) continue;
//         for (const time of LESSON_TIMES[key]) {
//             if (!time) continue;
//             if (!times[key]) times[key] = [];
//             times[key].push(time.end);
//             times[key].push(time.start);
//         }
//     }



//     return times;

// })();

// export const START_TIME: Time = UntisManager.parseTime(Object.values(LESSON_TIMES).flat().reduce((a, b) => {
//     const parsedStartA = UntisManager.parseTime(a.start);
//     const parsedStartB = UntisManager.parseTime(b.start);

//     const minutesStartA = parsedStartA.hour * 60 + parsedStartA.minute;
//     const minutesStartB = parsedStartB.hour * 60 + parsedStartB.minute;

//     if (minutesStartA < minutesStartB) return a;
//     return b;
// }).start);

// export const END_TIME: Time = UntisManager.parseTime(Object.values(LESSON_TIMES).flat().reduce((a, b) => {
//     const parsedEndA = UntisManager.parseTime(a.end);
//     const parsedEndB = UntisManager.parseTime(b.end);

//     const minutesEndA = parsedEndA.hour * 60 + parsedEndA.minute;
//     const minutesEndB = parsedEndB.hour * 60 + parsedEndB.minute;

//     if (minutesEndA < minutesEndB) return b;
//     return a;
// }).end);

// export type ScheduleDarius = ScheduleRawData;

// Exams

// export const EXAMS = {
//     get() {
//         return _EXAMS;
//     },
//     set(value: ExamList) {
//         _EXAMS = value;
//     }
// }

// let _EXAMS: ExamList = [
//     {
//         date: "08.10.2025",
//         subject: "Englisch",
//         sign: "ENGO5_11_Hm"
//     },
//     {
//         date: "10.10.2025",
//         subject: "Geo",
//         sign: "GeoO1_11_Hd"
//     },
//     {
//         date: "13.10.2025",
//         subject: "Deutsch",
//         sign: "DEUO2_11_Stk"
//     },
//     {
//         date: "04.11.2025",
//         subject: "Kunst",
//         sign: "KunO2_11_CP"
//     },
//     {
//         date: "05.11.2025",
//         subject: "Wirtschaft",
//         sign: "WirO1_11_Hus"
//     },
//     {
//         date: "13.11.2025",
//         subject: "Religion",
//         sign: "RelO2_11_Hb"
//     },
//     {
//         date: "17.11.2025",
//         subject: "Mathe",
//         sign: "MATO1_11_Wk"
//     },
//     {
//         date: "21.11.2025",
//         subject: "Informatik",
//         sign: "InfO1_1112_Bm"
//     },
//     {
//         date: "25.11.2025",
//         subject: "Englisch",
//         sign: "ENGO5_11_Hm"
//     },
//     {
//         date: "01.12.2025",
//         subject: "Deutsch",
//         sign: "DEUO2_11_Stk"
//     },
//     {
//         date: "05.12.2025",
//         subject: "Geo",
//         sign: "GeoO1_11_Hd"
//     },
//     {
//         date: "04.11.2025",
//         subject: "PGW",
//         sign: "PGW_11.2"
//     },
//     {
//         date: "13.11.2025",
//         subject: "Physik",
//         sign: "Phy-pg_11.111.211.3A11.3B11x1"
//     },
//     {
//         date: "20.11.2025",
//         subject: "Seminar",
//         sign: "Sem_11.2"
//     },
//     {
//         date: "20.01.2026",
//         subject: "PGW",
//         sign: "PGW_11.2"
//     },
//     {
//         date: "15.01.2026",
//         subject: "Physik",
//         sign: "Phy-pg_11.111.211.3A11.3B11x1"
//     }

// ].sort((a: Exam, b: Exam) => {
//     return dayjs(a.date, "DD.MM.YYYY").diff(dayjs(b.date, "DD.MM.YYYY"));
// });

// export function checkForExam(lesson: CompiledLesson): boolean {
//     const date = parseDate(lesson.date);
//     return _EXAMS.some(exam => (exam.sign === (lesson.studentGroup ? lesson.studentGroup : lesson.sg)) && exam.date === date);
// }

// function parseDate(date: number): string {
//     const dateString = date.toString();
//     const day = dateString.substring(6, 8);
//     const month = dateString.substring(4, 6);
//     const year = dateString.substring(0, 4);
//     if (year !== new Date().getFullYear().toString()) return "";
//     return `${day}.${month}`;
// }

// let _SCHOOLS: School[] = ["Meiendorf", "Grootmoor"];

// export const SCHOOLS = {
//     get: (): School[] => {
//         return _SCHOOLS;
//     },
//     set(schools: School[]) {
//         _SCHOOLS = schools;
//     }
// }

// let _UNTIS_ACCESSES: UntisAccess[] = [
//     {
//         school: "Meiendorf",
//         schoolId: "meiont",
//         username: "darius",
//         password: "password123",
//         host: "https://ikarus.webuntis.com",
//         classNames: ["11.2"],
//         uuid: "4a003b2d-044a-44af-8ad8-677a5acc9d2c"
//     },
//     {
//         school: "Grootmoor",
//         schoolId: "groot",
//         username: "max",
//         password: "password456",
//         host: "https://ikarus.webuntis.com",
//         classNames: ["11"],
//         uuid: "a9571aa1-664a-4de9-a523-816573f4546f"
//     }
// ];

// export const UNTIS_ACCESSES = {
//     get: (): UntisAccess[] => {
//         return _UNTIS_ACCESSES;
//     },
//     set: (accesses: UntisAccess[]) => {
//         _UNTIS_ACCESSES = accesses;
//     }
// };
