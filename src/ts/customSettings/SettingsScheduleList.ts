import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat.js";
import { SettingsElement, type SettingsFunctionData } from "../settings/SettingsTitleElement";
import UntisManager from "../untis/UntisManager";
import { type DayName, type LessonRaw, type ScheduleBreak, type Time, type TypeScheduleRawDayTimes } from "../@types/Schedule";
import type { School } from "../@types/School";
import { UserManagement } from "../userManagement/UserManagement";
import Utils from "../Utils";
import type { UpdateDataSchedule } from "../@types/UserManagement";
import { HTMLTableManager } from "../htmlTable/HtmlTableManager";
import { AllLessonsManager } from "../untis/AllLessonsManager";
dayjs.extend(customParseFormat);

export type SettingsScheduleData = SettingsFunctionData & {
}

type MemoryRow = HTMLTableRowElement & {
    break: ScheduleBreak
};


export class SettingsScheduleList extends SettingsElement {
    private element: HTMLDivElement;
    private name: string = "";
    private disabled: boolean = false;
    private examRows: MemoryRow[] = [];
    private scheduleTable?: HTMLDivElement;
    private rowCount: number = 0;
    private untisAccessUUID: string;
    private school: string;

    public static INSTANCES: SettingsScheduleList[] = [];

    constructor(untisAccessUUID: string, school: string) {
        super();
        this.school = school;
        SettingsScheduleList.INSTANCES.push(this);
        this.untisAccessUUID = untisAccessUUID;
        this.element = document.createElement("div");
        this.element.classList.add("settings-schedule-table");
        this.initElements();
    }

    private initElements() {
        this.scheduleTable = document.createElement("div");
        this.scheduleTable.classList.add("settings-schedule");


        // e.preventDefault();
        // e.stopPropagation();

        // if (!navigator.onLine) {
        //     Utils.error("You Are offline and can't change settings");
        //     return;
        // }
        // this.addBreak((dayOfWeek, startTime, endTime, school) => {
        //     const newBreak = {
        //         start: startTime.hour.toString().padStart(2, "0") + ":" + startTime.minute.toString().padStart(2, "0"),
        //         end: endTime.hour.toString().padStart(2, "0") + ":" + endTime.minute.toString().padStart(2, "0"),
        //         school: school,
        //         uuid: Utils.uuidv4Exclude(UserManagement.ALL_DATA!.breaks[dayOfWeek].map(e => e.uuid))
        //     };
        //     UserManagement.ALL_DATA!.breaks[dayOfWeek].push(newBreak);

        //     const data: UpdateDataBreaks = {
        //         [dayOfWeek]: [newBreak]
        //     };

        //     UserManagement.updateBreaks("add", data);

        //     this.updateTable();
        // });
        let i = 0;
        for (const title of ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]) {
            const titleCell = document.createElement("div");
            titleCell.classList.add(title.toLowerCase());
            titleCell.classList.add("doNotRemove");
            titleCell.classList.add("header");
            titleCell.innerHTML = title;
            titleCell.style.gridArea = "1 / " + (i + 2) + " / 2 / " + (i + 3);
            this.scheduleTable.appendChild(titleCell);
            i++;
        }

        const widthOfAll = 100 - 10;
        this.scheduleTable.style.gridTemplateColumns = `10% calc(${widthOfAll}% / 5) calc(${widthOfAll}% / 5) calc(${widthOfAll}% / 5) calc(${widthOfAll}% / 5) calc(${widthOfAll}% / 5)`;
        this.scheduleTable.style.gridTemplateRows = `max(2.5%, 4vh)`;
        // Value Presets

        const tableWrapper = document.createElement("div");
        tableWrapper.classList.add("settings-schedule-wrapper");
        tableWrapper.appendChild(this.scheduleTable);

        this.updateTable();
        this.element.appendChild(tableWrapper);

    }

    private updateAllButtonsCallbacks: (() => void)[] = [];

    public updateTable() {
        this.examRows.forEach(e => e.remove());
        this.examRows = [];

        const minTimeMinutes = Object.values(UserManagement.ALL_DATA!.schoolTimes[this.untisAccessUUID]).flat().map(e => {
            const time = UntisManager.parseTime(UntisManager.formatTime(e.startTime));
            return time.hour * 60 + time.minute;
        });
        const maxTimeMinutes = Object.values(UserManagement.ALL_DATA!.schoolTimes[this.untisAccessUUID]).flat().map(e => {
            const time = UntisManager.parseTime(UntisManager.formatTime(e.endTime));
            return time.hour * 60 + time.minute;
        });

        const fromTimeMinutes = Math.min(...minTimeMinutes);
        const toTimeMinutes = Math.max(...maxTimeMinutes);

        const schoolStartTime: Time = {
            hour: Math.floor(fromTimeMinutes / 60),
            minute: fromTimeMinutes % 60
        };

        this.scheduleTable!.style.setProperty("--totalMinutes", (toTimeMinutes - fromTimeMinutes).toString());
        this.rowCount = (toTimeMinutes - fromTimeMinutes) / 5;
        this.scheduleTable!.style.gridTemplateRows = `max(2.5%, 4vh)`;
        this.scheduleTable!.style.gridTemplateRows += " repeat(" + this.rowCount + ", " + (100 / this.rowCount) + "%)";

        this.updateAllButtonsCallbacks = [];

        this.scheduleTable!.childNodes.forEach(e => {
            if (e instanceof HTMLElement) {
                if (e.classList.contains("doNotRemove")) return;
            }
            e.remove();
        });
        const timeSlotsOptions = Object.values(UserManagement.ALL_DATA!.schoolTimes[this.untisAccessUUID]).filter(e => e.length > 0);
        if (timeSlotsOptions.length > 0) {
            for (const lessonSlot of timeSlotsOptions[0]) {

                const lessonStartParsed = UntisManager.parseTime(UntisManager.formatTime(lessonSlot.startTime));
                const lessonEndParsed = UntisManager.parseTime(UntisManager.formatTime(lessonSlot.endTime));
                let lessonStart = lessonStartParsed.hour * 60 + lessonStartParsed.minute;
                let lessonEnd = lessonEndParsed.hour * 60 + lessonEndParsed.minute;

                const startTime: Time = {
                    hour: Math.floor(lessonStart / 60),
                    minute: lessonStart % 60
                };

                const endTime: Time = {
                    hour: Math.floor(lessonEnd / 60),
                    minute: lessonEnd % 60
                };

                const span = HTMLTableManager.getGridPositionOfTime(startTime, endTime, "monday", schoolStartTime);
                if (!span) continue;
                const nameE = this.insertCellInto(span.rowStart, 1, span.rowSpan);
                nameE.innerText = lessonSlot.name;
                nameE.classList.add("lesson-time-slot");
                this.scheduleTable?.appendChild(nameE);
            }
        }

        const elements: {
            [key in DayName]?: {
                [key in TypeScheduleRawDayTimes]?: HTMLElement;
            }
        } = {};

        for (const day of ["monday", "tuesday", "wednesday", "thursday", "friday"]) {
            let lessonIndex = 0;
            const startTimes = (UserManagement.ALL_DATA!.schoolTimes[this.untisAccessUUID] ?? {})[day as DayName];
            if (!startTimes) continue;
            for (let lessonSlot of startTimes) {
                if (lessonIndex > 100) {
                    Utils.error("You Created an Infinity Loop! Yay");
                    break;
                }
                const lessonStartParsed = UntisManager.parseTime(UntisManager.formatTime(lessonSlot.startTime));
                const lessonEndParsed = UntisManager.parseTime(UntisManager.formatTime(lessonSlot.endTime));

                let lessonStart = lessonStartParsed.hour * 60 + lessonStartParsed.minute;
                let lessonEnd = lessonEndParsed.hour * 60 + lessonEndParsed.minute;

                let lessonStartString = UntisManager.formatTime(lessonSlot.startTime);

                const startTime: Time = {
                    hour: Math.floor(lessonStart / 60),
                    minute: lessonStart % 60
                };
                const startTimeString = startTime.hour.toString().padStart(2, "0") + ":" + startTime.minute.toString().padStart(2, "0");


                const endTime: Time = {
                    hour: Math.floor(lessonEnd / 60),
                    minute: lessonEnd % 60
                };

                const span = HTMLTableManager.getGridPositionOfTime(startTime, endTime, day as DayName, schoolStartTime);
                if (!span) continue;
                const lessonDiv = this.insertCellInto(span.rowStart, span.column + 1, span.rowSpan);

                let hasLesson = false;
                let canBeSet = true;

                const update = () => {
                    lessonDiv.classList.remove("lessonLoaded");
                    lessonDiv.innerHTML = "";
                    const lessonFromSchedule: LessonRaw | undefined = UserManagement.ALL_DATA && UserManagement.ALL_DATA.schedule && UserManagement.ALL_DATA.schedule[day as DayName] ? UserManagement.ALL_DATA!.schedule[day as DayName][lessonStartString as TypeScheduleRawDayTimes] : undefined;
                    hasLesson = !!lessonFromSchedule;
                    if (!!lessonFromSchedule) {
                        if (lessonFromSchedule?.school != this.school) {
                            hasLesson = false;
                            canBeSet = false;
                        } else {
                            canBeSet = true;
                        }
                    }
                    if (lessonFromSchedule && lessonFromSchedule.school == this.school) {
                        const spanLessonName = document.createElement("span");
                        spanLessonName.innerText = lessonFromSchedule.sign;
                        lessonDiv.classList.add("lessonLoaded");
                        lessonDiv.setAttribute("data-startTime", startTimeString);
                        lessonDiv.setAttribute("data-endTime", endTime.hour.toString().padStart(2, "0") + ":" + endTime.minute.toString().padStart(2, "0"));
                        lessonDiv.appendChild(spanLessonName);
                    } else {
                        if (canBeSet) {
                            const addButton = document.createElement("button");
                            addButton.classList.add("addlessonButton");
                            addButton.innerHTML = "+";
                            lessonDiv.appendChild(addButton);
                        } else {
                            lessonDiv.classList.add("notUsableOverwrittenByOtherSchedule");
                        }
                    }
                };
                update();

                this.updateAllButtonsCallbacks.push(update);

                lessonDiv.addEventListener("click", (e) => {
                    if (!canBeSet) return;
                    if (hasLesson) {
                        const toRemove = UserManagement.ALL_DATA!.schedule[day as DayName][lessonStartString as TypeScheduleRawDayTimes];
                        if (!toRemove) return;
                        delete UserManagement.ALL_DATA!.schedule[day as DayName][lessonStartString as TypeScheduleRawDayTimes];
                        UserManagement.updateSchedule("remove", [toRemove.uuid]);
                        update();
                    } else {
                        const button = lessonDiv.querySelector(".addlessonButton");
                        if (!button) return;
                        if (e.target) {
                            if (button.contains(e.target as Node)) {
                                e.preventDefault();
                                e.stopPropagation();
                                this.addScheduleLesson(async (sign: string) => {
                                    const toAdd: LessonRaw = {
                                        sign: sign,
                                        school: this.school as School,
                                        uuid: Utils.uuidv4Exclude(Object.values(UserManagement.ALL_DATA!.schedule).filter(e => !!e).map(e => Object.values(e)).flat().filter(e => e !== undefined).map(e => e.uuid))
                                    };
                                    const allLessons = AllLessonsManager.getAllLessonDayTimesFromSign(sign);
                                    if (allLessons.length > 1) {
                                        for (const lesson of allLessons) {
                                            if (!lesson) continue;
                                            if (!lesson.day) continue;
                                            if (!lesson.time) continue;
                                            if (elements[lesson.day] && elements[lesson.day]![lesson.time as any]) {
                                                elements[lesson.day]![lesson.time as any]?.classList.add("newMultiLessonAddTarget");
                                            }
                                        }

                                        const removeAllClasses = () => document.querySelectorAll(".newMultiLessonAddTarget").forEach(e => e.classList && e.classList.remove("newMultiLessonAddTarget"));

                                        const does = await this.showConfirmDialog("Do you want to add all Lessons with this Tag?");
                                        if (does) {

                                            const allUpdates: UpdateDataSchedule = {};
                                            let overwrite = false;
                                            let askedOverwrite = false;

                                            for (const lesson of allLessons) {
                                                if (!lesson) continue;
                                                if (!lesson.day) continue;
                                                if (!lesson.time) continue;
                                                const d = {
                                                    school: this.school as School,
                                                    sign: sign,
                                                    uuid: Utils.uuidv4Exclude(Object.values(UserManagement.ALL_DATA!.schedule).filter(e => !!e).map(e => Object.values(e)).flat().filter(e => e !== undefined).map(e => e.uuid))
                                                };
                                                if (!!UserManagement.ALL_DATA!.schedule[lesson.day][lesson.time as TypeScheduleRawDayTimes]) {
                                                    if (!askedOverwrite) {
                                                        const o = await this.showConfirmDialog("Do you want to overrwrite the marked Lessons?");
                                                        askedOverwrite = true;
                                                        overwrite = o;
                                                    }
                                                    if (!overwrite) continue;
                                                }

                                                UserManagement.ALL_DATA!.schedule[lesson.day][lesson.time as TypeScheduleRawDayTimes] = d;
                                                if (!allUpdates[lesson.day]) allUpdates[lesson.day] = {};
                                                allUpdates[lesson.day]![lesson.time as TypeScheduleRawDayTimes] = d;
                                            }
                                            this.updateAllButtonsCallbacks.forEach(e => e());
                                            UserManagement.updateSchedule("add", allUpdates);
                                            removeAllClasses();
                                            return;
                                        }
                                        removeAllClasses();
                                    } else {
                                        UserManagement.ALL_DATA!.schedule[day as DayName][lessonStartString as TypeScheduleRawDayTimes] = toAdd;
                                    }

                                    update();
                                    UserManagement.updateSchedule("add", {
                                        [day as DayName]: {
                                            [startTimeString as TypeScheduleRawDayTimes]: toAdd
                                        }
                                    });
                                });
                            }
                        }
                    }
                });

                if (!elements[day as DayName]) elements[day as DayName] = {};
                elements[day as DayName]![lessonStartString as TypeScheduleRawDayTimes] = lessonDiv;

                this.scheduleTable?.appendChild(lessonDiv);

                lessonIndex++;
            }
        }

    }

    private async showConfirmDialog(textC: string): Promise<boolean> {
        return new Promise<boolean>((resolve) => {
            const dialog = document.createElement("div");
            dialog.classList.add("yesNoDialog");

            const hide = () => {
                dialog.classList.add("hide");
                dialog.addEventListener("animationend", () => {
                    document.body.removeChild(dialog);
                }, { once: true });
            };

            const text = document.createElement("span");
            text.innerHTML = textC;
            text.classList.add("text");

            const yes = document.createElement("button");
            yes.classList.add("yes");
            yes.addEventListener("click", () => {
                hide();
                setTimeout(() => resolve(true), 50);
            });
            yes.innerHTML = "Yes";

            const no = document.createElement("button");
            no.classList.add("no");
            no.addEventListener("click", () => {
                hide();
                setTimeout(() => resolve(false), 50);
            });
            no.innerHTML = "No";

            dialog.appendChild(text);
            dialog.appendChild(no);
            dialog.appendChild(yes);

            document.body.appendChild(dialog);

        });
    }


    private insertCellInto(row: number, column: number, span: number): HTMLDivElement {

        const maxRows = this.rowCount + 1; // Because of Header
        const maxRowsEnd = this.rowCount + 2; // Because of Header + 1 because its end
        if (row >= maxRows) row = maxRows;
        if ((row + span) >= maxRowsEnd + 2) span = maxRowsEnd - row;

        const cell = document.createElement("div");
        cell.style.gridArea = row + " / " + column + " / " + (row + span) + " / " + (column + 1);
        return cell;
    }

    private addScheduleLesson(callback: (sign: string) => void) {

        const addScheduleDialogWrapper = document.createElement("div");
        addScheduleDialogWrapper.id = "addScheduleDialogWrapper";
        addScheduleDialogWrapper.classList.add("dialogWrapper");

        const addScheduleDialog = document.createElement("div");
        addScheduleDialog.id = "addScheduleDialog";
        addScheduleDialog.classList.add("dialog");

        const title = document.createElement("h2");
        title.innerText = "Set Lesson";

        const signInput = document.createElement("input");
        signInput.type = "text";
        signInput.addEventListener("input", () => filter(signInput.value));

        const signSuggestion = document.createElement("ul");
        signSuggestion.classList.add("signSuggestion");

        AllLessonsManager.getAllStudentGroups(this.school as School).forEach(e => {
            const option = document.createElement("li");
            option.innerText = e;
            option.classList.add("option");
            option.addEventListener("click", () => {
                document.body.removeChild(addScheduleDialogWrapper);
                setTimeout(() => callback(e), 50);
            });
            signSuggestion.appendChild(option);
        });

        const filter = (searchString: string) => {
            signSuggestion.querySelectorAll(".option").forEach(e => {
                if (!(e instanceof HTMLLIElement)) return;
                const content = e.innerText;
                if (content.toLowerCase().includes(searchString.toLowerCase())) {
                    e.style.display = "flex";
                } else {
                    e.style.display = "none";
                }
            });
        };


        const addBtn = document.createElement("button");
        addBtn.classList.add("addBtn");
        addBtn.innerText = "Add";
        addBtn.onclick = () => {
            document.body.removeChild(addScheduleDialogWrapper);
            setTimeout(() => callback(signInput.value), 50);
            unregisterListeners();
        };

        const cancelbtn = document.createElement("button");
        cancelbtn.classList.add("cancelbtn");
        cancelbtn.innerText = "Cancel";
        cancelbtn.onclick = () => {
            document.body.removeChild(addScheduleDialogWrapper);
            unregisterListeners();
        };



        addScheduleDialog.appendChild(title);
        addScheduleDialog.appendChild(signInput);
        addScheduleDialog.appendChild(signSuggestion);
        addScheduleDialog.appendChild(cancelbtn);
        addScheduleDialog.appendChild(addBtn);

        addScheduleDialogWrapper.appendChild(addScheduleDialog);

        document.body.appendChild(addScheduleDialogWrapper);

        const unregisterListeners = Utils.addOnclickOutside(addScheduleDialog, () => {
            cancelbtn.click();
        });
    }

    getElement(): HTMLDivElement {
        return this.element;
    }

    setElement(element: HTMLDivElement): void {
        this.element = element;
    }

    setTitle(): void {
    }

    getTitle(): string {
        // return this.title;
        return "";
    }

    getName(): string {
        return this.name;
    }

    setName(name: string): void {
        this.name = name;
        this.element.setAttribute("data-name", name);
    }

    setDisabled(disabled: boolean): void {
        this.disabled = disabled;
        this.element.setAttribute("disabled", disabled ? "true" : "false");
    }

    isDisabled(): boolean {
        return this.disabled;
    }

    setVisible(visible: boolean): void {
        this.element.style.display = visible ? "" : "none";
    }

    isVisible(): boolean {
        return this.element.style.display != "none";
    }
}