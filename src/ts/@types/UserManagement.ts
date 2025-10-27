import type { UntisAccess } from "../ScheduleDarius";
import type { ExamList } from "./Exam";
import type { BreaksRawByDay, ScheduleRawData } from "./Schedule";
import type { School } from "./School";
import type { TeacherDatabase } from "./Teachers";


export type UpdateDataUntisAccess = UntisAccess[] | string[];
export type UpdateDataBreaks = BreaksRawByDay | string[];
export type UpdateDataTeachers = TeacherDatabase | string[];
export type UpdateDataSchedule = ScheduleRawData | string[];
export type UpdateDataExams = ExamList | string[];
export type UpdateDataPreferences = {
    [key in keyof Preferences]: string | boolean | number;
} | string[];

export type UpdateMethod = "add" | "remove";

export type Preferences = {
    lessonCancelColor: string;
    additionalLessonColor: string;
    examLessonColor: string;
    oneColorForEveryChange: boolean;
    roomChangeColor: string;
    teacherChangeColor: string;
    changeColor: string;
    notificationsEnabled: boolean;
}

export type AllData = {
    untisAccesses: UntisAccess[];
    breaks: BreaksRawByDay;
    teachers: TeacherDatabase;
    exams: ExamList;
    schedule: ScheduleRawData;
    schools: School[];
    preferences: Preferences;
}