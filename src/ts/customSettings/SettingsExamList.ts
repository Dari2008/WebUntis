import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat.js";
import { SettingsElement, type SettingsFunctionData } from "../settings/SettingsTitleElement";
import { Images } from "./Images";
import { easepick } from "@easepick/core";
import toast from "toastify-js";
import type { LessonRaw } from "../@types/Schedule";
import type { Exam } from "../@types/Exam";
import { UserManagement } from "../userManagement/UserManagement";
import Utils from "../Utils";
dayjs.extend(customParseFormat);

export type SettingsExamsListData = SettingsFunctionData & {
}

type MemoryRow = HTMLTableRowElement & {
    exam: Exam
};

export class SettingsExamsList extends SettingsElement {
    private element: HTMLDivElement;
    private name: string = "";
    private disabled: boolean = false;
    private searchBar: HTMLInputElement | null = null;
    private examTableBody: HTMLTableSectionElement;
    private examTableHead: HTMLTableSectionElement;
    private tableStatText: HTMLParagraphElement | undefined;
    private examRows: MemoryRow[] = [];
    private examsVisibleText: string = " <span class='examsText'>Exams</span> <span class='visibleText'>visible</span>";
    private writtenOf: string = "<span class='writtenof'>{{EXAM_NUM}} of {{EXAM_ALL_NUM}} Written</span>";

    constructor() {
        super();
        this.element = document.createElement("div");
        this.element.classList.add("settings-exam-list");
        this.examTableBody = document.createElement("tbody");
        this.examTableHead = document.createElement("thead");
        this.initElements();
    }

    private initElements() {
        const teacherTable = document.createElement("table");

        this.searchBar = null;

        const titleRow = this.examTableHead.insertRow()
        for (const title of ["Subject", "Date", "Time Until", "Lesson Name", ""]) {
            const titleCell = titleRow.insertCell();
            titleCell.innerHTML = title;
            if (title == "Lesson Name") {
                const sb = document.createElement("input");
                sb.classList.add("searchBar");
                sb.placeholder = "Search";
                titleCell.appendChild(sb);
                this.searchBar = sb;
            } else if (title == "") {
                titleCell.innerHTML = "+";
                titleCell.classList.add("examButton");
                titleCell.onclick = () => {
                    this.addExam((lesson, date, subject) => {
                        const ex = UserManagement.ALL_DATA!.exams;
                        const newExam = {
                            date: dayjs(date).format("DD.MM.YYYY"),
                            sign: lesson.sign,
                            subject: subject,
                            uuid: Utils.uuidv4Exclude(UserManagement.ALL_DATA!.exams.map(e => e.uuid))
                        };
                        ex.push(newExam)

                        UserManagement.updateExams("add", [
                            newExam
                        ]);

                        this.updateTable();
                    });
                };
            }
        }

        const typeEvent = () => {
            const value = this.searchBar?.value.trim();
            if (value == "" || !value) {
                this.examTableBody.innerHTML = "";
                this.examRows.forEach(row => {
                    const shortNameE = (row.children[0] as HTMLTableCellElement);
                    const firstNameE = (row.children[1] as HTMLTableCellElement);
                    const surnameE = (row.children[2] as HTMLTableCellElement);
                    const subjectsE = (row.children[3] as HTMLTableCellElement);

                    const elements = [shortNameE, firstNameE, surnameE, subjectsE];

                    for (const e of elements) {
                        e.innerText = e.innerText;
                    }
                    this.examTableBody.appendChild(row);
                });
                if (this.tableStatText) this.tableStatText.innerHTML = UserManagement.ALL_DATA!.exams.length + " of " + UserManagement.ALL_DATA!.exams.length + this.examsVisibleText + " " + this.writtenOf;
            } else {
                this.examTableBody.innerHTML = "";
                const filtered = this.examRows.filter(row => {

                    const shortNameE = (row.children[0] as HTMLTableCellElement);
                    const firstNameE = (row.children[1] as HTMLTableCellElement);
                    const surnameE = (row.children[2] as HTMLTableCellElement);
                    const subjectsE = (row.children[3] as HTMLTableCellElement);

                    const elements = [shortNameE, firstNameE, surnameE, subjectsE];

                    let found = false;

                    for (const e of elements) {
                        let textValue = e.innerText;
                        if (textValue) {
                            const result = this.markSearch(value, textValue);
                            found = found || result.found;
                            textValue = result.value;
                            e.innerHTML = value;
                        }
                    }
                    return found;
                });

                if (this.tableStatText) this.tableStatText.innerHTML = filtered.length + " of " + UserManagement.ALL_DATA!.exams.length + this.examsVisibleText + " " + this.writtenOf;

                filtered.forEach(row => {
                    // row.classList.remove("hidden");
                    this.examTableBody.appendChild(row);
                });
            }
        };

        this.searchBar?.addEventListener("input", typeEvent);
        this.examRows = [];

        this.updateTable();

        teacherTable.appendChild(this.examTableHead);
        teacherTable.appendChild(this.examTableBody);

        this.tableStatText = document.createElement("p");
        this.tableStatText.classList.add("tableStatText");
        this.tableStatText.innerHTML = UserManagement.ALL_DATA!.exams.length + " of " + UserManagement.ALL_DATA!.exams.length + this.examsVisibleText + " " + this.writtenOf;

        this.element.appendChild(teacherTable);
        this.element.appendChild(this.tableStatText);

    }


    private updateTable() {
        this.examRows.forEach(e => e.remove());
        this.examRows = [];

        let written = 0;

        for (const exam of UserManagement.ALL_DATA!.exams) {
            const row = this.examTableBody.insertRow();
            const subjectName = row.insertCell();
            const date = row.insertCell();
            const timeUntil = row.insertCell();
            const sign = row.insertCell();
            const trash = row.insertCell();

            subjectName.innerHTML = exam.subject ? exam.subject : "?"
            date.innerHTML = exam.date ? exam.date : "?";
            sign.innerHTML = exam.sign ? exam.sign : "?";

            if (exam.date) {
                const days = dayjs(exam.date, "DD.MM.YYYY", false).diff(dayjs(), "day");
                timeUntil.innerHTML = days + " days";
                if (days < 0) {
                    row.classList.add("allreadyWritten");
                    written++;
                }
            }

            const trashDiv = document.createElement("div");
            trashDiv.innerHTML = Images.TRASH;
            trashDiv.classList.add("trash");
            trashDiv.onclick = () => {
                UserManagement.ALL_DATA!.exams = UserManagement.ALL_DATA!.exams.filter(e => e != exam);
                UserManagement.updateExams("remove", [exam.uuid]);
                const row = this.examRows.find((r) => r.exam == exam) as HTMLTableRowElement;
                this.examRows = this.examRows.filter(row => row.exam != exam);
                this.examTableBody.removeChild(row);
                if (this.tableStatText) this.tableStatText.innerHTML = this.examTableBody.children.length + " of " + UserManagement.ALL_DATA!.exams.length + this.examsVisibleText + " " + this.writtenOf;
                Utils.success("Deleted Exam Successfully");
            };
            trash.appendChild(trashDiv);

            const tRow = row as MemoryRow;
            tRow.exam = exam;
            this.examRows.push(tRow);
        }

        if (this.writtenOf.includes("{{")) {
            this.writtenOf = this.writtenOf.replace("{{EXAM_NUM}}", written + "");
            this.writtenOf = this.writtenOf.replace("{{EXAM_ALL_NUM}}", UserManagement.ALL_DATA!.exams.length + "");
        }

    }


    private markSearch(value: string, valueToSearch: string): { found: boolean, value: string } {
        const length = value.length;
        let found = false;
        if (valueToSearch.toLowerCase().startsWith(value.toLowerCase())) {
            found = true;
            const length = value.length;
            valueToSearch = "<mark>" + valueToSearch.substring(0, length) + "</mark>" + valueToSearch.substring(length, valueToSearch.length);
        } else if (valueToSearch.toLowerCase().endsWith(value.toLowerCase())) {
            found = true;
            valueToSearch = valueToSearch.substring(0, valueToSearch.length - length) + "<mark>" + valueToSearch.substring(valueToSearch.length - length, valueToSearch.length) + "</mark>";
        } else if (valueToSearch.toLowerCase().includes(value.toLowerCase())) {
            const start = valueToSearch.toLowerCase().indexOf(value.toLowerCase());
            if (start != -1) {
                found = true;
                valueToSearch = valueToSearch.substring(0, start) + "<mark>" + valueToSearch.substring(start, start + length) + "</mark>" + valueToSearch.substring(start + length, valueToSearch.length);
            }
        }
        return {
            found: found,
            value: valueToSearch
        };
    };

    private addExam(callback: (lesson: LessonRaw, date: Date, subject: string) => void) {
        let lessonRows: HTMLLIElement[] = [];

        let selectedLesson: LessonRaw | null = null;
        let selectedDate: Date | null = null;
        let selectedSubject: string | null = null;

        const addExamDialog = document.createElement("dialog");
        addExamDialog.id = "addExamDialog";

        const title = document.createElement("h2");
        title.innerText = "Add Exam";

        const search = document.createElement("input");
        search.classList.add("search");
        search.placeholder = "Search";
        search.type = "text";

        const subjectInput = document.createElement("input");
        subjectInput.classList.add("subjectInput");
        subjectInput.placeholder = "Subject (e.g. Math)";
        subjectInput.type = "text";

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
            if (!selectedLesson) {
                notify("You have to select a lesson");
                return;
            }
            if (!selectedDate) {
                notify("You have to select a date");
                return;
            }
            if (!selectedSubject) {
                notify("You have to select a subject");
                return;
            }
            addExamDialog.close();
            document.body.removeChild(addExamDialog);
            callback(selectedLesson, selectedDate, selectedSubject);
        };

        const cancelbtn = document.createElement("button");
        cancelbtn.classList.add("cancelbtn");
        cancelbtn.innerText = "Cancel";
        cancelbtn.onclick = () => {
            addExamDialog.close();
            document.body.removeChild(addExamDialog);
        };


        subjectInput.oninput = () => {
            selectedSubject = subjectInput.value;
        };

        const datePickerInput = document.createElement("input");
        datePickerInput.id = "datePickerInput";
        datePickerInput.placeholder = "Date";
        const initPicker = () => {
            const datePicker = new easepick.create({
                element: datePickerInput,
                plugins: [],
                zIndex: 1000000000,
                readonly: true,
                autoApply: true,
                scrollToDate: true,
                // RangePlugin: {
                //     locale: {
                //         one: "Tag",
                //         two: "Tage",
                //         many: "Tage",
                //         few: "Tage",
                //         other: "Tage",
                //         zero: "Tage"
                //     }
                // },
                format: "DD.MM.YYYY",
                lang: "de",
                css: [
                    'https://cdn.jsdelivr.net/npm/@easepick/core@1.2.1/dist/index.css',
                    // 'https://cdn.jsdelivr.net/npm/@easepick/range-plugin@1.2.1/dist/index.css',
                    // 'https://cdn.jsdelivr.net/npm/@easepick/time-plugin@1.2.1/dist/index.css'
                ]
            });

            // datePickerInput.addEventListener("focusin", () => {
            //     datePicker.show();
            // });

            // datePickerInput.addEventListener("focusout", () => {
            //     datePicker.hide();
            // });

            datePicker.on("select", (e) => {
                selectedDate = e.detail.date;
            });

        }

        const lessonPickerList = document.createElement("ul");
        lessonPickerList.classList.add("lessonPickerList");

        search.oninput = () => {
            const value = search.value;
            if (!value) {
                lessonPickerList.innerHTML = "";
                lessonRows.forEach(row => {
                    const school = row.querySelector(".school") as HTMLSpanElement;
                    const sign = row.querySelector(".sign") as HTMLSpanElement;
                    const elements = [school, sign];

                    for (const e of elements) {
                        e.innerText = e.innerText;
                    }
                    lessonPickerList.appendChild(row);
                });
                return;
            }

            lessonRows.forEach(row => row.remove());

            const filtered = lessonRows.filter(row => {
                const school = row.querySelector(".school") as HTMLSpanElement;
                const sign = row.querySelector(".sign") as HTMLSpanElement;
                const elements = [school, sign];
                let found = false;
                for (const e of elements) {
                    let textValue = e.innerText;
                    if (textValue) {
                        const result = this.markSearch(value, textValue);
                        found = found || result.found;
                        textValue = result.value;
                        e.innerHTML = textValue;
                    }
                }
                return found;
            });

            filtered.forEach(row => {
                lessonPickerList.appendChild(row);
            });

        };


        const LESSONS_TO_PICK_FROM: LessonRaw[] = [];



        for (const lesson of Object.values(UserManagement.ALL_DATA!.schedule).flat().map(day => Object.values(day)).flat()) {
            if (!lesson) continue;
            if (!LESSONS_TO_PICK_FROM.find(l => lesson.sign == l.sign)) {
                LESSONS_TO_PICK_FROM.push(lesson);
            }
        }

        for (const lesson of LESSONS_TO_PICK_FROM) {
            const listItem = document.createElement("li");
            const school = document.createElement("span");
            const sign = document.createElement("span");
            school.innerText = lesson.school;
            sign.innerText = lesson.sign;

            school.classList.add("school");
            sign.classList.add("sign");

            listItem.appendChild(sign);
            listItem.appendChild(school);
            listItem.onclick = () => {
                selectedLesson = lesson;
                lessonRows.forEach(r => r.classList.remove("selected"));
                listItem.classList.add("selected");

            };
            lessonPickerList.appendChild(listItem);
            lessonRows.push(listItem);
        }

        addExamDialog.appendChild(title);
        addExamDialog.appendChild(search);
        addExamDialog.appendChild(subjectInput);
        addExamDialog.appendChild(datePickerInput);
        addExamDialog.appendChild(lessonPickerList);
        addExamDialog.appendChild(addBtn);
        addExamDialog.appendChild(cancelbtn);


        document.body.appendChild(addExamDialog);
        addExamDialog.showModal();
        initPicker();
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
}