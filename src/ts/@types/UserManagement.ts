// import type { LessonTimes, LessonTimesString } from "../ScheduleDarius_old";
import type { ExamList } from "./Exam";
import type { BreaksRawByDay, LessonTimes, LessonTimesString, ScheduleBreak, ScheduleRawData, Time } from "./Schedule";
import type { School } from "./School";
import type { TeacherDatabase } from "./Teachers";
import type { UntisAccess } from "./UntisAccess";


export type UpdateDataUntisAccess = UntisAccess[] | string[];
export type UpdateDataBreaks = {
    [key in keyof BreaksRawByDay]?: ScheduleBreak[];
} | string[];
export type UpdateDataTeachers = {
    [key: string]: TeacherDatabase
} | string[];
export type UpdateDataSchedule = ScheduleRawData | string[];
export type UpdateDataExams = ExamList | string[];
export type UpdateDataPreferences = {
    [key in keyof Preferences]?: string | boolean | number | NotificationMessageLayouts | NotificationMessageEnabledLayouts;
} | string[];

export type UpdateMethod = "add" | "remove";

export type NotificationMessageLayouts = {
    lessonNormalAgain: string;
    lessonCancelled: string;
    lessonReplacedByAdditional: string;
    lessonReplacedByEvent: string;
    teacherSubstitution: string;
    teacherAbsent: string;
    roomSubstitution: string;
    event: string;
    additionalLesson_new: string;
    exam: string;
};

export type NotificationMessageEnabledLayouts = {
    lessonNormalAgain: boolean;
    lessonCancelled: boolean;
    lessonReplacedByAdditional: boolean;
    lessonReplacedByEvent: boolean;
    teacherSubstitution: boolean;
    teacherAbsent: boolean;
    roomSubstitution: boolean;
    event: boolean;
    additionalLesson_new: boolean;
    exam: boolean;
};

export type Preferences = {
    examReminderTimes: string;
    lessonCancelColor: string;
    additionalLessonColor: string;
    examLessonColor: string;
    oneColorForEveryChange: boolean;
    roomChangeColor: string;
    teacherChangeColor: string;
    changeColor: string;
    notificationsEnabled: boolean;
    notificationMessageLayouts: NotificationMessageLayouts;
    notificationMessageEnabledLayouts: NotificationMessageEnabledLayouts;
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