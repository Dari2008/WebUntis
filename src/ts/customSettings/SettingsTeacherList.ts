import type { School } from "../@types/School";
import type { Subject, Teacher } from "../@types/Teachers";
import { SettingsElement, type SettingsContentElement, type SettingsFunctionData } from "../settings/SettingsTitleElement";
import { TEACHER_DATABASE, TEACHER_DATABASE_ARRAY } from "../untis/TeacherDatabase";
import { Images } from "./Images";
import Toast from "toastify-js";
import { createInputWithLabel } from "./Utils";

export type SettingsTeacherListData = SettingsFunctionData & {
    school: School;
}

type MemoryRow = HTMLTableRowElement & {
    teacher: Teacher;
}

export class SettingsTeacherList extends SettingsElement {
    private element: HTMLDivElement;
    private name: string = "";
    private disabled: boolean = false;
    private data: SettingsTeacherListData;
    private teacherRows: MemoryRow[] = [];
    private searchBar: HTMLInputElement | null = null;
    private teacherTableBody: HTMLTableSectionElement;
    private teacherTableHead: HTMLTableSectionElement;
    private tableStatText: HTMLSpanElement | undefined;
    private teachersVisibleText: string = " <span class='teachersText'>Teachers</span> <span class='visibleText'>visible</span>";

    constructor(data: SettingsTeacherListData) {
        super();
        this.data = data;
        this.name = data.name;
        this.element = document.createElement("div");
        this.element.className = "settings-teacher-list";
        this.teacherTableHead = document.createElement("thead");
        this.teacherTableBody = document.createElement("tbody");
        this.initElement();
        console.log("Hallo");
    }

    private initElement() {
        const addTeacherDiv = document.createElement("div");

        const [teacherShortNameInputWrapper, teacherShortNameInput] = createInputWithLabel(undefined, "Short Name", /.{2,4}/, true);
        teacherShortNameInput.className = "teacher-short-name";
        addTeacherDiv.appendChild(teacherShortNameInputWrapper);

        const [teacherFirstNameInputWrapper, teacherFirstNameInput] = createInputWithLabel(undefined, "First Name", /.+/, true);
        teacherFirstNameInput.className = "teacher-first-name";
        addTeacherDiv.appendChild(teacherFirstNameInputWrapper);

        const [teacherSurnameInputWrapper, teacherSurnameInput] = createInputWithLabel(undefined, "Surname", /.+/, true);
        teacherSurnameInput.className = "teacher-surname";
        addTeacherDiv.appendChild(teacherSurnameInputWrapper);

        const [teacherSubjectsInputWrapper, teacherSubjectsInput] = createInputWithLabel(undefined, "Subjects (comma separated)", /^([A-Za-z0-9]{2,5})(,[A-Za-z0-9]{2,5})*$/, true);
        teacherSubjectsInput.className = "teacher-subjects";
        addTeacherDiv.appendChild(teacherSubjectsInputWrapper);

        const addTeacherButton = document.createElement("button");
        addTeacherButton.innerText = "Add Teacher";
        addTeacherButton.onclick = () => {
            const short = teacherShortNameInput.value.trim();
            const firstName = teacherFirstNameInput.value.trim();
            const surname = teacherSurnameInput.value.trim();
            const subjects = teacherSubjectsInput.value.split(",").map(s => s.trim()).filter(s => s != "");

            if (short == "") {
                const toast = Toast({
                    text: "The Short Name has to be set!",
                    duration: 3000,
                    position: "right",
                    stopOnFocus: true,
                    gravity: "bottom",
                    style: {
                        background: "linear-gradient(135deg, #ff7373, #f55454)",
                        boxShadow: "0 3px 6px -1px rgba(0, 0, 0, 0.12), 0 10px 36px -4px rgba(232, 77, 77, 0.3)"
                    }
                });
                toast.showToast();
                return;
            }

            const teacherToAdd: Teacher = {
                name: {
                    firstName: firstName,
                    surname: surname,
                    fullName: firstName + " " + surname
                },
                short: short,
                subjects: subjects as Subject[]
            }

            if (TEACHER_DATABASE[this.data.school].find(e => e.short == short)) {
                const toast = Toast({
                    text: "Teacher Allready Exists!",
                    duration: 3000,
                    position: "right",
                    stopOnFocus: true,
                    gravity: "bottom",
                    style: {
                        background: "linear-gradient(135deg, #ff7373, #f55454)",
                        boxShadow: "0 3px 6px -1px rgba(0, 0, 0, 0.12), 0 10px 36px -4px rgba(232, 77, 77, 0.3)"
                    }
                });
                toast.showToast();
                return;
            }

            teacherShortNameInput.value = "";
            teacherFirstNameInput.value = "";
            teacherSurnameInput.value = "";
            teacherSubjectsInput.value = "";

            if (this.searchBar) this.searchBar.value = "";
            TEACHER_DATABASE[this.data.school].push(teacherToAdd);
            this.updateTable();
            if (this.tableStatText) this.tableStatText.innerHTML = TEACHER_DATABASE[this.data.school].length + " of " + TEACHER_DATABASE[this.data.school].length + this.teachersVisibleText;

            const toast = Toast({
                text: "Teacher Added!",
                duration: 3000,
                position: "right",
                stopOnFocus: true,
                gravity: "bottom",
                style: {
                    background: "linear-gradient(135deg, #83ff73ff, #54f554ff)",
                    boxShadow: "0 3px 6px -1px rgba(0, 0, 0, 0.12), 0 10px 36px -4px rgba(90, 232, 77, 0.3)"
                }
            });
            toast.showToast();

        };
        addTeacherDiv.appendChild(addTeacherButton);

        const teacherTable = document.createElement("table");

        this.searchBar = null;

        const titleRow = this.teacherTableHead.insertRow()
        for (const title of ["Short", "First Name", "Surname", "Subjects", ""]) {
            const titleCell = titleRow.insertCell();
            titleCell.innerHTML = title;
            if (title == "Subjects") {
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
                this.teacherTableBody.innerHTML = "";
                this.teacherRows.forEach(row => {
                    const shortNameE = (row.children[0] as HTMLTableCellElement);
                    const firstNameE = (row.children[1] as HTMLTableCellElement);
                    const surnameE = (row.children[2] as HTMLTableCellElement);
                    const subjectsE = (row.children[3] as HTMLTableCellElement);

                    const elements = [shortNameE, firstNameE, surnameE, subjectsE];

                    for (const e of elements) {
                        e.innerText = e.innerText;
                    }
                    this.teacherTableBody.appendChild(row);
                });
                if (this.tableStatText) this.tableStatText.innerHTML = TEACHER_DATABASE[this.data.school].length + " of " + TEACHER_DATABASE[this.data.school].length + this.teachersVisibleText;
            } else {
                const length = value.length;
                this.teacherTableBody.innerHTML = "";
                const filtered = this.teacherRows.filter(row => {

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

                if (this.tableStatText) this.tableStatText.innerHTML = filtered.length + " of " + TEACHER_DATABASE[this.data.school].length + this.teachersVisibleText;

                filtered.forEach(row => {
                    // row.classList.remove("hidden");
                    this.teacherTableBody.appendChild(row);
                });
            }
        };

        this.searchBar?.addEventListener("input", typeEvent);
        this.teacherRows = [];

        this.updateTable();

        teacherTable.appendChild(this.teacherTableHead);
        teacherTable.appendChild(this.teacherTableBody);

        this.tableStatText = document.createElement("span");
        this.tableStatText.classList.add("tableStatText");
        this.tableStatText.innerHTML = TEACHER_DATABASE[this.data.school].length + " of " + TEACHER_DATABASE[this.data.school].length + this.teachersVisibleText;

        this.element.appendChild(addTeacherDiv);
        this.element.appendChild(teacherTable);
        this.element.appendChild(this.tableStatText);

    }

    private updateTable() {
        this.teacherRows.forEach(e => e.remove());
        this.teacherRows = [];

        for (const teacher of TEACHER_DATABASE[this.data.school]) {
            const row = this.teacherTableBody.insertRow();
            const shortName = row.insertCell();
            const firstName = row.insertCell();
            const surname = row.insertCell();
            const subjects = row.insertCell();
            const trash = row.insertCell();

            shortName.innerHTML = teacher.short ? teacher.short : "?"
            surname.innerHTML = teacher.name.surname ? teacher.name.surname : "?";
            firstName.innerHTML = teacher.name.firstName ? teacher.name.firstName : "?";
            subjects.innerHTML = teacher.subjects ? teacher.subjects.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase())).join(", ") : "?";

            const trashDiv = document.createElement("div");
            trashDiv.innerHTML = Images.TRASH;
            trashDiv.classList.add("trash");
            trashDiv.onclick = () => {
                TEACHER_DATABASE[this.data.school] = TEACHER_DATABASE[this.data.school].filter(e => e != teacher);
                const row = this.teacherRows.find((r) => r.teacher == teacher) as HTMLTableRowElement;
                this.teacherRows = this.teacherRows.filter(row => row.teacher != teacher);
                this.teacherTableBody.removeChild(row);
                if (this.tableStatText) this.tableStatText.innerHTML = this.teacherTableBody.children.length + " of " + TEACHER_DATABASE[this.data.school].length + this.teachersVisibleText;
            };
            trash.appendChild(trashDiv);

            const tRow = row as MemoryRow;
            tRow.teacher = teacher;
            this.teacherRows.push(tRow);
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