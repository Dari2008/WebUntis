import type { ScheduleLesson } from "../../@types/Schedule";

export default class Lesson {

    constructor(private lesson: ScheduleLesson, private questsions: () => any, private dateRange: DateRange, private hoursMissed: number) {
    }

    public getLesson(): ScheduleLesson {
        return this.lesson;
    }

    public setDateRange(dateRange: DateRange): void {
        this.dateRange = dateRange;
    }

    public getHoursMissed(): number {
        return this.hoursMissed;
    }

    public getDateRange(): DateRange {
        return this.dateRange;
    }

    public getDateString(): string {
        return this.dateRange.start.toLocaleDateString("de-DE") + " - " + this.dateRange.end.toLocaleDateString("de-DE");
    }

    public getHoursMissedString(): string {
        return this.hoursMissed.toString();
    }

    public getCurrentName(): string {
        return (this.lesson.id || this.lesson.id === 0) && this.questsions()[this.lesson.id] ? this.questsions()[this.lesson.id] : ((typeof this.lesson.subject === "object") ? this.lesson.subject[0] : this.lesson.subject);
    }

    public getSubjectAsString(): string {
        return this.lesson.subject instanceof Array ? this.lesson.subject.join(", ") : this.lesson.subject;
    }

    // public render(ctx: CanvasRenderingContext2D, index: number): void {
    // }

}

export type DateRange = {
    start: Date,
    end: Date
};

export function combineDateRanges(dateRange1: DateRange, dateRange2: DateRange): DateRange {
    return {
        start: dateRange1.start < dateRange2.start ? dateRange1.start : dateRange2.start,
        end: dateRange1.end > dateRange2.end ? dateRange1.end : dateRange2.end
    };
}