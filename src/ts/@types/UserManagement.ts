// import type { LessonTimes, LessonTimesString } from "../ScheduleDarius_old";
import type { CompiledHoliday } from "../untis/HolidayLoader";
import type { Holiday } from "../untis/types";
import type { ExamList } from "./Exam";
import type { BreaksRawByDay, DayName, LessonTimes, LessonTimesString, ScheduleBreak, ScheduleRawData, ScheduleRawDay, Time } from "./Schedule";
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
export type UpdateDataSchedule = {
    [key in DayName]?: ScheduleRawDay;
} | string[];
export type UpdateDataExams = ExamList | string[];
export type UpdateDataIllDays = IllDate[] | string[];
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
    holidayColor: string;
    notificationsEnabled: boolean;
    notificationMessageLayouts: NotificationMessageLayouts;
    notificationMessageEnabledLayouts: NotificationMessageEnabledLayouts;
}

export type ToExcuseLessons = {
    [key: string]: number;
};

export type IllDate = {
    illDaysDefinitions: IllDayDefinition[];
    lessonsToExcuse: ToExcuseLessons;
    additionalLessonKeys: string[];
    reason: string;
    name: string;
    teacherClass: string;
    uuid: string;
}

export type IllDayDefinition = {
    from: string;
    to: string;
    wasIll: boolean;
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
    schoolTimes: SchoolTimes;
    preferences: Preferences;
    illDates: IllDate[];

    holidays: {
        [key: string]: CompiledHoliday[];
    };
    LESSON_TIMES: LessonTimes;
    LESSON_TIMES_STRING: LessonTimesString;
    START_TIME: Time;
    END_TIME: Time;

}

export type SchoolTimes = {
    [key: string]: {
        [key in DayName]: TimeGridLesson[]
    };
};

export type TimeGridLesson = {
    name: string;
    startTime: number;
    endTime: number;
};