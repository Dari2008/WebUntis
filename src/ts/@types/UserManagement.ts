// import type { LessonTimes, LessonTimesString } from "../ScheduleDarius_old";
import type { ExamList } from "./Exam";
import type { BreaksRawByDay, LessonTimes, LessonTimesString, ScheduleBreak, ScheduleRawData, Time } from "./Schedule";
import type { School } from "./School";
import type { TeacherDatabase } from "./Teachers";
import type { UntisAccess } from "./UntisAccess";


export type UpdateDataUntisAccess = UntisAccess[] | string[];
export type UpdateDataBreaks = {
    [key in keyof BreaksRawByDay]?: ScheduleBreak;
} | string[];
export type UpdateDataTeachers = {
    [key: string]: TeacherDatabase
} | string[];
export type UpdateDataSchedule = ScheduleRawData | string[];
export type UpdateDataExams = ExamList | string[];
export type UpdateDataPreferences = {
    [key in keyof Preferences]?: string | boolean | number;
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
    teachers: {
        [key: string]: TeacherDatabase;
    };
    exams: ExamList;
    schedule: ScheduleRawData;
    schools: School[];
    preferences: Preferences;


    LESSON_TIMES: LessonTimes;
    LESSON_TIMES_STRING: LessonTimesString;
    START_TIME: Time;
    END_TIME: Time;

}