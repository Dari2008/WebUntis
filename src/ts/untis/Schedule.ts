

export default class Schedule{
        
    private schedule: ScheduleData;
    private name: string;
    private static schedules: Schedule[] = [];

    constructor(name: string, schedule: ScheduleData){
        this.schedule = schedule;
        let dayNumber = 0;



        for(const day of ["monday", "tuesday", "wednesday", "thursday", "friday"]){
            (this.schedule as any)[day].lessons.forEach((lesson: ScheduleLesson)=>{
                lesson.day = dayNumber;
            });
            dayNumber++;
        }

        this.name = name;
        Schedule.schedules.push(this);
    }

    public init(){}

    public static getScheduleByName(name: string): Schedule{
        return Schedule.schedules.filter((Schedule)=>Schedule.getName() === name)[0];
    }

    public static getSchedules(): Schedule[]{
        return Schedule.schedules;
    }

    public getName(): string{
        return this.name;
    }

    public getSchedule(): ScheduleData{
        return this.schedule;
    }

    public getMonday(): ScheduleDay{
        return this.schedule.monday;
    }

    public getTuesday(): ScheduleDay{
        return this.schedule.tuesday;
    }

    public getWednesday(): ScheduleDay{
        return this.schedule.wednesday;
    }

    public getThursday(): ScheduleDay{
        return this.schedule.thursday;
    }

    public getFriday(): ScheduleDay{
        return this.schedule.friday;
    }

    public getLessonFromNumber(day: ScheduleDay, lesson: number): ScheduleLesson{
        return day.lessons[lesson];
    }

    public getLessonsFromDate(date: Date, fullDay: boolean): ScheduleLesson[]{
        let day = date.getDay();
        switch(day){
            case 1:
                return fullDay?this.getMonday().lessons:this.getMonday().lessons.filter((lesson)=>this.lessonFilter(date, lesson));
            case 2:
                return fullDay?this.getTuesday().lessons:this.getTuesday().lessons.filter((lesson)=>this.lessonFilter(date, lesson));
            case 3:
                return fullDay?this.getWednesday().lessons:this.getWednesday().lessons.filter((lesson)=>this.lessonFilter(date, lesson));
            case 4:
                return fullDay?this.getThursday().lessons:this.getThursday().lessons.filter((lesson)=>this.lessonFilter(date, lesson));
            case 5:
                return fullDay?this.getFriday().lessons:this.getFriday().lessons.filter((lesson)=>this.lessonFilter(date, lesson));
        }
        return [];
    }

    public getLessonsFromDay(day: number): ScheduleLesson[]{
        switch(day){
            case 1:
                return this.getMonday().lessons;
            case 2:
                return this.getTuesday().lessons;
            case 3:
                return this.getWednesday().lessons;
            case 4:
                return this.getThursday().lessons;
            case 5:
                return this.getFriday().lessons;
        }
        return [];
    }

    public getLessonsUntilFromDate(date: Date): ScheduleLesson[]{
        let day = date.getDay();
        let lessons = this.getLessonsFromDay(day);
        lessons = lessons.filter((lesson)=>this.lessonFilterRemoveBefore(date, lesson));
        return lessons;
    }

    private lessonFilterRemoveBefore(date: Date, lesson: ScheduleLesson): boolean{
        if(lesson.lessonEnd.hour >= date.getHours()){
            if(lesson.lessonEnd.hour == date.getHours() && lesson.lessonEnd.minute > date.getMinutes()){
                return true;
            }else if(lesson.lessonEnd.hour > date.getHours()){
                return true;
            }
        }
        return false;
    }

    private lessonFilter(date: Date, lesson: ScheduleLesson): boolean{
        if(lesson.lessonStart.hour < date.getHours()){
            if(lesson.lessonEnd.hour > date.getHours()){
                if(lesson.lessonStart.minute < date.getMinutes()){
                    if(lesson.lessonEnd.minute > date.getMinutes()){
                        return true;
                    }
                }
            }
        }
        return false;
    }

    public getLessonFromTime(lessons: ScheduleLesson[], time: Time): ScheduleLesson{
        let remaining = lessons.filter((less)=>{
            if(time.hour > less.lessonStart.hour){
                if(time.hour < less.lessonEnd.hour){
                    if(time.minute > less.lessonStart.minute){
                        if(time.minute < less.lessonEnd.minute){
                            return true;
                        }
                    }
                }
            }
            return false;
        });
        return remaining[0];
    }

    public getLessonsBetweenDates(startDate: Date, endDate: Date): ScheduleLesson[]{
        let lessons: ScheduleLesson[] = [];
        let currentDate = startDate;
        while(currentDate <= endDate){
            lessons.push(this.getLessonFromTime(this.getLessonsFromDate(currentDate, true), {hour: currentDate.getHours(), minute: currentDate.getMinutes()}));
            currentDate.setMinutes(currentDate.getMinutes() + 45);
        }
        return lessons;
    }

};



export type ScheduleData = {
    monday: ScheduleDay;
    tuesday: ScheduleDay;
    wednesday: ScheduleDay;
    thursday: ScheduleDay;
    friday: ScheduleDay;
};

export type ScheduleDay = {
    lessons: ScheduleLesson[];
};

export type ScheduleLesson = {
    lessonStart: Time;
    lessonEnd: Time;
    subject: string|string[];
    id?: number;
    day?: number;
}

export type Time = {
    hour: number;
    minute: number;
};