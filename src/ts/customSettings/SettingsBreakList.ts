import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat.js";
import { BREAKS, EXAMS, SCHEDULE, SCHOOLS } from "../ScheduleDarius";
import { SettingsElement, type SettingsFunctionData } from "../settings/SettingsTitleElement";
import { Images } from "./Images";
import toast from "toastify-js";
import UntisManager from "../untis/UntisManager";
import type { BreaksRawByDay, DayName, ScheduleBreak, Time } from "../@types/Schedule";
import type { School } from "../@types/School";
dayjs.extend(customParseFormat);

export type SettingsBreakListData = SettingsFunctionData & {
}

type MemoryRow = HTMLTableRowElement & {
    break: ScheduleBreak
};

export class SettingsBreakList extends SettingsElement {
    private element: HTMLDivElement;
    private name: string = "";
    private disabled: boolean = false;
    private data: SettingsBreakListData;
    private examTableBody: HTMLTableSectionElement;
    private examTableHead: HTMLTableSectionElement;
    private tableStatText: HTMLParagraphElement | undefined;
    private examRows: MemoryRow[] = [];

    constructor(data: SettingsBreakListData) {
        super();
        this.data = data;
        this.element = document.createElement("div");
        this.element.classList.add("settings-exam-list");
        this.examTableBody = document.createElement("tbody");
        this.examTableHead = document.createElement("thead");
        this.initElements();
    }

    private initElements() {
        const teacherTable = document.createElement("table");

        const titleRow = this.examTableHead.insertRow();
        for (const title of ["Day", "StartTime", "EndTime", "Duration", "School", ""]) {
            const titleCell = titleRow.insertCell();
            titleCell.innerHTML = title;
            if (title == "") {
                titleCell.innerHTML = "+";
                titleCell.classList.add("examButton");
                titleCell.onclick = () => {
                    this.addBreak((dayOfWeek, startTime, endTime, school) => {
                        BREAKS[dayOfWeek].push({
                            start: startTime.hour.toString().padStart(2, "0") + ":" + startTime.minute.toString().padStart(2, "0"),
                            end: endTime.hour.toString().padStart(2, "0") + ":" + endTime.minute.toString().padStart(2, "0"),
                            school: school
                        })
                        this.updateTable();
                    });
                };
            }
        }

        this.examRows = [];

        this.updateTable();

        teacherTable.appendChild(this.examTableHead);
        teacherTable.appendChild(this.examTableBody);

        this.tableStatText = document.createElement("p");
        this.tableStatText.classList.add("tableStatText");

        this.element.appendChild(teacherTable);
        this.element.appendChild(this.tableStatText);

    }


    private updateTable() {
        this.examRows.forEach(e => e.remove());
        this.examRows = [];

        const allBreaks: (ScheduleBreak & {
            day: DayName
        })[] = [];

        for (const key of (Object.keys(BREAKS) as (keyof BreaksRawByDay)[])) {
            for (const breakV of BREAKS[key]) {
                allBreaks.push({
                    ...breakV,
                    day: key as DayName
                })
            }
        }

        for (let breakV of allBreaks) {
            const row = this.examTableBody.insertRow();
            const day = row.insertCell();
            const startTime = row.insertCell();
            const endTime = row.insertCell();
            const duration = row.insertCell();
            const school = row.insertCell();
            const trash = row.insertCell();

            day.innerHTML = breakV.day ? breakV.day : "?"
            startTime.innerHTML = breakV.start ? breakV.start : "?";
            endTime.innerHTML = breakV.end ? breakV.end : "?";
            school.innerHTML = breakV.school ? breakV.school : "?";

            if (breakV.start && breakV.end) {
                const startParsed = UntisManager.parseTime(breakV.start);
                const endParsed = UntisManager.parseTime(breakV.end);
                const startM = startParsed.hour * 60 + startParsed.minute;
                const endM = endParsed.hour * 60 + endParsed.minute;
                const span = endM - startM;
                duration.innerHTML = span + "min";
            }

            const trashDiv = document.createElement("div");
            trashDiv.innerHTML = Images.TRASH;
            trashDiv.classList.add("trash");
            trashDiv.onclick = () => {
                for (const key of (Object.keys(BREAKS) as (keyof BreaksRawByDay)[])) {
                    BREAKS[key] = BREAKS[key].filter(e => e != breakV);
                }

                const row = this.examRows.find((r) => r.break == breakV) as HTMLTableRowElement;
                this.examRows = this.examRows.filter(row => row.break != breakV);
                this.examTableBody.removeChild(row);
            };
            trash.appendChild(trashDiv);

            const tRow = row as MemoryRow;
            tRow.break = breakV;
            this.examRows.push(tRow);
        }

    }

    private addBreak(callback: (dayOfWeek: DayName, startTime: Time, endTime: Time, school: School) => void) {

        const addBreakDialogWrapper = document.createElement("div");
        addBreakDialogWrapper.id = "addBreakDialogWrapper";

        const addBreakDialog = document.createElement("div");
        addBreakDialog.id = "addBreakDialog";

        const title = document.createElement("h2");
        title.innerText = "Add Break";

        const dayOfWeekSelect = document.createElement("select");
        dayOfWeekSelect.classList.add("dayOfWeek");

        for (const dayOfWeek of ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]) {
            const option = document.createElement("option");
            option.value = dayOfWeek;
            option.text = dayOfWeek;
            dayOfWeekSelect.appendChild(option);
        }

        const createTimeSelector = (change: (hour: number, minute: number) => void): {
            element: HTMLDivElement;
            setTime: (hour: number, minute: number) => void;
            getTime: () => Time
        } => {

            let currentSelectedInput: HTMLInputElement | null = null;

            const wrapper = document.createElement("div");
            wrapper.classList.add("timePickerWrapper");

            const hourInput = document.createElement("input");
            const minuteInput = document.createElement("input");

            const arrows = document.createElement("div");
            arrows.classList.add("arrows");

            const upArrow = document.createElement("button");
            upArrow.classList.add("upArrow");
            upArrow.onclick = () => {
                if (!currentSelectedInput) return;
                add(currentSelectedInput, "up", currentSelectedInput == hourInput ? "h" : "m");
            };

            const downArrow = document.createElement("button");
            downArrow.classList.add("downArrow");
            downArrow.onclick = () => {
                if (!currentSelectedInput) return;
                add(currentSelectedInput, "down", currentSelectedInput == hourInput ? "h" : "m");
            };

            downArrow.autofocus = false;
            upArrow.autofocus = false;

            const spacer = document.createElement("span");
            spacer.classList.add("spacer");
            spacer.innerHTML = ":";

            hourInput.type = "text";
            minuteInput.type = "text";

            hourInput.classList.add("hourInput");
            minuteInput.classList.add("minuteInput");

            const checkForValue = (value: string): string => {
                let resultNumber = "";
                const digits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
                for (let i = 0; i < value.length; i++) {
                    if (digits.includes(value.charAt(i))) {
                        resultNumber += value.charAt(i);
                    }
                }
                return resultNumber;
            };

            const validate = (value: string, pos: "h" | "m", force = false): string => {
                if (value == "") return value;
                let intVal = parseInt(value);
                switch (pos) {
                    case "h":
                        if (intVal > 23) intVal = 23;
                        if (intVal <= 0) intVal = 1;
                        break;
                    case "m":
                        if (intVal > 55) intVal = 55;
                        if (intVal <= 0) intVal = 1;
                        if (value.length == 2 || force)
                            intVal = Math.round(intVal / 5) * 5
                        break;
                }
                return intVal.toString().padStart(force ? 2 : value.length, "0");
            };

            const add = (element: HTMLInputElement, direction: "up" | "down", pos: "h" | "m") => {
                let val = validate(checkForValue(element.value.slice(0, 2)), pos);
                if (val == "") val = "0";
                let parsed = parseInt(val);
                if (direction == "down") {
                    parsed -= pos == "h" ? 1 : 5;
                } else {
                    parsed += pos == "h" ? 1 : 5;
                }

                switch (pos) {
                    case "h":
                        if (parsed > 23) parsed = 1;
                        if (parsed <= 0) parsed = 23;
                        break;
                    case "m":
                        if (parsed > 55) parsed = 0;
                        if (parsed < 0) parsed = 55;
                        break;
                }

                val = validate(parsed.toString().padStart(2, "0"), pos);
                element.value = val;
            }

            const onChange = () => {
                hourInput.value = validate(checkForValue(hourInput.value.slice(0, 2)), "h");
                minuteInput.value = validate(checkForValue(minuteInput.value.slice(0, 2)), "m");
                change(parseInt(hourInput.value), parseInt(minuteInput.value));
            };

            const focusLost = () => {
                hourInput.value = validate(checkForValue(hourInput.value.slice(0, 2)), "h", true);
                minuteInput.value = validate(checkForValue(minuteInput.value.slice(0, 2)), "m", true);
                change(parseInt(hourInput.value), parseInt(minuteInput.value));
            };

            const keyUp = (e: KeyboardEvent) => {
                console.log(e.key);
                if (e.key == "Enter") {
                    focusLost();
                } else if (e.key == "ArrowUp") {
                    add(e.target as HTMLInputElement, "up", e.target == hourInput ? "h" : "m");
                } else if (e.key == "ArrowDown") {
                    add(e.target as HTMLInputElement, "down", e.target == hourInput ? "h" : "m");
                }
            };

            const wheel = (e: WheelEvent) => {
                const y = e.deltaY;
                if (y < 0) {
                    add(e.target as HTMLInputElement, "up", e.target == hourInput ? "h" : "m");
                } else if (y > 0) {
                    add(e.target as HTMLInputElement, "down", e.target == hourInput ? "h" : "m");
                }
            }


            arrows.appendChild(upArrow);
            arrows.appendChild(downArrow);

            hourInput.oninput = onChange;
            minuteInput.oninput = onChange;
            hourInput.addEventListener("keyup", keyUp);
            minuteInput.addEventListener("keyup", keyUp);
            hourInput.addEventListener("wheel", wheel);
            minuteInput.addEventListener("wheel", wheel);

            hourInput.autofocus = true;
            minuteInput.autofocus = true;

            hourInput.addEventListener("focusout", (e: FocusEvent) => {
                if (arrows.contains(e.relatedTarget as Node)) {
                    hourInput.focus();
                    e.preventDefault();
                    return;
                }
                focusLost();
                if (currentSelectedInput == hourInput) {
                    currentSelectedInput = null;
                    arrows.classList.remove("visible");
                }
            });
            minuteInput.addEventListener("focusout", (e) => {
                if (arrows.contains(e.relatedTarget as Node)) {
                    minuteInput.focus();
                    e.preventDefault();
                    return;
                }
                focusLost();
                if (currentSelectedInput == minuteInput) {
                    currentSelectedInput = null;
                    arrows.classList.remove("visible");
                }
            });

            hourInput.addEventListener("focusin", () => {
                currentSelectedInput = hourInput;
                arrows.classList.remove("right");
                arrows.classList.add("left");
                arrows.classList.add("visible");
            });

            minuteInput.addEventListener("focusin", () => {
                currentSelectedInput = minuteInput;
                arrows.classList.remove("left");
                arrows.classList.add("right");
                arrows.classList.add("visible");
            });

            wrapper.appendChild(arrows);
            wrapper.appendChild(hourInput);
            wrapper.appendChild(spacer);
            wrapper.appendChild(minuteInput);
            return {
                element: wrapper,
                setTime: (h, m) => {
                    hourInput.value = validate(checkForValue(h + ""), "h", true);
                    minuteInput.value = validate(checkForValue(m + ""), "m", true);
                },
                getTime: () => {
                    hourInput.value = validate(checkForValue(hourInput.value.slice(0, 2)), "h", true);
                    minuteInput.value = validate(checkForValue(minuteInput.value.slice(0, 2)), "m", true);
                    return {
                        hour: parseInt(hourInput.value),
                        minute: parseInt(minuteInput.value)
                    };
                }
            };
        };

        const endTimeData = createTimeSelector((h, m) => {
            const startTime = startTimeData.getTime();
            const endM = h * 60 + m;
            const startM = startTime.hour * 60 + startTime.minute;
            if (endM < startM) {
                let newM = m - 5;
                let newH = h;
                if (newM < 0) {
                    newM = 0;
                    newH--;
                    if (newH < 0) newH = 23;
                }
                startTimeData.setTime(newH, newM);
            }
        });
        const startTimeData = createTimeSelector((h, m) => {
            const endTime = endTimeData.getTime();
            const endM = endTime.hour * 60 + endTime.minute;
            const startM = h * 60 + m;
            if (endM < startM) {
                let newM = m + 5;
                let newH = h;
                if (newM > 55) {
                    newM = 0;
                    newH++;
                    if (newH > 23) newH = 1;
                }
                endTimeData.setTime(newH, newM);
            }
        });
        const startTime = startTimeData.element;
        startTime.classList.add("startTime");


        const endTime = endTimeData.element;
        endTime.classList.add("endTime");
        // startTime.classList.add("startTime");
        // // startTime.placeholder = "Break Start Time";
        // // startTime.type = "text";

        // startTime.oninput = () => {

        // };


        // const endTime = document.createElement("div");
        // endTime.classList.add("endTime");
        // // endTime.placeholder = "Break Start Time";
        // // endTime.type = "text";

        // endTime.oninput = () => {

        // };

        const schoolInput = document.createElement("select");
        schoolInput.classList.add("school");

        SCHOOLS.get().forEach(school => {
            const option = document.createElement("option");
            option.value = school;
            option.text = school;
            schoolInput.appendChild(option);
        });


        const addBtn = document.createElement("button");
        addBtn.classList.add("addBtn");
        addBtn.innerText = "Add";
        addBtn.onclick = () => {
            const notify = (msg: string) => {
                const toasts = toast({
                    text: msg,
                    duration: 3000,
                    position: "right",
                    stopOnFocus: true,
                    gravity: "bottom",
                    style: {
                        background: "linear-gradient(135deg, #ff7373, #f55454)",
                        boxShadow: "0 3px 6px -1px rgba(0, 0, 0, 0.12), 0 10px 36px -4px rgba(232, 77, 77, 0.3)",
                        zIndex: "10000000"
                    }
                });
                toasts.showToast();
                return;
            };

            const validSchool = (school: string): boolean => {
                if ((SCHOOLS.get() as string[]).includes(school)) return true;
                return false;
            }

            if (!validSchool(schoolInput.value)) {
                notify("The School " + schoolInput.value + " is not valid!");
            }

            const startMinutes = startTimeData.getTime().hour * 60 + startTimeData.getTime().minute;
            const endMinutes = endTimeData.getTime().hour * 60 + endTimeData.getTime().minute;

            const found = BREAKS[(dayOfWeekSelect.value).toLowerCase() as DayName].find(b => {
                const bStart = UntisManager.parseTime(b.start);
                const bEnd = UntisManager.parseTime(b.end);
                const bStartM = bStart.hour * 60 + bStart.minute;
                const bEndM = bEnd.hour * 60 + bEnd.minute;
                if ((startMinutes >= bStartM && startMinutes < bEndM) || (endMinutes > bStartM && endMinutes <= bEndM) || (startMinutes <= bStartM && endMinutes >= bEndM)) {
                    return true;
                }
                return false;
            });

            if (found) {
                notify("This break overlaps with another break!");
                return;
            }

            // if (!selectedLesson) {
            //     notify("You have to select a lesson");
            //     return;
            // }
            // if (!selectedDate) {
            //     notify("You have to select a date");
            //     return;
            // }
            // if (!selectedSubject) {
            //     notify("You have to select a subject");
            //     return;
            // }
            document.body.removeChild(addBreakDialogWrapper);
            callback((dayOfWeekSelect.value).toLowerCase() as DayName, startTimeData.getTime(), endTimeData.getTime(), schoolInput.value as School);
        };

        const cancelbtn = document.createElement("button");
        cancelbtn.classList.add("cancelbtn");
        cancelbtn.innerText = "Cancel";
        cancelbtn.onclick = () => {
            document.body.removeChild(addBreakDialogWrapper);
        };



        addBreakDialog.appendChild(title);
        addBreakDialog.appendChild(dayOfWeekSelect);
        addBreakDialog.appendChild(startTime);
        addBreakDialog.appendChild(endTime);
        addBreakDialog.appendChild(schoolInput);
        addBreakDialog.appendChild(addBtn);
        addBreakDialog.appendChild(cancelbtn);


        addBreakDialogWrapper.appendChild(addBreakDialog);

        document.body.appendChild(addBreakDialogWrapper);
    }

    getElement(): HTMLDivElement {
        console.log(this.element);
        return this.element;
    }

    setElement(element: HTMLDivElement): void {
        this.element = element;
    }

    setTitle(title: string): void {
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