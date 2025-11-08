import type { AllLessons } from "../@types/Schedule";
import type UntisSchedule from "./UntisSchedule";

export class AllLessonsManager {

    private static ALL_LESSONS: AllLessons[] = [];

    public static checkForNew(schedules: UntisSchedule[]) {
        console.log(schedules);
        const allLessons = [];
        for (const schedule of schedules) {
            allLessons.push(...schedule.lessons);
        }
        console.log(allLessons);
        allLessons.forEach(e => {
            const sgOfE = e.studentGroup ?? e.sg;
            if (!sgOfE) return;

            if (this.ALL_LESSONS.map((e) => {
                const sg = e.studentGroup ?? e.sg;
                if (!sg) return false;
                if (sg == sgOfE) return true;
                return false;
            }).some(e => e)) return;
            this.ALL_LESSONS.push(e);
        });
    }

    public static getAllStudentGroups(): string[] {
        return this.ALL_LESSONS.map(e => e.studentGroup ?? e.sg ?? "");
    }

}