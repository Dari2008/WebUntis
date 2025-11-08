import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat.js";
import { SettingsElement, type SettingsFunctionData } from "../settings/SettingsTitleElement";
import { Images } from "./Images";
import { UserManagement } from "../userManagement/UserManagement";
import Utils from "../Utils";
import type { IllDate, IllDayDefinition, ToExcuseLessons } from "../@types/UserManagement";
import { RangePlugin } from "@easepick/range-plugin";
import { AmpPlugin, DateTime, easepick, LockPlugin, TimePlugin } from "@easepick/bundle";
import { createInputWithLabel } from "./Utils";
import { HOST } from "../ScheduleDarius_old";
import b from "./excuseSystem/GrootmoorBoxes.json";
dayjs.extend(customParseFormat);

export type SettingsToolsExcuseSystemGrootmoorData = SettingsFunctionData & {
    illDates: IllDate[];
}

const boxes = b as Boxes;


export type BoxData = {
    top: number;
    left: number;
    width: number;
    height: number;
}

export type Boxes = {
    mainHeight: number;
    minHeight: number;
    endHeight: number;

    name: BoxData;
    tutor: BoxData;
    reason: BoxData;
    date: BoxData;
    table: Table;
}

export type Table = {
    rowHeight: number;
    topOffset: number;
    leftOffset: number;
    rowGap: number;
    colGap: number;
    cols: {
        fach: { width: number; }
        date: { width: number; }
        hours: { width: number; }
    },
    endLeft: number;
    endImageWidth: number;
    endImageHeight: number;
    endImageOffsetLeft: number;
    lines: {
        top: number;
        left: number;
        width: number;
    }[];
}

export class SettingsToolsExcuseSystemGrootmoor extends SettingsElement {
    private element: HTMLDivElement;
    private name: string = "";
    private disabled: boolean = false;
    private data: SettingsToolsExcuseSystemGrootmoorData;
    private illDaysTable: HTMLTableElement | undefined;
    private illDaysHead: HTMLTableSectionElement | undefined;
    private illDaysBody: HTMLTableSectionElement | undefined;

    constructor(data: SettingsToolsExcuseSystemGrootmoorData) {
        super();
        this.data = data;
        this.element = document.createElement("div");
        this.element.classList.add("settings-tools-excuse-system-element");
        this.initElements();
    }


    createToggleElement(checked?: boolean, onclick?: (checked: boolean) => void): HTMLLabelElement {

        const inputLabel = document.createElement("label");
        inputLabel.classList.add("switch");

        const toggleElement = document.createElement("input");
        toggleElement.type = "checkbox";
        toggleElement.checked = checked || false;
        toggleElement.onclick = () => onclick?.(toggleElement.checked);
        toggleElement.classList.add("inputElement");

        inputLabel.appendChild(toggleElement);

        let slider = document.createElement("div");
        slider.classList.add("slider");


        let circle = document.createElement("div");
        circle.classList.add("circle");

        circle.innerHTML = `
            <svg class="cross" xml:space="preserve" style="enable-background:new 0 0 512 512" viewBox="0 0 365.696 365.696" y="0" x="0" height="6" width="6" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" xmlns="http://www.w3.org/2000/svg">
                <g>
                    <path data-original="#000000" fill="currentColor" d="M243.188 182.86 356.32 69.726c12.5-12.5 12.5-32.766 0-45.247L341.238 9.398c-12.504-12.503-32.77-12.503-45.25 0L182.86 122.528 69.727 9.374c-12.5-12.5-32.766-12.5-45.247 0L9.375 24.457c-12.5 12.504-12.5 32.77 0 45.25l113.152 113.152L9.398 295.99c-12.503 12.503-12.503 32.769 0 45.25L24.48 356.32c12.5 12.5 32.766 12.5 45.247 0l113.132-113.132L295.99 356.32c12.503 12.5 32.769 12.5 45.25 0l15.081-15.082c12.5-12.504 12.5-32.77 0-45.25zm0 0"></path>
                </g>
            </svg>
            <svg class="checkmark" xml:space="preserve" style="enable-background:new 0 0 512 512" viewBox="0 0 24 24" y="0" x="0" height="10" width="10" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" xmlns="http://www.w3.org/2000/svg">
                <g>
                    <path class="" data-original="#000000" fill="currentColor" d="M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z"></path>
                </g>
            </svg>
        `;

        slider.appendChild(circle);
        inputLabel.appendChild(slider);

        return inputLabel;
    }

    private initElements() {

        // this.

        // this.element.appendChild(syntaxInputField.getCompletionElement());

        this.illDaysTable = document.createElement("table");
        this.illDaysHead = document.createElement("thead");
        this.illDaysBody = document.createElement("tbody");
        this.illDaysTable.appendChild(this.illDaysHead);
        this.illDaysTable.appendChild(this.illDaysBody);

        const r = this.illDaysHead.insertRow();
        for (const headerText of ["first", "Reason", "From", "To", "Lessons Missed", "print", "", "last"]) {
            const th = r.insertCell();
            th.innerText = headerText != "print" ? headerText : "";

            if (headerText == "") {

                th.innerHTML = "+";
                th.classList.add("illDayAddBtn");
                th.onclick = (e) => {
                    if (!navigator.onLine) {
                        Utils.error("You Are offline and can't change settings");
                        return;
                    }

                    e.preventDefault();
                    e.stopPropagation();
                    this.addIllDay(async (definitions: IllDayDefinition[], nameInput: string, teacherClass: string, reason: string) => {
                        if (definitions.length <= 0) return;
                        const toExcuse = await this.loadLessonsToExcuse(definitions);
                        if (!toExcuse) {
                            Utils.error("Could not load Lessons to excuse!");
                            return;
                        }
                        const ex = UserManagement.ALL_DATA!.illDates;
                        console.log(UserManagement.ALL_DATA!.illDates);
                        console.log(toExcuse);
                        const newIllDay: IllDate = {
                            lessonsToExcuse: toExcuse.lessonsToExcuse,
                            additionalLessonKeys: toExcuse.additionalLessonKeys,
                            illDaysDefinitions: definitions,
                            reason: reason,
                            name: nameInput,
                            teacherClass: teacherClass,
                            uuid: Utils.uuidv4Exclude(UserManagement.ALL_DATA!.illDates.map(e => e.uuid))
                        };
                        ex.push(newIllDay)

                        UserManagement.updateIllDays("add", [
                            newIllDay
                        ]);

                        this.updateTable();

                        Utils.success("Added Ill Date");

                    });
                };
            }
            if (headerText == "last" || headerText == "first") th.innerHTML = "";

        }


        this.updateTable();

        this.element.appendChild(this.illDaysTable);

    }

    private async loadLessonsToExcuse(definitions: IllDayDefinition[]): Promise<{ lessonsToExcuse: ToExcuseLessons; additionalLessonKeys: string[]; } | null> {
        const response = await (await fetch("http://" + HOST + "/untis/users/excuseSystem/grootmoor.php?noCache", {
            method: "POST",
            body: JSON.stringify({
                jwt: UserManagement.jwt,
                definitions: definitions
            })
        })).json();

        if (response.status == "success") return response;
        return null;
    }

    private addIllDay(callback: (definitions: IllDayDefinition[], nameInput: string, teacherClass: string, reason: string) => void) {
        let timeRanges: IllDayDefinition[] = [];
        type MemoryRowIllDay = HTMLTableRowElement & {
            range: IllDayDefinition;
        };
        let timeRangesRows: MemoryRowIllDay[] = [];
        let ignorClicksOutside = false;

        const addIllDayDialogWrapper = document.createElement("div");
        addIllDayDialogWrapper.classList.add("addIllDayDialogWrapper");

        const addIllDayDialog = document.createElement("div");
        addIllDayDialog.classList.add("addIllDayDialog");


        const titleE = document.createElement("h2");
        titleE.innerHTML = "Add Ill Day";
        addIllDayDialog.appendChild(titleE);

        const [nameWrapper, nameInput] = createInputWithLabel("", "Name / Stufe", /.*/g, false);
        nameInput.classList.add("labelInput");
        addIllDayDialog.appendChild(nameWrapper);

        const [teacherClassWrapper, teacherClass] = createInputWithLabel("", "Turtor/in", /.*/g, false);
        teacherClass.classList.add("labelInput");
        addIllDayDialog.appendChild(teacherClassWrapper);

        const [reasonWrapper, reasonInput] = createInputWithLabel("", "Reason", /.*/g, false);
        reasonInput.classList.add("labelInput");
        addIllDayDialog.appendChild(reasonWrapper);

        const dayDefinitionTable = document.createElement("table");
        const dayDefinitionTableHead = document.createElement("thead");
        const dayDefinitionTableBody = document.createElement("tbody");

        const r = dayDefinitionTableHead.insertRow();
        for (const head of ["From", "To", "Days", ""]) {
            const cell = r.insertCell();
            cell.innerHTML = head;
            if (head) cell.classList.add(head.toLocaleLowerCase());

            if (head == "") {
                cell.innerHTML = "+";
                cell.classList.add("illDayRangeAddBtn");
                cell.onclick = (e) => {
                    if (!navigator.onLine) {
                        Utils.error("You Are offline and can't change settings");
                        return;
                    }
                    e.preventDefault();
                    e.stopPropagation();
                    ignorClicksOutside = true;
                    this.addIllDateTimeSpan((from: string, to: string, wasIll: boolean) => {
                        timeRanges.push({
                            from: from,
                            to: to,
                            wasIll: wasIll
                        });
                        updateDefinitionTable();
                        ignorClicksOutside = false;
                    });
                };
            }
        }

        const updateDefinitionTable = () => {
            dayDefinitionTableBody.innerHTML = "";
            for (const timeRange of timeRanges) {
                const row = dayDefinitionTableBody.insertRow() as MemoryRowIllDay;
                const from = row.insertCell();
                const to = row.insertCell();
                const days = row.insertCell();
                const trash = row.insertCell();

                row.range = timeRange;

                from.innerHTML = timeRange.from;
                to.innerHTML = timeRange.to;
                days.innerHTML = Math.abs(dayjs(timeRange.from, "DD.MM.YYYY HH:mm").diff(dayjs(timeRange.to, "DD.MM.YYYY HH:mm"), "days")) + " days";

                const trashDiv = document.createElement("div");
                trashDiv.innerHTML = Images.TRASH;
                trashDiv.classList.add("trash");
                trashDiv.onclick = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const row = timeRangesRows.find((r) => r.range == timeRange) as HTMLTableRowElement;
                    timeRanges = timeRanges.filter(r => r != timeRange);
                    dayDefinitionTableBody.removeChild(row);
                };
                trash.appendChild(trashDiv);
                timeRangesRows.push(row);
            }
        };


        dayDefinitionTable.appendChild(dayDefinitionTableHead);
        dayDefinitionTable.appendChild(dayDefinitionTableBody);

        addIllDayDialog.appendChild(dayDefinitionTable);


        const buttonDiv = document.createElement("div");
        buttonDiv.classList.add("buttonWrapper");

        const addBtn = document.createElement("button");
        addBtn.innerHTML = "Add";
        addBtn.classList.add("add");

        addBtn.onclick = () => {
            document.removeEventListener("click", clickedOutside);
            callback(timeRanges, nameInput.value, teacherClass.value, reasonInput.value);
            document.body.removeChild(addIllDayDialogWrapper);
        };

        const cancelBtn = document.createElement("button");
        cancelBtn.innerHTML = "Cancel";
        cancelBtn.classList.add("cancel");

        cancelBtn.onclick = () => {
            document.removeEventListener("click", clickedOutside);
            document.body.removeChild(addIllDayDialogWrapper);
        };

        buttonDiv.appendChild(cancelBtn);
        buttonDiv.appendChild(addBtn);

        addIllDayDialog.appendChild(buttonDiv);

        addIllDayDialogWrapper.appendChild(addIllDayDialog);
        document.body.appendChild(addIllDayDialogWrapper);

        const clickedOutside = (e: PointerEvent) => {
            if (ignorClicksOutside) return;
            if (!e.target) return;
            if (addIllDayDialog.contains(e.target as Node)) return;
            document.body.removeChild(addIllDayDialogWrapper);
            document.removeEventListener("click", clickedOutside);
        };

        document.addEventListener("click", clickedOutside);

    }

    private addIllDateTimeSpan(callback: (from: string, to: string, wasIll: boolean) => void) {

        let wasIll = true;

        const addIllDayDialogWrapper = document.createElement("div");
        addIllDayDialogWrapper.classList.add("addIllDayDialogWrapper");

        const addIllDayDialog = document.createElement("div");
        addIllDayDialog.classList.add("addIllDayDialog");

        const titleE = document.createElement("h2");
        titleE.innerHTML = "Add Time Span";

        const checkBoxWasIllWrapper = document.createElement("div");
        checkBoxWasIllWrapper.classList.add("toggleWrapper");

        const checkBoxWasIll = this.createToggleElement(true, (checked: boolean) => {
            wasIll = checked;
        });

        const checkBoxWasIllLabel = document.createElement("span");
        checkBoxWasIllLabel.innerHTML = "Was Ill?";

        const dataPickerInput = document.createElement("input");
        dataPickerInput.classList.add("dataPickerInput");

        const dateRangePickerWrapper = document.createElement("div");
        dateRangePickerWrapper.classList.add("dateRangePicker");

        const divForParsedDate = document.createElement("div");
        divForParsedDate.classList.add("divForParsedDate");

        dateRangePickerWrapper.appendChild(divForParsedDate);
        dateRangePickerWrapper.appendChild(dataPickerInput);

        addIllDayDialog.appendChild(titleE);

        checkBoxWasIllWrapper.appendChild(checkBoxWasIllLabel);
        checkBoxWasIllWrapper.appendChild(checkBoxWasIll);

        addIllDayDialog.appendChild(checkBoxWasIllWrapper);
        addIllDayDialog.appendChild(dateRangePickerWrapper);
        addIllDayDialogWrapper.appendChild(addIllDayDialog);



        const startDate = new DateTime();
        const endDate = new DateTime();

        startDate.setHours(0, 0);
        endDate.setHours(23, 55);

        const picker = new easepick.create({
            element: dataPickerInput,
            plugins: [
                RangePlugin,
                TimePlugin,
                AmpPlugin,
                LockPlugin
            ],
            format: "DD.MM.YYYY HH:mm",
            AmpPlugin: {
                darkMode: true
            },
            RangePlugin: {
                delimiter: " - ",
                repick: true,
                startDate: startDate,
                endDate: endDate
            },
            LockPlugin: {
                filter(date, picked) {
                    picked = picked.filter(e => !isLockedDate(e));
                    if (Array.isArray(date)) {
                        return date.some((e) => isLockedDate(e));
                    } else {
                        return isLockedDate(date);
                    }
                }
            },
            scrollToDate: true,
            TimePlugin: {
                stepMinutes: 5,
                seconds: false,
                format12: false
            },
            autoApply: true,
            readonly: true,
            css: [
                'https://cdn.jsdelivr.net/npm/@easepick/core@1.2.1/dist/index.css',
                'https://cdn.jsdelivr.net/npm/@easepick/range-plugin@1.2.1/dist/index.css',
                'https://cdn.jsdelivr.net/npm/@easepick/time-plugin@1.2.1/dist/index.css',
                'https://cdn.jsdelivr.net/npm/@easepick/lock-plugin@1.2.1/dist/index.css',
            ],
        });

        function isLockedDate(date: DateTime): boolean {
            const day = date.getDay();
            if (day === 0 || day === 6) return true;
            return false;
        }

        let currentStartDate: Date | undefined;
        let currentEndDate: Date | undefined;

        const onUpdate = (startTime: Date, endTime: Date) => {
            if (startTime == endTime) {

            }
            const newValueString = `<span>${dayjs(startTime).format("DD.MM.YYYY HH:mm")}</span><span>${dayjs(endTime).format("DD.MM.YYYY HH:mm")}</span>`;
            divForParsedDate.innerHTML = newValueString;
            currentStartDate = startTime;
            currentEndDate = endTime;
        };
        // picker.show();
        picker.on('change', (e: CustomEvent) => {
            if (picker.getStartDate() == null || picker.getEndDate() == null) return;
            onUpdate(picker.getStartDate(), picker.getEndDate());
            // console.log(e);
        });
        picker.on('select', (e: CustomEvent) => {
            if (picker.getStartDate() == null || picker.getEndDate() == null) return;
            onUpdate(picker.getStartDate(), picker.getEndDate());
            // dateRangePickerWrapper.querySelector("")
            // console.log(e);
        });

        const buttonDiv = document.createElement("div");
        buttonDiv.classList.add("buttonWrapper");

        const addBtn = document.createElement("button");
        addBtn.innerHTML = "Add";
        addBtn.classList.add("add");

        addBtn.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!currentStartDate || !currentEndDate) {
                Utils.error("Start and End Date can't be unset");
                return;
            }
            callback(dayjs(currentStartDate).format("DD.MM.YYYY HH:mm"), dayjs(currentEndDate).format("DD.MM.YYYY HH:mm"), wasIll);
            document.body.removeChild(addIllDayDialogWrapper);
            document.removeEventListener("click", clickedOutside);
        };

        const cancelBtn = document.createElement("button");
        cancelBtn.innerHTML = "Cancel";
        cancelBtn.classList.add("cancel");

        cancelBtn.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            document.body.removeChild(addIllDayDialogWrapper);
            document.removeEventListener("click", clickedOutside);
        };

        buttonDiv.appendChild(cancelBtn);
        buttonDiv.appendChild(addBtn);

        addIllDayDialog.appendChild(buttonDiv);

        document.body.appendChild(addIllDayDialogWrapper);

        const clickedOutside = (e: PointerEvent) => {
            if (!e.target) return;
            if (addIllDayDialog.contains(e.target as Node)) return;
            document.body.removeChild(addIllDayDialogWrapper);
            document.removeEventListener("click", clickedOutside);
        };

        document.addEventListener("click", clickedOutside);

    }

    private updateTable() {

        if (this.illDaysBody) this.illDaysBody.innerHTML = "";

        const illDates = this.data.illDates;
        if (!this.illDaysBody) return;

        for (const illDate of illDates) {
            const row = this.illDaysBody.insertRow();
            const dropDownDivLeft = row.insertCell();
            const reasonCell = row.insertCell();
            const fromCell = row.insertCell();
            const toCell = row.insertCell();
            const daysIllCell = row.insertCell();
            const printCell = row.insertCell();
            const trash = row.insertCell();
            const dropDownDivRight = row.insertCell();

            dropDownDivLeft.classList.add("dropDownDivLeft");
            dropDownDivRight.classList.add("dropDownDivRight");

            reasonCell.innerHTML = illDate.reason;
            fromCell.innerHTML = dayjs(Math.min(...illDate.illDaysDefinitions.map(e => (dayjs(e.from, "DD.MM.YYYY HH:mm").valueOf())))).format("DD.MM.YYYY HH:mm");
            toCell.innerHTML = dayjs(Math.max(...illDate.illDaysDefinitions.map(e => (dayjs(e.to, "DD.MM.YYYY HH:mm").valueOf())))).format("DD.MM.YYYY HH:mm");

            daysIllCell.innerHTML = Object.values(illDate.lessonsToExcuse).reduce((a, b) => a + b, 0) + " Lessons";

            const printBtn = document.createElement("div");
            printBtn.classList.add("printBtn");
            printBtn.innerHTML = "Print";
            printBtn.onclick = () => {
                this.printIllDate(illDate);
            };
            printCell.appendChild(printBtn);

            const trashDiv = document.createElement("div");
            trashDiv.innerHTML = Images.TRASH;
            trashDiv.classList.add("trash");
            trashDiv.onclick = () => {
                UserManagement.ALL_DATA!.illDates = UserManagement.ALL_DATA!.illDates.filter(e => e.uuid != illDate.uuid);
                UserManagement.updateIllDays("remove", [illDate.uuid]);
                this.illDaysBody?.removeChild(row);
                Utils.success("Deleted Ill Date Successfully", "deletedIllDate");
            };
            trash.appendChild(trashDiv);

            this.createSubTableFor(illDate, row.childNodes.length, (newVal: number) => {
                daysIllCell.innerHTML = newVal + " Lessons";
            });

            row.addEventListener("click", (e) => {
                if (e.target && (trash.contains(e.target as Node) || printBtn.contains(e.target as Node))) {
                    return;
                }
                row.classList.toggle("open");
            });

        }


    }

    private addIllLesson(callback: (lessonName: string) => void) {
        const addIllDayDialogWrapper = document.createElement("div");
        addIllDayDialogWrapper.classList.add("addIllDayDialogWrapper");
        addIllDayDialogWrapper.classList.add("addIllLessonDialogWrapper");

        const addIllDayDialog = document.createElement("div");
        addIllDayDialog.classList.add("addIllDayDialog");

        const titleE = document.createElement("h2");
        titleE.innerHTML = "Add Lesson to Excuse";
        addIllDayDialog.appendChild(titleE);

        const [lessonNameWrapper, lessonNameInput] = createInputWithLabel("", "Lesson Name", /.*/g, false);
        lessonNameInput.classList.add("labelInput");
        addIllDayDialog.appendChild(lessonNameWrapper);

        const buttonDiv = document.createElement("div");
        buttonDiv.classList.add("buttonWrapper");

        const addBtn = document.createElement("button");
        addBtn.innerHTML = "Add";
        addBtn.classList.add("add");
        addBtn.onclick = () => {
            callback(lessonNameInput.value);
            document.body.removeChild(addIllDayDialogWrapper);
        };

        const cancelBtn = document.createElement("button");
        cancelBtn.innerHTML = "Cancel";
        cancelBtn.classList.add("cancel");
        cancelBtn.onclick = () => {
            document.body.removeChild(addIllDayDialogWrapper);
        };

        buttonDiv.appendChild(cancelBtn);
        buttonDiv.appendChild(addBtn);
        addIllDayDialog.appendChild(buttonDiv);
        addIllDayDialogWrapper.appendChild(addIllDayDialog);

        document.body.appendChild(addIllDayDialogWrapper);

        const clickedOutside = (e: PointerEvent) => {
            if (!e.target) return;
            if (addIllDayDialog.contains(e.target as Node)) return;
            document.body.removeChild(addIllDayDialogWrapper);
            document.removeEventListener("click", clickedOutside);
        };

        document.addEventListener("click", clickedOutside);
        console.log(addIllDayDialogWrapper);

    }

    private createSubTableFor(illDate: IllDate, colSpan: number, onLessonsMissedChanged: (newVal: number) => void) {
        const parentTableBody = this.illDaysBody;
        if (!parentTableBody) return;

        const addIllLesson = document.createElement("div");
        addIllLesson.classList.add("addIllLesson");
        addIllLesson.innerHTML = "+ Add Lesson";

        addIllLesson.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.addIllLesson((lessonName: string) => {
                console.log(lessonName);
                illDate.lessonsToExcuse[lessonName] = 1;
                UserManagement.updateIllDays("update", [illDate]);
                updateSubTable();
            });
        };

        const newTableRow = parentTableBody.insertRow();
        newTableRow.classList.add("lessonsToExcuse");
        const tableWrapper = newTableRow.insertCell();
        tableWrapper.colSpan = colSpan;

        const subTable = document.createElement("table");
        const subHead = document.createElement("thead");
        const subBody = document.createElement("tbody");

        let timoutId: number = -1;
        let values: IllDate[] = [];

        function updateSubTable() {
            subBody.innerHTML = "";
            for (const toExcuseKey of Object.keys(illDate.lessonsToExcuse).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }))) {
                const toExcuse = illDate.lessonsToExcuse[toExcuseKey];
                if (toExcuse === undefined || toExcuse === null) continue;
                const row = subBody.insertRow();

                const lessonName = row.insertCell();
                const lessonCountDecrCell = row.insertCell();
                const lessonCountCell = row.insertCell();
                const lessonCountIncrCell = row.insertCell();
                const trash = row.insertCell();

                lessonCountDecrCell.innerHTML = "-";
                lessonCountIncrCell.innerHTML = "+";

                lessonCountDecrCell.classList.add("lessonCountDecrCell");
                lessonCountIncrCell.classList.add("lessonCountIncrCell");

                trash.classList.add("trash");
                lessonName.classList.add("lessonName");
                lessonCountCell.classList.add("lessonCountCell");

                row.classList.add(illDate.additionalLessonKeys.includes(toExcuseKey) ? "additionalExcuse" : "regularExcuse");

                lessonName.innerText = toExcuseKey;
                lessonCountCell.innerText = toExcuse + " Lessons";


                const debounceIllDatesUpdate = (found: (values: ToExcuseLessons) => ToExcuseLessons) => {
                    if (!UserManagement.ALL_DATA) return;
                    UserManagement.ALL_DATA.illDates = UserManagement.ALL_DATA.illDates.map(e => {
                        if (e.uuid == illDate.uuid) {
                            e.lessonsToExcuse = found(e.lessonsToExcuse);
                        }
                        return e;
                    });
                    updateSubTable();

                    const foundVal = values.find((a) => a.uuid == illDate.uuid);
                    if (foundVal) values = values.filter(a => a.uuid != illDate.uuid);

                    values.push(illDate);
                    if (timoutId != -1) {
                        clearTimeout(timoutId);
                    }

                    timoutId = setTimeout(() => {
                        UserManagement.updateIllDays("update", values);
                        values = [];
                    }, 500);

                };

                const trashDiv = document.createElement("div");
                trashDiv.innerHTML = Images.TRASH;
                trashDiv.classList.add("trash");
                trashDiv.onclick = () => {
                    debounceIllDatesUpdate((e) => {
                        delete e[toExcuseKey];
                        return e;
                    });
                    delete illDate.lessonsToExcuse[toExcuseKey];
                    onLessonsMissedChanged(Object.values(illDate.lessonsToExcuse).reduce((a, b) => a + b, 0));
                };
                trash.appendChild(trashDiv);

                lessonCountDecrCell.onclick = () => {
                    debounceIllDatesUpdate((e) => {
                        e[toExcuseKey] = e[toExcuseKey] - 1;
                        return e;
                    });
                    onLessonsMissedChanged(Object.values(illDate.lessonsToExcuse).reduce((a, b) => a + b, 0));
                };

                lessonCountIncrCell.onclick = () => {
                    debounceIllDatesUpdate((e) => {
                        e[toExcuseKey] = e[toExcuseKey] + 1;
                        return e;
                    });
                    onLessonsMissedChanged(Object.values(illDate.lessonsToExcuse).reduce((a, b) => a + b, 0));
                };


            }
        }
        updateSubTable();

        subTable.appendChild(subHead);
        subTable.appendChild(subBody);

        tableWrapper.appendChild(addIllLesson);
        tableWrapper.appendChild(subTable);
    }

    getElement(): HTMLDivElement {
        console.log(this.element);
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


    async printIllDate(illDate: IllDate) {
        const canvas = document.createElement("canvas");
        canvas.classList.add("printCanvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const loadImage = async (url: string) => {
            return new Promise<HTMLImageElement>((resolve) => {
                const img = document.createElement("img");
                img.src = url;
                img.onload = () => resolve(img);
            });
        }
        (document.getElementById("loadingAnimation") as HTMLDialogElement)?.showModal();

        const img = await loadImage("./imgs/entschuldigungszettel/VorlageImage.png");
        const endImage = await loadImage("./imgs/entschuldigungszettel/VorlageImageTableEnd.png");

        canvas.width = img.width;
        canvas.height = img.height;

        const currentDate = new Date();
        const currentName = illDate.name ?? "";
        const currentReason = illDate.reason ?? "";
        const currentTutor = illDate.teacherClass ?? "";

        const dateFrom = dayjs(Math.min(...illDate.illDaysDefinitions.map(e => (dayjs(e.from, "DD.MM.YYYY HH:mm").valueOf())))).format("DD.MM.YYYY");
        const dateTo = dayjs(Math.max(...illDate.illDaysDefinitions.map(e => (dayjs(e.to, "DD.MM.YYYY HH:mm").valueOf())))).format("DD.MM.YYYY");
        const dateString = dateFrom + " - " + dateTo;


        document.body.appendChild(canvas);
        repaint();
        window.print();
        document.body.removeChild(canvas);
        (document.getElementById("loadingAnimation") as HTMLDialogElement)?.close();

        function repaint() {
            if (!ctx) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            if ((img.width != 0 && img.height != 0)) {
                if (canvas.width < img.width) {
                    canvas.width = img.width;
                }
                ctx.drawImage(img, 0, 0);
            }

            let index = 0;
            for (const lessonToExcuseKey of Object.keys(illDate.lessonsToExcuse)) {
                const lessonToExcuse = illDate.lessonsToExcuse[lessonToExcuseKey];
                if (!lessonToExcuse) continue;
                ctx.font = "200px Arial";

                const rowHeight = boxes.table.rowHeight;
                const rowGap = boxes.table.rowGap;
                const colGap = boxes.table.colGap;
                const leftOffset = boxes.table.leftOffset;
                const topOffset = boxes.table.topOffset;
                const fachWidth = boxes.table.cols.fach.width;
                const dateWidth = boxes.table.cols.date.width;
                const hoursWidth = boxes.table.cols.hours.width;


                const height = rowHeight + rowGap;

                const top = topOffset + (index + 1) * (height) - 10;
                const left = leftOffset;

                ctx.textAlign = "left";
                ctx.fillText(lessonToExcuseKey, left + 20, top);
                ctx.textAlign = "center";
                ctx.font = "125px Arial";
                ctx.fillText(dateString, left + fachWidth + colGap + dateWidth / 2, top);

                ctx.font = "200px Arial";
                ctx.textAlign = "center";
                ctx.fillText(lessonToExcuse + "", left + fachWidth + dateWidth + 2 * colGap + hoursWidth / 2, top);
                index++;
            }

            let lastTopPosForEndImage = 0;

            if (index != 0) {
                const startTop = boxes.table.topOffset;
                const startLeft = boxes.table.leftOffset;
                const lastTop = startTop + (index) * (boxes.table.rowHeight + boxes.table.rowGap);
                for (const line of boxes.table.lines) {
                    ctx.fillRect(line.left, startTop, line.width, lastTop - startTop);
                }

                for (let i = 0; i < index; i++) {
                    const top = startTop + i * (boxes.table.rowHeight + boxes.table.rowGap);
                    ctx.fillRect(startLeft, top, boxes.table.endLeft - startLeft, boxes.table.rowGap);
                    // ctx.beginPath();
                    // ctx.moveTo(startLeft, top);
                    // ctx.lineTo(startLeft + boxes.table.cols.fach.width + boxes.table.colGap + boxes.table.cols.date.width + boxes.table.colGap + boxes.table.cols.hours.width, top);
                    // ctx.stroke();
                    lastTopPosForEndImage = top;
                }

            }

            const top = (lastTopPosForEndImage == 0 ? boxes.table.topOffset : (lastTopPosForEndImage + (boxes.table.rowHeight + boxes.table.rowGap)));
            const left = boxes.table.endImageOffsetLeft;
            ctx.drawImage(endImage, left, top, boxes.table.endImageWidth, boxes.table.endImageHeight);

            let newHeight = boxes.table.topOffset + boxes.endHeight;
            let tableHeight = 0;
            newHeight += tableHeight;
            if (index != 0) {
                tableHeight = (index) * (boxes.table.rowHeight + boxes.table.rowGap);
                newHeight += tableHeight;
            }
            newHeight = Math.max(newHeight, boxes.minHeight);

            if (canvas.height != newHeight) {
                canvas.height = newHeight;
                repaint();
                return;
            }


            if (currentDate != null) {
                const top = boxes.date.top;
                const left = boxes.date.left;
                const width = boxes.date.width;
                const height = boxes.date.height;
                if (ctx) ctx.textAlign = "center";
                if (ctx) ctx.font = "bold 200px Arial";
                ctx.fillText(currentDate.toLocaleDateString("de-DE"), left + width / 2, top + height);
            }

            if (currentName != "") {
                const top = boxes.name.top;
                const left = boxes.name.left;
                // const width = boxes.name.width;
                const height = boxes.name.height;
                if (ctx) ctx.textAlign = "left";
                if (ctx) ctx.font = "bold 200px Arial";
                ctx.fillText(currentName, left + 10, top + height);
            }

            if (currentTutor && currentTutor.length > 0) {
                const top = boxes.tutor.top;
                const left = boxes.tutor.left;
                // const width = boxes.tutor.width;
                const height = boxes.tutor.height;
                if (ctx) ctx.textAlign = "left";
                if (ctx) ctx.font = "bold 200px Arial";
                ctx.fillText(currentTutor, left + 10, top + height);
            }

            if (currentReason) {
                const top = boxes.reason.top;
                const left = boxes.reason.left;
                // const width = boxes.reason.width;
                const height = boxes.reason.height;
                if (ctx) ctx.textAlign = "left";
                if (ctx) ctx.font = "bold 200px Arial";
                ctx.fillText(currentReason, left + 10, top + height);
            }

        }



    }



}