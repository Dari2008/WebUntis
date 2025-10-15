import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat.js";
import { EXAMS, type Exam } from "../ScheduleDarius";
import { SettingsElement, type SettingsContentElement, type SettingsFunctionData } from "../settings/SettingsTitleElement";
import { Images } from "./Images";
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
    private data: SettingsExamsListData;
    private searchBar: HTMLInputElement | null = null;
    private examTableBody: HTMLTableSectionElement;
    private examTableHead: HTMLTableSectionElement;
    private tableStatText: HTMLParagraphElement | undefined;
    private examRows: MemoryRow[] = [];
    private examsVisibleText: string = " <span class='examsText'>Exams</span> <span class='visibleText'>visible</span>";
    private writtenOf: string = "<span class='writtenof'>{{EXAM_NUM}} of {{EXAM_ALL_NUM}} Written</span>";

    constructor(data: SettingsExamsListData) {
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
                if (this.tableStatText) this.tableStatText.innerHTML = EXAMS.get().length + " of " + EXAMS.get().length + this.examsVisibleText + " " + this.writtenOf;
            } else {
                const length = value.length;
                this.examTableBody.innerHTML = "";
                const filtered = this.examRows.filter(row => {

                    const shortNameE = (row.children[0] as HTMLTableCellElement);
                    const firstNameE = (row.children[1] as HTMLTableCellElement);
                    const surnameE = (row.children[2] as HTMLTableCellElement);
                    const subjectsE = (row.children[3] as HTMLTableCellElement);

                    const elements = [shortNameE, firstNameE, surnameE, subjectsE];

                    let found = false;

                    const markSearch = (valueToSearch: string): string => {
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
                        return valueToSearch;
                    };

                    for (const e of elements) {
                        let value = e.innerText;
                        if (value) {
                            value = markSearch(value);
                            e.innerHTML = value;
                        }
                    }
                    return found;
                });

                if (this.tableStatText) this.tableStatText.innerHTML = filtered.length + " of " + EXAMS.get().length + this.examsVisibleText + " " + this.writtenOf;

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
        this.tableStatText.innerHTML = EXAMS.get().length + " of " + EXAMS.get().length + this.examsVisibleText + " " + this.writtenOf;

        this.element.appendChild(teacherTable);
        this.element.appendChild(this.tableStatText);

    }


    private updateTable() {
        this.examRows.forEach(e => e.remove());
        this.examRows = [];

        let written = 0;

        for (const exam of EXAMS.get()) {
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
                EXAMS.set(EXAMS.get().filter(e => e != exam));
                const row = this.examRows.find((r) => r.exam == exam) as HTMLTableRowElement;
                this.examRows = this.examRows.filter(row => row.exam != exam);
                this.examTableBody.removeChild(row);
                if (this.tableStatText) this.tableStatText.innerHTML = this.examTableBody.children.length + " of " + EXAMS.get().length + this.examsVisibleText + " " + this.writtenOf;
            };
            trash.appendChild(trashDiv);

            const tRow = row as MemoryRow;
            tRow.exam = exam;
            this.examRows.push(tRow);
        }

        if (this.writtenOf.includes("{{")) {
            this.writtenOf = this.writtenOf.replace("{{EXAM_NUM}}", written + "");
            this.writtenOf = this.writtenOf.replace("{{EXAM_ALL_NUM}}", EXAMS.get().length + "");
        }

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