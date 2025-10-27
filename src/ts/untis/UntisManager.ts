import type { CompiledLesson, DayName, ScheduleBreak, ScheduleRawDay, Time } from "../@types/Schedule";
import type { School } from "../@types/School";
import type { Teacher } from "../@types/Teachers";
import type { UntisAccess } from "../@types/UntisAccess";
import { HOST } from "../ScheduleDarius_old";
import { UserManagement } from "../userManagement/UserManagement";
import { type Lesson, type Klasse, type WebAPITimetable } from "./";
import { UNKNOWN_TEACHER } from "./TeacherDatabase";


export type TempLesson = (Lesson | WebAPITimetable) & {
    scheduleId: string;
    school: School;
}

export default class UntisManager {

    private untis: UntisAccess = undefined as any;
    // private schoolType: School;

    // private host = "192.168.178.110:2222";

    constructor(
        untisAccess: UntisAccess
    ) {
        this.untis = untisAccess;
        // this.untis = new WebUntis(school, username, password, baseurl, identity, disableUserAgent);
        // this.schoolType = schoolType;
    }

    public getUntis(): UntisAccess {
        return this.untis;
    }

    public getSchool(): School {
        return this.untis.school;
    }

    public getClassNames(): string[] {
        return this.untis.classNames;
    }

    private responseRange = null;

    // public async getCompiledLessonForRange(className: string, startDate: Date, endDate: Date): Promise<CompiledLesson[]> {
    public async getCompiledLessonForRange(className: string, startDate: Date, endDate: Date): Promise<void> {

        try {
            const response = await fetch("http://" + HOST + "/untis/getTimetableForRange.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    startDate: startDate ? (startDate.toISOString().split("T")[0]) : undefined,
                    endDate: endDate ? (endDate.toISOString().split("T")[0]) : undefined,
                    className: className,
                    username: this.untis.username,
                    password: this.untis.password,
                    school: this.untis.school,
                    baseurl: this.untis.host,
                })
            });

            if (!response.ok) {
                console.trace("Failed to fetch timetable: " + response.statusText);
                return;
                // return [];
            }

            const responseData = await response.json();

            if (!responseData || responseData.error) {
                console.trace("Failed to fetch timetable: " + responseData.error);
                return;
                // return [];
            }
            this.responseRange = responseData;
            // return this.compileLessonLesson(responseData as Lesson[]);
        } catch (e) {
            console.error("Error fetching timetable via proxy:", e);
            // return [];
        }

        // return [];
    }
    private responseWeek = null;

    // public async getLessonForWeekCompiledViaProxy(className: string, startDate?: Date): Promise<CompiledLesson[]> {
    public async getLessonForWeekCompiledViaProxy(className: string, startDate?: Date): Promise<void> {

        try {
            const response = await fetch("http://" + HOST + "/untis/getTimetableForWeek.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    startDate: startDate ? (startDate.toISOString().split("T")[0]) : undefined,
                    className: className,
                    username: this.untis.username,
                    password: this.untis.password,
                    school: this.untis.school,
                    baseurl: this.untis.host,
                })
            });

            if (!response.ok) {
                // throw new Error("Failed to fetch timetable: " + response.statusText);
                console.error("Failed to fetch timetable: " + response.statusText);
                return;
            }

            const responseData = await response.json();

            if (!responseData || responseData.error) {
                // throw new Error("Failed to fetch timetable: " + responseData.error);
                console.error("Failed to fetch timetable: " + responseData.error);
                return;
            }

            this.responseWeek = responseData;

            // return this.compileLesson(responseData as WebAPITimetable[]);
        } catch (e) {
            console.error("Error fetching timetable via proxy:", e);
            // return [];
        }

    }

    public getRawLessons(): WebAPITimetable[] | Lesson[] | null {
        if (this.responseRange) return this.responseRange;
        return this.responseWeek;
    }


    public static compileLessons<T extends TempLesson[]>(lessons: T): CompiledLesson[] {
        if (lessons.length > 0) {
            if (lessons[0].type == "Lesson") {
                return UntisManager.compileLessonLesson(lessons[0].school, lessons as Lesson[]);
            } else {
                return UntisManager.compileLesson(lessons[0].school, lessons as WebAPITimetable[]);
            }
        }
        return [];
    }

    public static checkForMultipleLessons(lessons: TempLesson[]): TempLesson[] {
        const converToTime = (m: number): number => {
            const minutes = m % 60;
            m = m - minutes;
            const hour = m / 60;
            return parseInt(hour + "" + minutes.toString().padStart(2, "0"));
        };

        const stringTimeToMinutes = (time: string) => {
            const parsed = UntisManager.parseTime(time);
            return parsed.hour * 60 + parsed.minute;
        }

        const breakSpanFilter = (b: ScheduleBreak): boolean => {
            const startM = stringTimeToMinutes(b.start);
            const endM = stringTimeToMinutes(b.end);
            const time = endM - startM;
            if (time > 40) return false;
            return true;
        };


        const lessonStartTimes:
            {
                [key in DayName]?: (keyof ScheduleRawDay)[];
            } = {};

        for (const dayOfWeek of (Object.keys(UserManagement.ALL_DATA!.schedule) as DayName[])) {
            const keys = (Object.keys(UserManagement.ALL_DATA!.schedule[dayOfWeek]) as (keyof ScheduleRawDay)[]).filter(k => !!UserManagement.ALL_DATA!.schedule[dayOfWeek][k]);
            lessonStartTimes[dayOfWeek] = keys;
        }

        console.log(lessonStartTimes);

        for (const lesson of ([...lessons] as TempLesson[])) {
            const startTime = UntisManager.parseTime(UntisManager.formatTime(lesson.startTime));
            const endTime = UntisManager.parseTime(UntisManager.formatTime(lesson.endTime));
            const startTimeMinutes = startTime.hour * 60 + startTime.minute;
            const endTimeMinutes = endTime.hour * 60 + endTime.minute;
            const lessonDayOfWeek = UntisManager.formatUntisDateAsDate(lesson.date.toString()).toLocaleDateString("en-US", { weekday: "long" }).toLowerCase() as DayName;
            if (startTimeMinutes + 45 < endTimeMinutes) {
                lessons = lessons.filter(l => l.id != lesson.id);
                for (let t = startTimeMinutes; t < endTimeMinutes - 45; t += 45) {
                    if (t > endTimeMinutes) {
                        break;
                    }
                    const breakFound = Object.values(UserManagement.ALL_DATA!.breaks).flat().filter(breakSpanFilter).filter(b => b.school == lesson.school).find(b => stringTimeToMinutes(b.start) == t);
                    if (breakFound) {
                        const startM = stringTimeToMinutes(breakFound.start);
                        const endM = stringTimeToMinutes(breakFound.end);
                        const time = endM - startM;
                        t += time;
                    }

                    let time = t;

                    let found = false;

                    for (const possibleStartTime of (lessonStartTimes[lessonDayOfWeek] || [])) {
                        const possibleStartTimeMinutes = stringTimeToMinutes(possibleStartTime as string);
                        if (time == possibleStartTimeMinutes) {
                            found = true;
                            break;
                        }

                        if (time < possibleStartTimeMinutes && (time + 45) > possibleStartTimeMinutes) {
                            time = possibleStartTimeMinutes;
                            found = true;
                            break;
                        }



                    }
                    const endTime = time + 45;

                    if (!found) {
                        const newLesson = JSON.parse(JSON.stringify(lesson)) as TempLesson;
                        newLesson.startTime = converToTime(time);
                        newLesson.endTime = converToTime(endTime > endTimeMinutes ? endTimeMinutes : endTime);
                        lessons.push(newLesson);
                        continue;
                    }



                    const possibleSchools: {
                        school: School;
                        scheduleId: string;
                    }[] = [];

                    for (const lesson of lessons) {
                        const startTime = UntisManager.parseTime(UntisManager.formatTime(lesson.startTime));
                        const endTime = UntisManager.parseTime(UntisManager.formatTime(lesson.endTime));
                        const startM = startTime.hour * 60 + startTime.minute;
                        const endM = endTime.hour * 60 + endTime.minute;
                        if (time == startM && time + 45 == endM) {
                            if (possibleSchools.map(e => e.scheduleId).includes(lesson.scheduleId)) continue;
                            possibleSchools.push({
                                school: lesson.school,
                                scheduleId: lesson.scheduleId
                            });
                        }
                    }

                    for (const school of possibleSchools) {
                        const newLesson = JSON.parse(JSON.stringify(lesson)) as TempLesson;
                        newLesson.school = school.school;
                        newLesson.scheduleId = school.scheduleId;
                        newLesson.startTime = converToTime(time);
                        newLesson.endTime = converToTime(endTime > endTimeMinutes ? endTimeMinutes : endTime);
                        lessons.push(newLesson);
                    }


                }
            }
        }
        return lessons;
    }

    private static compileLessonLesson(schoolType: School, lessons: Lesson[]): CompiledLesson[] {

        // lessons = this.checkForMultipleLessonsInOne(lessons);

        const lessonCompiled = [];
        for (const lesson of lessons) {
            if (lesson) {

                const day = UntisManager.formatUntisDateAsDate(lesson.date.toString()).toLocaleDateString("en-US", { weekday: "long" }).toLowerCase();
                const time = UntisManager.formatTime(lesson.startTime);
                const timeEnd = UntisManager.formatTime(lesson.endTime);
                const timeParsed = UntisManager.parseTime(time);
                const timeEndParsed = UntisManager.parseTime(timeEnd);

                const clesson = lesson as CompiledLesson;
                if (clesson.subjects && clesson.subjects.length > 0) {
                    clesson.subjectFullName = clesson.subjects[0].element.longName;
                    clesson.subjectShortName = clesson.subjects[0].element.name ? clesson.subjects[0].element.name : clesson.subjects[0].element.alternatename;
                    clesson.subjectId = clesson.subjects[0].id;
                } else if (clesson.su && clesson.su.length > 0) {
                    clesson.subjectFullName = clesson.su[0].longname;
                    clesson.subjectShortName = clesson.su[0].name;
                    clesson.subjectId = clesson.su[0].id;
                }

                clesson.studentGroup = clesson.sg;
                if (!clesson.cellState) {
                    if (clesson.code == "cancelled") {
                        clesson.cellState = "CANCEL";
                    } else {
                        clesson.cellState = "STANDARD";
                    }
                }

                const loadTeacherName = () => {

                    if (clesson.te) {
                        if (clesson.te.length > 0) {
                            clesson.teacherShortName = clesson.te[0].name;
                            const teacher = UntisManager.getFullNameFromShortOfTeacher(clesson.te[0].name, schoolType);
                            return teacher;
                        }
                    }

                    const sg = clesson.studentGroup ? clesson.studentGroup : clesson.sg;
                    if (sg) {
                        const sgData = sg.split("_");
                        if (sgData.length == 3) {
                            clesson.teacherShortName = sgData[2];
                            const teacher = UntisManager.getFullNameFromShortOfTeacher(sgData[2], schoolType);
                            return teacher;
                        }
                        return UNKNOWN_TEACHER(sgData.length == 0 ? "" : sgData[sgData.length - 1]);
                    }
                    return undefined;
                };

                if (clesson.teachers && clesson.teachers.length > 1) {

                    clesson.multipleTeachers = true;
                    clesson.cTeachers = [];
                    for (const t of clesson.teachers) {
                        if (t.element.name) {
                            clesson.teacherShortName = t.element.name;
                            let teacher: Teacher | undefined = UntisManager.getFullNameFromShortOfTeacher(clesson.teacherShortName, schoolType);
                            if (!teacher || (teacher.isUnknownTeacher && teacher.isUnknownTeacher != undefined)) {
                                teacher = loadTeacherName();
                            }

                            if (clesson.teachers[0].state == "SUBSTITUTED") {
                                const originalTeacher = loadTeacherName();
                                clesson.originalTeacher = originalTeacher;
                            }
                            if (teacher) {
                                clesson.cTeachers.push(teacher);
                                teacher.name.fullName = teacher?.name.firstName + " " + (teacher?.name.surname ? teacher?.name.surname : "");
                            }
                            // clesson.teacherFullName = teacher?.name.firstName + " " + (teacher?.name.surname ? teacher?.name.surname : "");
                            // clesson.teacherSubjectString = teacher?.subjects.join(", ");
                            // clesson.teacherStatus = clesson.teachers[0].state;
                        }
                    }
                } else if (clesson.teachers && clesson.teachers.length > 0 && clesson.teachers[0].element.name) {
                    clesson.multipleTeachers = false;
                    clesson.teacherShortName = clesson.teachers[0].element.name;
                    let teacher: Teacher | undefined = UntisManager.getFullNameFromShortOfTeacher(clesson.teacherShortName, schoolType);
                    if (!teacher || (teacher.isUnknownTeacher && teacher.isUnknownTeacher != undefined)) {
                        teacher = loadTeacherName();
                    }

                    if (clesson.teachers[0].state == "SUBSTITUTED") {
                        const originalTeacher = loadTeacherName();
                        clesson.originalTeacher = originalTeacher;
                    }

                    clesson.teacher = teacher;
                    clesson.teacherFullName = teacher?.name.firstName + " " + (teacher?.name.surname ? teacher?.name.surname : "");
                    clesson.teacherSubjectString = teacher?.subjects.join(", ");
                    clesson.teacherStatus = clesson.teachers[0].state;
                } else {
                    const teacher: Teacher | undefined = loadTeacherName();
                    if (teacher) {
                        clesson.teacher = teacher;
                        clesson.teacherFullName = teacher.name.firstName + (teacher.name.surname ? " " + teacher.name.surname : "");
                        clesson.teacherShortName = teacher.short;
                        clesson.teacherSubjects = teacher.subjects;
                        clesson.teacherSubjectStringParsed = teacher.subjects.join(", ");
                        clesson.teacherStatus = "REGULAR";
                    }
                }

                if (clesson.rooms && clesson.rooms.length > 0) {
                    clesson.roomFullName = clesson.rooms[0].element.longName;
                    clesson.roomShortName = clesson.rooms[0].element.name;
                    clesson.roomId = clesson.rooms[0].id;
                } else if (clesson.ro && clesson.ro.length > 0) {
                    clesson.roomFullName = clesson.ro[0].longname;
                    clesson.roomShortName = clesson.ro[0].name;
                    clesson.roomId = clesson.ro[0].id;
                }

                clesson.startTimeParsed = timeParsed;
                clesson.endTimeParsed = timeEndParsed;

                clesson.dayName = day as DayName;
                lessonCompiled.push(clesson);
            }
        }
        return lessonCompiled;
    }

    private static compileLesson(schoolType: School, lessons: WebAPITimetable[]): CompiledLesson[] {
        // lessons = this.checkForMultipleLessonsInOne(lessons);

        const lessonCompiled = [];
        for (const lesson of lessons) {
            if (lesson) {

                const day = UntisManager.formatUntisDateAsDate(lesson.date.toString()).toLocaleDateString("en-US", { weekday: "long" }).toLowerCase();
                const time = UntisManager.formatTime(lesson.startTime);
                const timeEnd = UntisManager.formatTime(lesson.endTime);
                const timeParsed = UntisManager.parseTime(time);
                const timeEndParsed = UntisManager.parseTime(timeEnd);

                const clesson = lesson as unknown as CompiledLesson;

                if (clesson.subjects && clesson.subjects.length > 0) {
                    clesson.subjectFullName = clesson.subjects[0].element.longName;
                    clesson.subjectShortName = clesson.subjects[0].element.name ? clesson.subjects[0].element.name : clesson.subjects[0].element.alternatename;
                    clesson.subjectId = clesson.subjects[0].id;

                }

                const loadTeacherName = (short?: string) => {
                    if (short) {
                        const teacher = UntisManager.getFullNameFromShortOfTeacher(short, schoolType);
                        return teacher;
                    }
                    if (clesson.studentGroup) {
                        const sgData = clesson.studentGroup.split("_");
                        if (sgData.length == 3) {
                            clesson.teacherShortName = sgData[2];
                            const teacher = UntisManager.getFullNameFromShortOfTeacher(sgData[2], schoolType);
                            return teacher;
                        }
                        return UNKNOWN_TEACHER(sgData.length == 0 ? "" : sgData[sgData.length - 1]);
                    }
                    return undefined;
                };

                if (clesson.teachers && clesson.teachers.length > 1) {

                    clesson.multipleTeachers = true;
                    clesson.cTeachers = [];
                    for (const t of clesson.teachers) {
                        if (t.element.name) {
                            clesson.teacherShortName = t.element.name;
                            let teacher: Teacher | undefined = UntisManager.getFullNameFromShortOfTeacher(clesson.teacherShortName, schoolType);
                            if (!teacher || (teacher.isUnknownTeacher && teacher.isUnknownTeacher != undefined)) {
                                teacher = loadTeacherName(clesson.teacherShortName);
                            }

                            if (clesson.teachers[0].state == "SUBSTITUTED") {
                                const originalTeacher = loadTeacherName();
                                clesson.originalTeacher = originalTeacher;
                            }
                            if (teacher) {
                                clesson.cTeachers.push(teacher);
                                teacher.name.fullName = teacher?.name.firstName + " " + (teacher?.name.surname ? teacher?.name.surname : "");
                            }
                            // clesson.teacherFullName = teacher?.name.firstName + " " + (teacher?.name.surname ? teacher?.name.surname : "");
                            // clesson.teacherSubjectString = teacher?.subjects.join(", ");
                            // clesson.teacherStatus = clesson.teachers[0].state;
                        } else {
                        }
                    }
                } else if (clesson.teachers && clesson.teachers.length > 0 && clesson.teachers[0].element.name) {
                    clesson.multipleTeachers = false;
                    clesson.teacherShortName = clesson.teachers[0].element.name;
                    let teacher: Teacher | undefined = UntisManager.getFullNameFromShortOfTeacher(clesson.teacherShortName, schoolType);
                    if (!teacher || (teacher.isUnknownTeacher && teacher.isUnknownTeacher != undefined)) {
                        teacher = loadTeacherName();
                    }

                    if (clesson.teachers[0].state == "SUBSTITUTED") {
                        const originalTeacher = loadTeacherName();
                        clesson.originalTeacher = originalTeacher;
                    }

                    clesson.teacher = teacher;
                    clesson.teacherFullName = teacher?.name.firstName + " " + (teacher?.name.surname ? teacher?.name.surname : "");
                    clesson.teacherSubjectString = teacher?.subjects.join(", ");
                    clesson.teacherStatus = clesson.teachers[0].state;
                } else {
                    const teacher = loadTeacherName();
                    if (teacher) {
                        clesson.teacher = teacher;
                        clesson.teacherFullName = teacher.name.firstName + (teacher.name.surname ? " " + teacher.name.surname : "");
                        clesson.teacherShortName = teacher.short;
                        clesson.teacherSubjects = teacher.subjects;
                        clesson.teacherSubjectStringParsed = teacher.subjects.join(", ");
                        clesson.teacherStatus = "REGULAR";
                    }
                }

                if (clesson.rooms && clesson.rooms.length > 0) {
                    clesson.roomFullName = clesson.rooms[0].element.longName;
                    clesson.roomShortName = clesson.rooms[0].element.name;
                    clesson.roomId = clesson.rooms[0].id;
                }

                clesson.startTimeParsed = timeParsed;
                clesson.endTimeParsed = timeEndParsed;

                clesson.dayName = day as DayName;
                lessonCompiled.push(clesson);
            }
        }
        return lessonCompiled;
    }

    public static getFullNameFromShortOfTeacher(shortName: string, school: School): Teacher {
        const found = UserManagement.ALL_DATA!.teachers[school].find(t => {
            if (t.short.toLowerCase() == shortName.toLowerCase()) {
                return true;
            }
            return false;
        });
        return found ? found : UNKNOWN_TEACHER(shortName);
        // if (!found) return TEACHER_DATABASE[UntisManager.getOppositSchool(school)].find(t => {
        //     if (t.short.toLowerCase() == shortName.toLowerCase()) {
        //         return true;
        //     }
        //     return false;
        // });

        // return found;
    }

    public getFilteredLessons(lessons: Lesson[], filteredAfterStartDate: boolean) {

        type FilteredLessonArray = {
            [key: string]: {
                [key: string]: {
                    sortDate: number;
                    lessons: Lesson[];
                };
            }
        };

        const filtered: FilteredLessonArray = {};

        lessons.forEach(less => {

            const time = filteredAfterStartDate ? less.startTime : less.endTime;

            const formattedTime = UntisManager.formatTime(time);
            const formattedDate = UntisManager.formatUntisDate(less.date + "");

            if (!filtered[formattedDate]) {
                filtered[formattedDate] = {};
            }

            if (filtered[formattedDate][formattedTime]) {
                filtered[formattedDate][formattedTime].lessons.push(less);
            } else {
                filtered[formattedDate][formattedTime] = {
                    sortDate: time,
                    lessons: [less]
                };
            }
        });
        return filtered;
    }

    public static formatUntisDateAsDate(date: string): Date {
        const year = date.substring(0, 4);
        const month = date.substring(4, 6);
        const day = date.substring(6, 8);
        return new Date(year + "-" + month + "-" + day);
    }

    public static formatUntisDate(date: string): string {
        const year = date.substring(0, 4);
        const month = date.substring(4, 6);
        const day = date.substring(6, 8);
        return day + "." + month + "." + year;
    }

    public static formatTime(time: number): string {
        const str = time + "";
        if (str.length == 3) {
            return "0" + str[0] + ":" + str[1] + str[2];
        } else if (str.length == 4) {
            return str[0] + str[1] + ":" + str[2] + str[3];
        }
        return "Invalid time";
    }

    public static parseTime(time: string): Time {
        const parts = time.split(":");
        const hours = parts[0];
        const minutes = parts[1];
        return {
            hour: parseInt(hours),
            minute: parseInt(minutes)
        }
    }

    public static lessonContainsClass(lesson: Lesson, className: Klasse): boolean {
        return lesson.kl.some(c => c.id === className.id);
    }
};