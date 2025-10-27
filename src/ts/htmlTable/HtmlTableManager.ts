import type { CompiledLesson, DayName, LessonSlot, ScheduleBreak, Time } from "../@types/Schedule";
import type { School } from "../@types/School";
import { BREAKS, checkForExam, END_TIME, LESSON_TIMES_STRING, SCHEDULE, START_TIME } from "../ScheduleDarius";
import { getColumnForSchool, SCHOOL_COUNT } from "../untis/TeacherDatabase";
import UntisManager from "../untis/UntisManager";
import UntisSchedule from "../untis/UntisSchedule";

export class HTMLTableManager {


    public static CURRENT_LESSON_OPEN: CompiledLesson | undefined = undefined;

    private tableElement: HTMLDivElement | undefined;
    private headerRow: HeaderRow[] = [];
    private startTimesNeededParsedToIndex: { [key: string]: number } = {};
    private id: string;
    private currentDayDiv: HTMLDivElement = document.createElement("div");
    private heightHeaderPercentage = 2.5;
    private schoolTimesBackgroundDiv: HTMLDivElement | undefined;

    constructor(classs: string, id: string) {
        this.id = id;
        this.tableElement = document.querySelector("." + classs) as HTMLDivElement;
        if (!this.tableElement) {
            console.error("Table element with id " + classs + " not found!");
            return;
        }

        this.tableElement.innerHTML = "";
        this.tableElement.style.display = "grid";

        const widthOfAll = 100 - (SCHOOL_COUNT * 10);
        this.tableElement.style.gridTemplateColumns = `repeat(${SCHOOL_COUNT}, 10%) calc(${widthOfAll}% / 5) calc(${widthOfAll}% / 5) calc(${widthOfAll}% / 5) calc(${widthOfAll}% / 5) calc(${widthOfAll}% / 5)`;
        this.tableElement.style.gridTemplateRows = `max(${this.heightHeaderPercentage}%, 4vh)`;

        const longToShortName: {
            [key: string]: string
        } = {
            "monday": "Mo.",
            "tuesday": "Di.",
            "wednesday": "Mi.",
            "thursday": "Do.",
            "friday": "Fr."
        };

        for (const dayOfWeek of ["", "", "monday", "tuesday", "wednesday", "thursday", "friday"]) {
            const name = dayOfWeek ? dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1) : dayOfWeek;
            const div = document.createElement("div");
            div.classList.add("header");
            if (dayOfWeek) div.classList.add(dayOfWeek);
            if (name) {
                const longName = document.createElement("span");
                longName.classList.add("doNotRemove");
                longName.classList.add("longName");
                longName.innerText = name;

                const shortName = document.createElement("span");
                shortName.classList.add("doNotRemove");
                shortName.classList.add("shortName");
                shortName.innerText = longToShortName[dayOfWeek];

                div.append(longName);
                div.append(shortName);
            }

            div.style.gridArea = "1 / " + (this.headerRow.length + 1) + " / 2 / " + (this.headerRow.length + 2);
            this.tableElement.appendChild(div);
            this.headerRow.push(div);
        }


        const insidePopInfo = document.getElementById("insidePopInfo");

        const teacherShortNameMultiple = insidePopInfo?.querySelector(".teacherShortNameMultiple") as HTMLButtonElement;
        const teacherFullNameMultiple = insidePopInfo?.querySelector(".teacherFullNameMultiple") as HTMLButtonElement;
        const teacherSubjectsMultiple = insidePopInfo?.querySelector(".teacherSubjectsMultiple") as HTMLButtonElement;

        if (teacherShortNameMultiple) teacherShortNameMultiple.onclick = this.openTeacherView;
        if (teacherFullNameMultiple) teacherFullNameMultiple.onclick = this.openTeacherView;
        if (teacherSubjectsMultiple) teacherSubjectsMultiple.onclick = this.openTeacherView;

        this.currentDayDiv.classList.add("currentDay");

        this.schoolTimesBackgroundDiv = document.createElement("div");
        this.schoolTimesBackgroundDiv.classList.add("schoolTimesBackground");
        this.schoolTimesBackgroundDiv.style.gridArea = "2 / 1 / " + (this.rowCount + 2) + " / " + (SCHOOL_COUNT + 1);
        this.tableElement.appendChild(this.schoolTimesBackgroundDiv);

        this.setCurrentDate(100);
        // this.calculateHeight(LESSON_TIMES);

    }

    private setCurrentDate(maxHeightIndex: number) {
        const indexToday = this.getDayAsIndex(new Date().toLocaleDateString("en-US", { weekday: "long" }).toLowerCase());

        if (indexToday == -1) this.currentDayDiv.style.display = "none";

        this.currentDayDiv.style.gridArea = "1 / " + (indexToday) + " / " + (maxHeightIndex + 2) + " / " + (indexToday + 1);
        this.schoolTimesBackgroundDiv!.style.gridArea = "2 / 1 / " + (maxHeightIndex + 2) + " / " + (SCHOOL_COUNT + 1);

        this.tableElement!.appendChild(this.currentDayDiv);
    }

    private getDayAsIndex(day: string): number {
        let column = 0;
        switch (day) {
            case "monday": column = 1; break;
            case "tuesday": column = 2; break;
            case "wednesday": column = 3; break;
            case "thursday": column = 4; break;
            case "friday": column = 5; break;
            default: return -1;
        }
        return column + SCHOOL_COUNT;
    }

    private sortTimeArray(a: string, b: string) {
        const aParts = a.split(":");
        const bParts = b.split(":");
        const aHour = parseInt(aParts[0], 10);
        const aMinute = parseInt(aParts[1], 10);
        const bHour = parseInt(bParts[0], 10);
        const bMinute = parseInt(bParts[1], 10);
        if (aHour === bHour) {
            return aMinute - bMinute;
        }
        return aHour - bHour;
    }

    private rowCount = 0;

    private caluclateGrid(startTime: Time, endTime: Time) {


        let timeSpan = 0;


        timeSpan = (endTime.hour * 60 + endTime.minute) - (startTime.hour * 60 + startTime.minute);

        this.rowCount = timeSpan / 5;

        if (this.rowCount % 1 != 0) {
            this.rowCount += 1;
        }

        this.totalLessonMinutes = (endTime.hour * 60 + endTime.minute) - (startTime.hour * 60 + startTime.minute);


        this.tableElement!.style.setProperty("--totalMinutes", this.totalLessonMinutes.toString());
        this.tableElement!.style.gridTemplateRows = `max(${this.heightHeaderPercentage}%, 4vh)`;
        this.tableElement!.style.gridTemplateRows += " repeat(" + this.rowCount + ", " + (this.maxHeight / this.rowCount) + "%)";

    }

    public clear() {

        this.tableElement!.querySelectorAll(":not(.header):not(.currentDay):not(.doNotRemove):not(.schoolTimesBackground)").forEach(c => c.remove());
    }

    private calculateHeight(lessonTimes: string[], school: School, startTime: Time) {

        lessonTimes.sort(this.sortTimeArray);

        const columnCount = 6;

        let countingRowNumber = 0;


        const timeToRow = (time: string | undefined): number => {
            if (!time) return -1;
            const parsedTime = this.parseLessonTime(time);
            const timeInMinutes = (parsedTime.hour * 60 + parsedTime.minute) - (startTime.hour * 60 + startTime.minute);
            return timeInMinutes / 5;
        };

        for (let num = 0; num < lessonTimes.length; num++) {

            const lessonTime = lessonTimes[num];
            const nextNum = num + 1;
            const nextLesson = nextNum >= lessonTimes.length ? undefined : lessonTimes[nextNum];

            const gridRowIndexStart = timeToRow(lessonTime);
            const gridRowIndexEnd = timeToRow(nextLesson);

            if (nextLesson == lessonTime) continue;
            if (num >= lessonTimes.length - 1) {
                this.startTimesNeededParsedToIndex[lessonTime] = countingRowNumber + 1;
                break;
            }

            countingRowNumber++;

            for (let i = 0; i < columnCount; i++) {
                if (i == 0) {
                    const cell = document.createElement("div");
                    cell.classList.add(school);
                    cell.classList.add("doNotRemove");
                    cell.style.gridArea = (gridRowIndexStart + 2) + " / " + (getColumnForSchool(school) + 1) + " / " + (gridRowIndexEnd + 2) + " / " + (getColumnForSchool(school) + 2);

                    if (this.isBreakString(lessonTime, nextLesson)) {
                        cell.classList.add("break");
                    }

                    const spanStart = document.createElement("span");
                    spanStart.classList.add("start");
                    spanStart.classList.add("doNotRemove");
                    spanStart.textContent = lessonTime;
                    spanStart.setAttribute("data-timestart", lessonTime);
                    cell.appendChild(spanStart);
                    this.startTimesNeededParsedToIndex[lessonTime] = countingRowNumber;

                    if (nextLesson) {
                        const spanEnd = document.createElement("span");
                        spanEnd.classList.add("end");
                        spanEnd.classList.add("doNotRemove");
                        spanEnd.textContent = nextLesson;
                        spanEnd.setAttribute("data-timeend", nextLesson);
                        cell.appendChild(spanEnd);
                    }



                    cell.classList.add("lessonTime");
                    this.tableElement?.appendChild(cell);
                }
            }
        }
        this.setCurrentDate(this.rowCount);
    }

    private isBreakString(start: string, end: string | undefined): boolean {
        const found = Object.values(BREAKS).flat().find(b => {
            return b.start == start && b.end == end && end;
        });
        return !!found;
    }

    public reloadFromId() {
        const element = document.getElementById(this.id) as HTMLDivElement;
        this.tableElement = (element ? element : undefined);

        this.headerRow = [...this.tableElement?.querySelectorAll(".header") as NodeListOf<HTMLDivElement>];
        this.currentDayDiv = this.tableElement?.querySelector(".currentDay") as HTMLDivElement;
        this.schoolTimesBackgroundDiv = this.tableElement?.querySelector(".schoolTimesBackground") as HTMLDivElement;


    }

    public clearLessons() {
        console.log("clearing");
        this.tableElement!.querySelectorAll(":not(.header):not(.currentDay):not(.doNotRemove):not(.schoolTimesBackground)").forEach(c => c.remove());
    }

    public preloadTimes() {
        let startTimesNeeded: {
            [key in School]?: string[];
        } = LESSON_TIMES_STRING;

        for (const key of Object.keys(startTimesNeeded) as School[]) {
            if (startTimesNeeded[key]) {
                startTimesNeeded[key].sort(this.sortTimeArray);
            }
        }

        this.clear();
        this.caluclateGrid(START_TIME, END_TIME);

        for (const k of Object.keys(startTimesNeeded)) {
            const key = k as School;
            if (!startTimesNeeded[key]) continue;
            this.calculateHeight(startTimesNeeded[key], key, START_TIME);
        }
    }

    public showSchedule(...schedules: UntisSchedule[]) {
        if (!this.tableElement) return;


        const pairedIfPossibleLessons: { [key: string]: LessonSlot[] } = {};
        const pairedIfPossibleLessonsCompiled: {
            lessonSlotExample?: LessonSlot;
            secondSlotExample?: LessonSlot;
            startTime: Time;
            endTime: Time;
            isMultiple: boolean;
        }[] = [];

        const moreThanOneLessonPerSlot: number[] = [];

        // for (const schedule of schedules) {
        //     for (const lessonSlot of schedule.getAllLessonSlots()) {
        //         lessonsPerSlot[lessonSlot.]
        //     }
        // }


        for (const schedule of schedules) {
            for (const lessonSlot of schedule.getAllLessonSlots()) {
                if (lessonSlot) {
                    const lesson = lessonSlot.lessons[0];
                    if (lesson) {
                        let key = (lesson.studentGroup ? lesson.studentGroup : (lessonSlot.lessons.length > 1 ? "" : lesson.lessonNumber)) + lesson.dayName! + lesson.cellState! + (lesson.multipleTeachers ? (lesson.cTeachers?.map(e => e.short).join(",")) : lesson.teacherShortName!) + lesson.roomShortName! + lesson.subjectShortName! + lesson.lessonCode!;
                        if (lessonSlot.lessons.length == 0) continue;
                        if (lessonSlot.lessons.length > 1) {
                            const id = lessonSlot.lessons.map(l => l.lessonNumber || l.id).reduce((a, b) => a + b);
                            moreThanOneLessonPerSlot.push(id);
                            key += id;
                        }
                        if (!pairedIfPossibleLessons[key]) {
                            pairedIfPossibleLessons[key] = [];
                        }
                        pairedIfPossibleLessons[key].push(lessonSlot);
                    }
                }
            }
        }

        const pairedIfPossibleLessonsResult = [];


        for (const lessonSlots of Object.values(pairedIfPossibleLessons)) {

            if (lessonSlots.length < 2) {
                pairedIfPossibleLessonsResult.push(lessonSlots);
            }

            const times = [];

            for (const lessonSlot of lessonSlots) {
                times.push(UntisManager.formatTime(lessonSlot.lessons[0].startTime));
                times.push(UntisManager.formatTime(lessonSlot.lessons[0].endTime));
            }

            times.sort(this.sortTimeArray);


            const splitMinutes: number[] = [];

            splitMinutes.push(8 * 60); //8:00 Uhr

            for (let i = 0; i < times.length; i++) {
                const current = times[i];
                const next = i > times.length ? undefined : times[i + 1];
                if (next) {
                    const parsedCurrentTime = UntisManager.parseTime(current);
                    const parsedNextTime = UntisManager.parseTime(next);
                    const currentM = parsedCurrentTime.hour * 60 + parsedCurrentTime.minute;
                    const nextM = parsedNextTime.hour * 60 + parsedNextTime.minute;
                    const time = nextM - currentM;
                    if (time > 45) {
                        splitMinutes.push(currentM);
                    }
                }
            }


            if (splitMinutes.length == 1) {
                pairedIfPossibleLessonsResult.push(lessonSlots);
            } else {
                const result: LessonSlot[][] = [];

                const lastTime = UntisManager.parseTime(times[times.length - 1]);
                const lastM = lastTime.hour * 60 + lastTime.minute;

                splitMinutes.push(lastM);

                for (let i = 0; i < splitMinutes.length - 1; i++) {
                    const startTimeMinutes = splitMinutes[i];
                    const endTimeMinutes = splitMinutes[i + 1];
                    const tempSlots = [];
                    for (const slot of lessonSlots) {
                        const startTime = slot.lessons[0].startTimeParsed;
                        const endTime = slot.lessons[0].endTimeParsed;
                        const startM = startTime.hour * 60 + startTime.minute;
                        const endM = endTime.hour * 60 + endTime.minute;

                        if (startM >= startTimeMinutes && endM <= endTimeMinutes) {
                            tempSlots.push(slot);
                        }
                    }
                    result.push(tempSlots);
                }

                pairedIfPossibleLessonsResult.push(...result)

            }



        }

        for (const lessonSlots of pairedIfPossibleLessonsResult) {
            const timesStart = [];
            const timesEnd = [];

            for (const lessonSlot of lessonSlots) {
                timesStart.push(lessonSlot.lessons[0].startTimeParsed);
                timesEnd.push(lessonSlot.lessons[0].endTimeParsed);
            }

            const startTimeArray = timesStart.sort((a, b) => {
                if (a.hour == b.hour) return a.minute - b.minute;
                return a.hour - b.hour;
            });

            const endTimeArray = timesEnd.sort((a, b) => {
                if (a.hour == b.hour) return a.minute - b.minute;
                return a.hour - b.hour;
            });

            const startTime = startTimeArray.length > 0 ? startTimeArray[0] : -1;
            const endTime = endTimeArray.length > 0 ? endTimeArray[endTimeArray.length - 1] : -1;

            if (startTime == -1 || endTime == -1) continue;

            if (lessonSlots.length == 1) {
                pairedIfPossibleLessonsCompiled.push({
                    endTime: endTime,
                    startTime: startTime,
                    lessonSlotExample: lessonSlots.length > 0 ? lessonSlots[0] : undefined,
                    isMultiple: lessonSlots[0].lessons.length > 1,
                    secondSlotExample: lessonSlots[0].lessons.length > 1 ? lessonSlots[1] : undefined
                });
            } else if (lessonSlots.length > 1) {
                const count = lessonSlots[0].lessons.length;
                if (lessonSlots.some(e => e.lessons.length != count)) {
                    pairedIfPossibleLessonsCompiled.push({
                        endTime: endTime,
                        startTime: startTime,
                        lessonSlotExample: lessonSlots.length > 0 ? lessonSlots[0] : undefined,
                        isMultiple: false
                    });
                } else {
                    pairedIfPossibleLessonsCompiled.push({
                        endTime: endTime,
                        startTime: startTime,
                        lessonSlotExample: lessonSlots[0],
                        isMultiple: lessonSlots[0].lessons.length > 1,
                        secondSlotExample: lessonSlots[0].lessons.length > 1 ? lessonSlots[1] : undefined
                    });
                }
            } else {
                pairedIfPossibleLessonsCompiled.push({
                    endTime: endTime,
                    startTime: startTime,
                    lessonSlotExample: lessonSlots.length > 0 ? lessonSlots[0] : undefined,
                    isMultiple: lessonSlots[0].lessons.length > 1,
                    secondSlotExample: lessonSlots[0].lessons.length > 1 ? lessonSlots[1] : undefined
                });
            }

        }

        for (const lessonSlotData of pairedIfPossibleLessonsCompiled) {
            if (lessonSlotData && lessonSlotData.lessonSlotExample) {
                const start = lessonSlotData.startTime;
                const end = lessonSlotData.endTime;
                const day = (lessonSlotData.lessonSlotExample as LessonSlot)?.lessons[0].dayName as DayName;
                const position = this.getGridPositionOfTime(start, end, day, START_TIME);
                if (position) {
                    const cell = this.insertCellInto(position.rowStart, position.column, position.rowSpan);
                    if (cell) {
                        const lesson = (lessonSlotData.lessonSlotExample as LessonSlot)?.lessons[0];
                        if (!lesson) continue;

                        const isExam = checkForExam(lesson);

                        this.insertLessonIntoDiv(cell, lesson, isExam);
                        this.addOpenAndInfoDialog(cell, lesson, isExam);
                        this.addHoverEffect(cell, lesson, lessonSlotData);

                        cell.classList.add("lesson");
                        this.tableElement.appendChild(cell);
                    }
                }
            }

            if (lessonSlotData.isMultiple) {
                const start = lessonSlotData.startTime;
                const end = lessonSlotData.endTime;
                const day = lessonSlotData.lessonSlotExample?.lessons[0].dayName as DayName;
                const position = this.getGridPositionOfTime(start, end, day, START_TIME);
                if (position) {
                    const cell = this.insertCellInto(position.rowStart, position.column, position.rowSpan);
                    if (cell) {
                        const lessons = lessonSlotData.lessonSlotExample?.lessons;
                        if (!lessons) continue;
                        cell.classList.add("moreLessons");

                        let isExam = false;
                        for (const lesson of lessons) {
                            if (checkForExam(lesson)) {
                                isExam = true;
                                break;
                            }
                        }


                        this.insertMoreLessonIntoDiv(cell, lessons, isExam);
                        this.addMoreLessonsOpenAndInfoDialog(cell, lessons);
                        this.addMultiHoverEffect(cell, lessons, lessonSlotData);

                        cell.classList.add("lesson");
                        this.tableElement.appendChild(cell);
                    }
                }
            }

        }


        for (const day of Object.keys(BREAKS)) {
            if (day == "others") continue;
            for (const br of BREAKS[day as DayName]) {
                const breakStartTime = UntisManager.parseTime(br.start);
                const breakEndTime = UntisManager.parseTime(br.end);

                const position = this.getGridPositionOfTime(breakStartTime, breakEndTime, day as DayName, START_TIME);
                if (position && position.rowSpan > 0 && position.column != -1 && position.rowEnd != -1 && position.rowStart != -1) {
                    const cell = this.insertCellInto(position.rowStart, position.column, position.rowSpan);
                    if (cell) {
                        cell.classList.add("break");

                        const getTimeDistance = (start: Time, end: Time): number => {
                            const startMinutes = start.hour * 60 + start.minute;
                            const endMinutes = end.hour * 60 + end.minute;
                            return endMinutes - startMinutes;
                        };

                        const spanBreak = document.createElement("span");
                        spanBreak.classList.add("breakLabel");
                        const timeDist = getTimeDistance(breakStartTime, breakEndTime);
                        spanBreak.textContent = (timeDist >= 60 ? Math.floor(timeDist / 60) + " h " : "") + timeDist % 60 + " min";

                        cell.appendChild(spanBreak);


                        this.addBreakHoverEffect(cell, br);

                        this.tableElement.appendChild(cell);
                    }
                }
            }
        }

    }

    private getGridPositionOfTime(startS: Time, endS: Time, day: DayName, offsetTime: Time): { rowStart: number, rowEnd: number, rowSpan: number, column: number } | undefined {
        if (!this.tableElement) return;

        let startPosition = -1;
        let endPosition = -1;

        let column = 0;
        switch (day) {
            case "monday": column = 1; break;
            case "tuesday": column = 2; break;
            case "wednesday": column = 3; break;
            case "thursday": column = 4; break;
            case "friday": column = 5; break;
        }

        const startTimeMinutes = startS.hour * 60 + startS.minute;
        const endTimeMinutes = endS.hour * 60 + endS.minute;

        const offsetMinutes = offsetTime.hour * 60 + offsetTime.minute;

        startPosition = (startTimeMinutes - offsetMinutes) / 5;
        endPosition = (endTimeMinutes - offsetMinutes) / 5;

        startPosition += 2;
        endPosition += 2;

        if (startPosition != -1 && endPosition != -1) {
            return { rowStart: startPosition, rowEnd: endPosition, rowSpan: endPosition - startPosition, column: column + SCHOOL_COUNT }
        }
        return undefined;
    }

    private insertCellInto(row: number, column: number, span: number): HTMLDivElement | undefined {
        if (!this.tableElement) return;

        const cell = document.createElement("div");
        cell.style.gridArea = row + " / " + column + " / " + (row + span) + " / " + (column + 1);
        return cell;
    }


    private maxHeight = 100 - this.heightHeaderPercentage;
    private totalLessonMinutes = 510;

    private addMoreLessonsOpenAndInfoDialog(div: HTMLDivElement, lessons: CompiledLesson[]) {
        div.addEventListener("click", () => {

            const position = div.getBoundingClientRect();
            div.style.setProperty("--left", position.left - 10 + "px");
            div.style.setProperty("--top", position.top - 10 + "px");

            div.style.setProperty("--width", position.width + "px");
            div.style.setProperty("--height", position.height + "px");

            div.classList.add("popupAnimation");

            div.addEventListener("animationend", () => {
                div.style.display = "none";
                div.classList.remove("popupAnimation");

                this.openMultiInfoBox(lessons, () => {
                    div.classList.add("popupAnimationReverse");

                    div.addEventListener("animationend", () => {
                        div.classList.remove("popupAnimationReverse");
                    }, { once: true });
                    div.style.display = "grid";
                }, position.width, position.height);

            }, { once: true });

        });
    }

    private addOpenAndInfoDialog(div: HTMLDivElement, lesson: CompiledLesson, isExam: boolean) {

        div.addEventListener("click", () => {

            const position = div.getBoundingClientRect();
            div.style.setProperty("--left", position.left - 10 + "px");
            div.style.setProperty("--top", position.top - 10 + "px");

            div.style.setProperty("--width", position.width + "px");
            div.style.setProperty("--height", position.height + "px");

            div.classList.add("popupAnimation");

            div.addEventListener("animationend", () => {
                div.style.display = "none";
                div.classList.remove("popupAnimation");

                this.openInfoBox(div.getAttribute("data-status")!, lesson, isExam, () => {
                    div.classList.add("popupAnimationReverse");

                    div.addEventListener("animationend", () => {
                        div.classList.remove("popupAnimationReverse");
                    }, { once: true });
                    div.style.display = "grid";
                }, position.width, position.height);

            }, { once: true });

        });

    }

    private addBreakHoverEffect(div: HTMLDivElement, br: ScheduleBreak) {
        const parsedStartBreak = this.parseLessonTime(br.start);
        const parsedEndBreak = this.parseLessonTime(br.end);

        const startMinutes = parsedStartBreak.hour * 60 + parsedStartBreak.minute;
        const endMinutes = parsedEndBreak.hour * 60 + parsedEndBreak.minute;

        this.addLessonHoverEffect(div, startMinutes, endMinutes, br.school);
    }

    private addLessonHoverEffect(div: HTMLDivElement, startTimeMinutes: number, endTimeMinutes: number, school?: School) {

        const timeElementsToHighlight: HTMLDivElement[] = [];
        const tableElementCopy = this.tableElement;

        for (const time of this.tableElement!.querySelectorAll(`.lessonTime${(school ? ("." + school) : (""))}`)) {
            const startTime = time.querySelector("span.start")?.getAttribute("data-timestart");
            const endTime = time.querySelector("span.end")?.getAttribute("data-timeend");
            const parsedStart = this.parseLessonTime(startTime!);
            const parsedEnd = this.parseLessonTime(endTime!);
            const parsedStartMinutes = parsedStart.hour * 60 + parsedStart.minute;
            const parsedEndMinutes = parsedEnd.hour * 60 + parsedEnd.minute;

            if (parsedStartMinutes >= startTimeMinutes && parsedEndMinutes <= endTimeMinutes) {
                timeElementsToHighlight.push(time as HTMLDivElement);
            }

        }

        div.addEventListener("mouseenter", () => {
            tableElementCopy?.querySelectorAll(".lessonTime").forEach(e => e.classList.remove("hovered"));
            timeElementsToHighlight.forEach(e => e.classList.add("hovered"));
        });

        div.addEventListener("mouseleave", () => {
            tableElementCopy?.querySelectorAll(".lessonTime").forEach(e => e.classList.remove("hovered"));
        });
    }


    private addMultiHoverEffect(div: HTMLDivElement, lessons: CompiledLesson[], lessonData: {
        lessonSlotExample?: LessonSlot;
        secondSlotExample?: LessonSlot;
        startTime: Time;
        endTime: Time;
    }) {
        const school = lessons[0].school;

        const startTimeParsed = lessonData.startTime;
        const endTimeParsed = lessonData.endTime;
        const startTimeMinutes = startTimeParsed.hour * 60 + startTimeParsed.minute;
        const endTimeMinutes = endTimeParsed.hour * 60 + endTimeParsed.minute;
        this.addLessonHoverEffect(div, startTimeMinutes, endTimeMinutes, school);
    }

    private addHoverEffect(div: HTMLDivElement, lesson: CompiledLesson, lessonData: {
        lessonSlotExample?: LessonSlot;
        secondSlotExample?: LessonSlot;
        startTime: Time;
        endTime: Time;
    }) {
        const school = lesson.school;

        const startTimeParsed = lessonData.startTime;
        const endTimeParsed = lessonData.endTime;
        const startTimeMinutes = startTimeParsed.hour * 60 + startTimeParsed.minute;
        const endTimeMinutes = endTimeParsed.hour * 60 + endTimeParsed.minute;
        this.addLessonHoverEffect(div, startTimeMinutes, endTimeMinutes, school);
    }


    private openMultiInfoBox(lessons: CompiledLesson[], callback: (() => void), width: number, height: number) {
        const popupInformation = document.getElementById("popupInformation") as HTMLDivElement;
        const insidePopInfo = document.getElementById("insidePopInfo");


        const div = document.querySelector("#popupInformation .moreLessonsDiv");
        if (!div) return;
        div.innerHTML = "";

        popupInformation.setAttribute("data-status", "moreLessons");
        popupInformation.classList.add("visible");

        popupInformation.classList.remove("exam");
        insidePopInfo?.classList.remove("exam");

        const tabsDiv = document.createElement("div");
        tabsDiv.classList.add("tabs");

        tabsDiv.style.setProperty("--tabCount", lessons.length + "");


        const divContent = document.createElement("div");
        divContent.classList.add("content");

        const teacherShortNameLabel = document.createElement("span");
        const roomLabel = document.createElement("span");
        const subjectLabel = document.createElement("span");
        const infoTextLabel = document.createElement("span");
        const roomFullNameLabel = document.createElement("span");
        const teacherFullNameLabel = document.createElement("span");
        const teacherSubjectsLabel = document.createElement("span");

        teacherShortNameLabel.classList.add("key");
        roomLabel.classList.add("key");
        subjectLabel.classList.add("key");
        infoTextLabel.classList.add("key");
        roomFullNameLabel.classList.add("key");
        teacherFullNameLabel.classList.add("key");
        teacherSubjectsLabel.classList.add("key");

        teacherShortNameLabel.classList.add("teacherShortNameKeyContent");
        roomLabel.classList.add("roomKeyContent");
        subjectLabel.classList.add("subjectKeyContent");
        infoTextLabel.classList.add("infoTextKeyContent");
        roomFullNameLabel.classList.add("roomFullNameKeyContent");
        teacherFullNameLabel.classList.add("teacherFullNameKeyContent");
        teacherSubjectsLabel.classList.add("subjectsKeyContent");

        teacherShortNameLabel.innerText = "Abbreviation";
        roomLabel.innerText = "Room";
        subjectLabel.innerText = "Subject";
        infoTextLabel.innerText = "Info";
        roomFullNameLabel.innerText = "Full Room Name";
        teacherFullNameLabel.innerText = "Full Teacher Name";
        teacherSubjectsLabel.innerText = "Subjects";

        const teacherShortNameSpan = document.createElement("span");
        const roomSpan = document.createElement("span");
        const subjectSpan = document.createElement("span");
        const infoTextSpan = document.createElement("span");
        const roomFullNameSpan = document.createElement("span");
        const teacherFullNameSpan = document.createElement("span");
        const teacherSubjectsDiv = document.createElement("div");
        const teacherSubjectList = document.createElement("ul");

        teacherShortNameSpan.classList.add("teacherShortNameContent");
        roomSpan.classList.add("roomContent");
        subjectSpan.classList.add("subjectContent");
        infoTextSpan.classList.add("infoTextContent");
        roomFullNameSpan.classList.add("roomFullNameContent");
        teacherFullNameSpan.classList.add("teacherFullNameContent");
        teacherSubjectsDiv.classList.add("teacherSubjectsContent");
        teacherSubjectList.classList.add("teacherSubjectListContent");

        const teacherShortNameMultiple = document.createElement("button");
        const teacherFullNameMultiple = document.createElement("button");
        const teacherSubjectsMultiple = document.createElement("button");

        teacherShortNameMultiple.classList.add("teacherShortNameMultiple");
        teacherFullNameMultiple.classList.add("teacherFullNameMultiple");
        teacherSubjectsMultiple.classList.add("teacherSubjectsMultiple");

        teacherShortNameMultiple.onclick = this.openTeacherView;
        teacherFullNameMultiple.onclick = this.openTeacherView;
        teacherSubjectsMultiple.onclick = this.openTeacherView;

        const loadLesson = (lesson: CompiledLesson) => {
            if (lesson.multipleTeachers) {
                // teacherShortNameSpan.innerHTML = lesson.cTeachers ? lesson.cTeachers.map(t => t.short).join(", ") : (lesson.teacherShortName ? lesson.teacherShortName : "?");
                // teacherFullNameSpan.innerHTML = (lesson.cTeachers ? lesson.cTeachers.length : "1") + " teachers";
                insidePopInfo?.classList.add("multipleTeachers");

                const teacherShortNameMultiple = insidePopInfo?.querySelector(".content .teacherShortNameMultiple");
                const teacherFullNameMultiple = insidePopInfo?.querySelector(".content .teacherFullNameMultiple");
                const teacherSubjectsMultiple = insidePopInfo?.querySelector(".content .teacherSubjectsMultiple");

                if (teacherShortNameMultiple) {
                    teacherShortNameMultiple.innerHTML = "... " + (lesson.cTeachers ? lesson.cTeachers.length : "?") + " teachers";
                }
                if (teacherFullNameMultiple) {
                    teacherFullNameMultiple.innerHTML = "... " + (lesson.cTeachers ? lesson.cTeachers.length : "?") + " teachers";
                }
                if (teacherSubjectsMultiple) {
                    teacherSubjectsMultiple.innerHTML = "... " + (lesson.cTeachers ? lesson.cTeachers.length : "?") + " teachers";
                }
            } else {
                teacherShortNameSpan.innerHTML = lesson.teacherShortName ? lesson.teacherShortName : "?";
                teacherFullNameSpan.innerHTML = lesson.teacherFullName ? lesson.teacherFullName : "?";
                insidePopInfo?.classList.remove("multipleTeachers");
            }
            roomSpan.innerHTML = lesson.roomShortName ? lesson.roomShortName : "?";
            subjectSpan.innerHTML = lesson.subjectFullName ? lesson.subjectFullName : "?";
            roomFullNameSpan.innerHTML = lesson.roomFullName ? lesson.roomFullName : "?";

            if (lesson.hasInfo || lesson.hasPeriodText || lesson.is?.substitution) {

                if (lesson.is?.substitution) {
                    infoTextSpan.innerHTML = lesson.substText
                } else if (lesson.hasInfo) {
                    infoTextSpan.innerHTML = lesson.lessonText ? lesson.lessonText : lesson.substText;
                } else if (lesson.hasPeriodText) {
                    infoTextSpan.innerHTML = (lesson.periodText ? lesson.periodText : (lesson.periodInfo ? lesson.periodInfo : lesson.substText));
                }
                infoTextSpan.classList.remove("unknown");
            } else {
                infoTextSpan.innerHTML = "?";
                infoTextSpan.classList.add("unknown");
            }
            const list = teacherSubjectList as HTMLUListElement;

            list.innerHTML = "";

            if (!lesson.multipleTeachers) {
                if (lesson.teacher) {
                    for (const subject of lesson.teacher!.subjects) {
                        const item = document.createElement("li");
                        item.innerHTML = subject;
                        list.appendChild(item);
                    }
                } else {
                    const item = document.createElement("li");
                    item.innerHTML = "?";
                    list.appendChild(item);
                }
            }
        };

        let tabIndex = 0;
        for (const lesson of lessons) {
            const tab = document.createElement("div");
            tab.classList.add("tab");

            if (checkForExam(lesson)) {
                tab.classList.add("exam");
            } else {
                tab.classList.remove("exam");
            }

            tab.innerText = lesson.subjectShortName ? lesson.subjectShortName : (lesson.subjectFullName ? lesson.subjectFullName : (lesson.teacherShortName ? lesson.teacherShortName : (lesson.teacherFullName ? lesson.teacherFullName : (lesson.roomShortName ? lesson.roomShortName : "?"))));
            tabsDiv.appendChild(tab);

            tab.addEventListener("click", () => {
                tabsDiv.querySelectorAll(".selected").forEach(e => e.classList.remove("selected"));
                tab.classList.add("selected");
                loadLesson(lesson);
                HTMLTableManager.CURRENT_LESSON_OPEN = lesson;
            });



            let status = "regular";

            if (lesson.teacherStatus == "ABSENT") {
                status = "teacherAbsent";
            }

            if (lesson.cellState == "ROOMSUBSTITUTION") {
                status = "roomSubstitution";
            }

            if (lesson.cellState == "CANCEL") {
                if (lesson.cellState == "CANCEL") {
                    status = "cancelled";
                }
            }

            if (lesson.lessonCode == "UNTIS_ADDITIONAL" || lesson.cellState == "ADDITIONAL" || lesson.cellState == "EVENT") {
                status = "additional";
            }

            tab.setAttribute("data-status", status);

            if (tabIndex == 1) {
                tab.click();
                tabIndex++;
            } else if (tabIndex < 1) {
                tabIndex++;
            }

        }

        divContent.appendChild(teacherShortNameSpan);
        divContent.appendChild(roomSpan);
        divContent.appendChild(subjectSpan);
        divContent.appendChild(infoTextSpan);
        divContent.appendChild(roomFullNameSpan);
        divContent.appendChild(teacherFullNameSpan);

        divContent.appendChild(teacherShortNameLabel);
        divContent.appendChild(roomLabel);
        divContent.appendChild(subjectLabel);
        divContent.appendChild(infoTextLabel);
        divContent.appendChild(roomFullNameLabel);
        divContent.appendChild(teacherFullNameLabel);
        divContent.appendChild(teacherSubjectsLabel);

        divContent.appendChild(teacherShortNameMultiple);
        divContent.appendChild(teacherFullNameMultiple);
        divContent.appendChild(teacherSubjectsMultiple);

        teacherSubjectsDiv.appendChild(teacherSubjectList);
        divContent.appendChild(teacherSubjectsDiv);

        div.appendChild(tabsDiv);
        div.appendChild(divContent);



        insidePopInfo?.style.setProperty("--width", width + "px");
        insidePopInfo?.style.setProperty("--height", height + "px");

        const clicked = (e: PointerEvent) => {

            const triggered = () => {
                HTMLTableManager.CURRENT_LESSON_OPEN = undefined;
                popupInformation.classList.remove("visible");
                callback();
                popupInformation.removeEventListener("click", clicked);
            };

            if (!e.target) {
                triggered();
                return;
            }
            if (insidePopInfo?.contains(e.target as Node)) {
                if (e.target == insidePopInfo) triggered();
                return;
            }
            triggered();

        };

        popupInformation.addEventListener("click", clicked);

    }


    private openInfoBox(status: string, lesson: CompiledLesson, isExam: boolean, callback: (() => void), width: number, height: number) {
        const popupInformation = document.getElementById("popupInformation") as HTMLDivElement;
        const insidePopInfo = document.getElementById("insidePopInfo");
        popupInformation.classList.add("visible");
        popupInformation.setAttribute("data-status", status);
        HTMLTableManager.CURRENT_LESSON_OPEN = lesson;

        if (lesson.multipleTeachers) {
            // insidePopInfo!.querySelector(".teacherShortName")!.innerHTML = lesson.cTeachers ? lesson.cTeachers.map(t => t.short).join(", ") : (lesson.teacherShortName ? lesson.teacherShortName : "?");
            // insidePopInfo!.querySelector(".teacherFullName")!.innerHTML = "Multiple Teachers";
            insidePopInfo?.classList.add("multipleTeachers");

            const teacherShortNameMultiple = insidePopInfo?.querySelector(".teacherShortNameMultiple");
            const teacherFullNameMultiple = insidePopInfo?.querySelector(".teacherFullNameMultiple");
            const teacherSubjectsMultiple = insidePopInfo?.querySelector(".teacherSubjectsMultiple");

            if (teacherShortNameMultiple) {
                teacherShortNameMultiple.innerHTML = "... " + (lesson.cTeachers ? lesson.cTeachers.length : "?") + " teachers";
            }
            if (teacherFullNameMultiple) {
                teacherFullNameMultiple.innerHTML = "... " + (lesson.cTeachers ? lesson.cTeachers.length : "?") + " teachers";
            }
            if (teacherSubjectsMultiple) {
                teacherSubjectsMultiple.innerHTML = "... " + (lesson.cTeachers ? lesson.cTeachers.length : "?") + " teachers";
            }
        } else {
            insidePopInfo!.querySelector(".teacherShortName")!.innerHTML = lesson.teacherShortName ? lesson.teacherShortName : "?";
            insidePopInfo!.querySelector(".teacherFullName")!.innerHTML = lesson.teacherFullName ? lesson.teacherFullName : "?";
            insidePopInfo?.classList.remove("multipleTeachers");
        }

        insidePopInfo!.querySelector(".room")!.innerHTML = lesson.roomShortName ? lesson.roomShortName : "?";
        insidePopInfo!.querySelector(".subject")!.innerHTML = lesson.subjectFullName ? lesson.subjectFullName : "?";
        insidePopInfo!.querySelector(".roomFullName")!.innerHTML = lesson.roomFullName ? lesson.roomFullName : "?";

        if (isExam) {
            insidePopInfo?.classList.add("exam");
        } else {
            insidePopInfo?.classList.remove("exam");
        }

        if (lesson.hasInfo || lesson.hasPeriodText || lesson.is?.substitution) {

            if (lesson.is?.substitution) {
                insidePopInfo!.querySelector(".infoText")!.innerHTML = lesson.substText
            } else if (lesson.hasInfo) {
                insidePopInfo!.querySelector(".infoText")!.innerHTML = lesson.lessonText ? lesson.lessonText : lesson.substText;
            } else if (lesson.hasPeriodText) {
                insidePopInfo!.querySelector(".infoText")!.innerHTML = (lesson.periodText ? lesson.periodText : (lesson.periodInfo ? lesson.periodInfo : lesson.substText));
            }
            insidePopInfo!.querySelector(".infoText")!.classList.remove("unknown");

        } else {
            insidePopInfo!.querySelector(".infoText")!.innerHTML = "?";
            insidePopInfo!.querySelector(".infoText")!.classList.add("unknown");
        }



        const list = insidePopInfo!.querySelector(".teacherSubjectList") as HTMLUListElement;

        list.innerHTML = "";

        console.log(lesson);
        if (!lesson.multipleTeachers) {
            if (lesson.teacher) {
                for (const subject of lesson.teacher!.subjects) {
                    const item = document.createElement("li");
                    item.innerHTML = subject;
                    list.appendChild(item);
                }
            } else {
                const item = document.createElement("li");
                item.innerHTML = "?";
                list.appendChild(item);
            }
        }


        insidePopInfo?.style.setProperty("--width", width + "px");
        insidePopInfo?.style.setProperty("--height", height + "px");

        const clicked = (ev: PointerEvent) => {

            const trigger = () => {
                HTMLTableManager.CURRENT_LESSON_OPEN = undefined;
                popupInformation.classList.remove("visible");
                callback();
                popupInformation.removeEventListener("click", clicked);
            };

            if (!ev.target) {
                trigger();
            }

            if (insidePopInfo?.contains(ev.target as Node)) {
                if (ev.target == insidePopInfo) trigger();
                return;
            }
            trigger();


        };

        popupInformation.addEventListener("click", clicked);

    }

    private insertMoreLessonIntoDiv(div: HTMLDivElement, lessons: CompiledLesson[], isExam: boolean) {
        const spanMoreLessons = document.createElement("span");
        spanMoreLessons.classList.add("moreLessonsSpan");
        if (isExam) {
            spanMoreLessons.classList.add("exam");
        } else {
            spanMoreLessons.classList.remove("exam");
        }
        spanMoreLessons.innerText = "+";

        const secondLesson = lessons.length > 1 ? lessons[1] : undefined;
        if (secondLesson) {
            if (secondLesson.teacherStatus == "SUBSTITUTED") {
                div.classList.add("teacherSubstitution");
            } else if (secondLesson.teacherStatus == "ABSENT" || secondLesson.cellState == "CANCEL") {
                if (secondLesson.teacherStatus == "ABSENT") {
                    div.classList.add("teacherAbsent");
                }
            }

            if (secondLesson.cellState == "ROOMSUBSTITUTION" || secondLesson.teacherStatus == "ABSENT" || secondLesson.cellState == "CANCEL") {
                if (secondLesson.cellState == "ROOMSUBSTITUTION") {
                    div.classList.add("roomSubstitution");
                }
            }

            if (secondLesson.cellState == "CANCEL" || secondLesson.teacherStatus == "ABSENT") {
                if (secondLesson.cellState == "CANCEL") {
                    div.classList.add("cancelled");
                }
            }

            if (secondLesson.lessonCode == "UNTIS_ADDITIONAL" || secondLesson.cellState == "ADDITIONAL" || secondLesson.cellState == "EVENT") {
                div.classList.add("additional");
            }
        }

        div.appendChild(spanMoreLessons);
    }

    private insertLessonIntoDiv(div: HTMLDivElement, lesson: CompiledLesson, isExam: boolean) {
        const spanLessonSubject = document.createElement("span");
        const spanLessonRoom = document.createElement("span");
        const spanLessonTeacherShort = document.createElement("span");
        const spanLessonSubstituteText = document.createElement("span");
        const spanLessonSubjectShort = document.createElement("span");
        let status = "regular";

        if (lesson.teacherStatus == undefined || lesson.teacherStatus == "REGULAR") {
            if (lesson.multipleTeachers) {
                spanLessonTeacherShort.innerHTML = lesson.cTeachers ? (lesson.cTeachers.length > 2 ? lesson.cTeachers.length + " teachers" : lesson.cTeachers.map(t => t.short).join(", ")) : (lesson.teacherShortName ? lesson.teacherShortName : (lesson.teacherFullName ? lesson.teacherFullName : "?"));
            } else {
                spanLessonTeacherShort.innerHTML = lesson.teacherShortName ? lesson.teacherShortName : (lesson.teacherFullName ? lesson.teacherFullName : "?");
            }
        } else if (lesson.teacherStatus == "SUBSTITUTED") {
            spanLessonTeacherShort.innerHTML = "<del>" + (lesson.originalTeacher?.short ? lesson.originalTeacher.short : (lesson.originalTeacher?.name ? lesson.originalTeacher.name : "?")) + "</del>" +
                ((lesson.teacherShortName ? lesson.teacherShortName : (lesson.teacherFullName ? lesson.teacherFullName : "?")));
            div.classList.add("teacherSubstitution");
            status = "teacherSubstitution";
        } else if (lesson.teacherStatus == "ABSENT" || lesson.cellState == "CANCEL") {
            if (lesson.multipleTeachers) {

                spanLessonTeacherShort.innerHTML = "<del>" + (lesson.cTeachers ? (lesson.cTeachers.length > 2 ? lesson.cTeachers.length + " teachers" : lesson.cTeachers.map(t => t.short).join(", ")) : (lesson.teacherShortName ? lesson.teacherShortName : (lesson.teacherFullName ? lesson.teacherFullName : "?"))) + "</del>";
            } else {
                spanLessonTeacherShort.innerHTML = "<del>" + (lesson.teacherShortName ? lesson.teacherShortName : (lesson.teacherFullName ? lesson.teacherFullName : "?")) + "</del>";
            }
            if (lesson.teacherStatus == "ABSENT") {
                div.classList.add("teacherAbsent");
                status = "teacherAbsent";
            }
        }

        if (lesson.cellState == "ROOMSUBSTITUTION" || lesson.teacherStatus == "ABSENT" || lesson.cellState == "CANCEL") {

            if (lesson.cellState == "ROOMSUBSTITUTION") {
                div.classList.add("roomSubstitution");
                status = "roomSubstitution";
                spanLessonRoom.innerHTML = "<del>" + (lesson.roomShortName ? lesson.roomShortName : (lesson.roomFullName ? lesson.roomFullName : "?")) + "</del>" +
                    (lesson.roomShortName ? lesson.roomShortName : (lesson.roomFullName ? lesson.roomFullName : "?"));
            } else {
                spanLessonRoom.innerHTML = "<del>" + (lesson.roomShortName ? lesson.roomShortName : (lesson.roomFullName ? lesson.roomFullName : "?")) + "</del>";
            }
        } else {
            spanLessonRoom.innerHTML = (lesson.roomShortName ? lesson.roomShortName : (lesson.roomFullName ? lesson.roomFullName : "?"));
        }

        if (lesson.cellState == "CANCEL" || lesson.teacherStatus == "ABSENT") {
            const subject = lesson.subjectFullName ? lesson.subjectFullName : (lesson.subjectShortName ? lesson.subjectShortName : "?");
            spanLessonSubject.innerHTML = "<del>" + subject + "</del>";
            if (lesson.cellState == "CANCEL") {
                div.classList.add("cancelled");
                status = "cancelled";
            }
            if (subject == "?") {
                spanLessonSubject.classList.add("unknown");
            }
        } else {
            const subject = lesson.subjectFullName ? lesson.subjectFullName : (lesson.subjectShortName ? lesson.subjectShortName : "?");
            spanLessonSubject.innerHTML = subject;
            if (subject == "?") {
                spanLessonSubject.classList.add("unknown");
            }
        }

        if (lesson.hasInfo || lesson.hasPeriodText || lesson.is?.substitution) {

            if (lesson.is?.substitution) {
                spanLessonSubstituteText.innerText = lesson.substText
            } else if (lesson.hasInfo) {
                spanLessonSubstituteText.innerText = lesson.lessonText ? lesson.lessonText : lesson.substText;
            } else if (lesson.hasPeriodText) {
                spanLessonSubstituteText.innerText = (lesson.periodText ? lesson.periodText : (lesson.periodInfo ? lesson.periodInfo : lesson.substText));
            }

        } else {
            spanLessonSubstituteText.classList.add("hidden");
            div.classList.add("infoTextHidden");
            if (spanLessonSubject.classList.contains("unknown")) {
                div.classList.remove("unknown");
                spanLessonSubject.innerText = "?";
            }
        }

        if (lesson.lessonCode == "UNTIS_ADDITIONAL" || lesson.cellState == "ADDITIONAL" || lesson.cellState == "EVENT") {
            div.classList.add("additional");
            status = "additional";
        }

        spanLessonSubjectShort.innerHTML = lesson.subjectShortName ? lesson.subjectShortName : (lesson.subjectFullName ? lesson.subjectFullName : "?");



        spanLessonSubjectShort.classList.add("subjectShort");
        spanLessonSubject.classList.add("subject");
        spanLessonRoom.classList.add("room");
        spanLessonTeacherShort.classList.add("teacher");
        spanLessonSubstituteText.classList.add("infoText");

        div.setAttribute("data-status", status);
        div.appendChild(spanLessonSubjectShort);
        div.appendChild(spanLessonSubject);
        div.appendChild(spanLessonRoom);
        div.appendChild(spanLessonTeacherShort);
        div.appendChild(spanLessonSubstituteText);

        if (isExam) {
            div.classList.add("exam");
        }

    }

    private openTeacherView() {
        if (!HTMLTableManager.CURRENT_LESSON_OPEN) return;
        const teacherViewer = document.querySelector("#teacherViewer") as HTMLDialogElement;
        const teacherViewerBody = document.querySelector("#teacherViewerTableBody") as HTMLTableElement;

        teacherViewerBody.childNodes.forEach(e => e.remove());

        if (teacherViewerBody && HTMLTableManager.CURRENT_LESSON_OPEN.cTeachers) {
            for (const teacher of HTMLTableManager.CURRENT_LESSON_OPEN.cTeachers) {
                const row = teacherViewerBody.insertRow();
                const shortName = row.insertCell();
                const firstName = row.insertCell();
                const surname = row.insertCell();
                const subjects = row.insertCell();

                shortName.innerHTML = teacher.short ? teacher.short : "?"
                surname.innerHTML = teacher.name.surname ? teacher.name.surname : "?";
                firstName.innerHTML = teacher.name.firstName ? teacher.name.firstName : "?";
                subjects.innerHTML = teacher.subjects ? teacher.subjects.join(", ") : "?";
            }
        }

        const tr = (e: PointerEvent) => {

            const close = () => {
                teacherViewer.close();
                teacherViewer.removeEventListener("click", tr);
            };

            if (teacherViewer.open == false) {
                close();
                return;
            }

            if (teacherViewer == null) {
                return;
            }

            if (e.target == teacherViewer) {
                close();
            }

            if (!teacherViewer.contains(e.target as Node)) {
                close();
            }
        };

        teacherViewer.addEventListener("click", tr);

        teacherViewer?.showModal();
    }


    private parseLessonTime(time: string): Time {
        const parts = time.split(":");
        const hour = parts[0];
        const minute = parts[1];
        return {
            hour: parseInt(hour),
            minute: parseInt(minute)
        }
    }

}

export type HeaderRow = HTMLDivElement;