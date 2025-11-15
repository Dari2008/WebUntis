import type { AllLessons, DayName } from "../@types/Schedule";
import type { School } from "../@types/School";
import UntisManager from "./UntisManager";
import UntisSchedule from "./UntisSchedule";

export class AllLessonsManager {

    private static ALL_LESSONS: AllLessons[] = [];
    private static ALL_LESSONS_SORTED_SIGN: {
        [key: string]: {
            time: string;
            day: DayName;
        }[];
    } = {};

    public static checkForNew(schedules: UntisSchedule[]) {
        const allLessons = [];
        for (const schedule of schedules) {
            allLessons.push(...schedule.lessons);
        }
        allLessons.forEach(e => {
            const sgOfE = e.studentGroup ?? e.sg ?? e.subjectShortName;
            if (!sgOfE) return;

            if (e.dayName) {
                if (!this.ALL_LESSONS_SORTED_SIGN[sgOfE]) {
                    this.ALL_LESSONS_SORTED_SIGN[sgOfE] = [];
                }
                const lesson = {
                    time: UntisManager.formatTime(e.startTime),
                    day: e.dayName
                };
                if (!this.ALL_LESSONS_SORTED_SIGN[sgOfE].some(e => {
                    return e.day == lesson.day && e.time == lesson.time;
                })) {
                    this.ALL_LESSONS_SORTED_SIGN[sgOfE].push(lesson);
                }
            }

            if (this.ALL_LESSONS.map((e) => {
                const sg = e.studentGroup ?? e.sg;
                if (!sg) return false;
                if (sg == sgOfE) return true;
                return false;
            }).some(e => e)) return;
            this.ALL_LESSONS.push(e);
        });
    }

    public static getAllLessonDayTimesFromSign(sign: string) {
        return this.ALL_LESSONS_SORTED_SIGN[sign] ?? [];
    }

    public static getAllStudentGroups(school?: School): string[] {
        if (!school) return this.ALL_LESSONS.map(e => e.studentGroup ?? e.sg ?? e.subjectShortName ?? "");
        return this.ALL_LESSONS.filter(e => e.school === school).map(e => e.studentGroup ?? e.sg ?? e.subjectShortName ?? "");
    }

}