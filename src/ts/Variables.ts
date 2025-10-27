import type { ExamList } from "./@types/Exam";
import type { BreaksRawByDay, ScheduleRawData } from "./@types/Schedule";
import type { School } from "./@types/School";
import type { TeacherDatabase } from "./@types/Teachers";
import type { UntisAccess } from "./@types/UntisAccess";

export let UNTIS_ACCESSES: UntisAccess[] = [];
export let EXAMS: ExamList = [];
export let BREAKS: BreaksRawByDay = {
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    others: []
};

export let TEACHERS: {
    [key in keyof School]?: TeacherDatabase;
} = {};

export let SCHEDULE: ScheduleRawData = {
    monday: {},
    tuesday: {},
    wednesday: {},
    thursday: {},
    friday: {}
};