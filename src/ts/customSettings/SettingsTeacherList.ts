import type { School } from "../@types/School";
import type { Subject, Teacher } from "../@types/Teachers";
import { SettingsElement, type SettingsContentElement, type SettingsFunctionData } from "../settings/SettingsTitleElement";
// import { TEACHER_DATABASE, TEACHER_DATABASE_ARRAY } from "../untis/TeacherDatabase";
import { Images } from "./Images";
import { createInputWithLabel } from "./Utils";
import { UserManagement } from "../userManagement/UserManagement";
import Utils from "../Utils";
import type { UpdateDataTeachers } from "../@types/UserManagement";
import { TEACHERS_PRESETS } from "../presets/TeacherPreset";

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
    private mainMenuWrapper: HTMLDivElement | undefined;

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
            } else if (title == "") {
                titleCell.innerHTML = "+";
                titleCell.classList.add("addTeacherBtn");
                titleCell.onclick = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (!navigator.onLine) {
                        Utils.error("You Are offline and can't change settings");
                        return;
                    }
                    this.mainMenuWrapper?.classList.contains("open") ? this.closeMenu() : this.openMenu();
                };
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
                if (this.tableStatText) this.tableStatText.innerHTML = UserManagement.ALL_DATA!.teachers[this.data.school].length + " of " + UserManagement.ALL_DATA!.teachers[this.data.school].length + this.teachersVisibleText;
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

                if (this.tableStatText) this.tableStatText.innerHTML = filtered.length + " of " + UserManagement.ALL_DATA!.teachers[this.data.school].length + this.teachersVisibleText;

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
        this.tableStatText.innerHTML = UserManagement.ALL_DATA!.teachers[this.data.school].length + " of " + UserManagement.ALL_DATA!.teachers[this.data.school].length + this.teachersVisibleText;




        // Value Presets

        this.mainMenuWrapper = document.createElement("div");
        this.mainMenuWrapper.classList.add("settings-preset-mainMenuWrapper");

        for (const school of Object.keys(TEACHERS_PRESETS) as School[]) {

            const presetButton = document.createElement("button");
            presetButton.classList.add("presetButton");
            presetButton.innerHTML = school;
            presetButton.onclick = () => {
                const data: UpdateDataTeachers = {};
                for (const teacher of TEACHERS_PRESETS[school]) {
                    console.log(teacher);
                    const newBreak: Teacher = {
                        ...teacher,
                        uuid: Utils.uuidv4Exclude(UserManagement.ALL_DATA!.teachers[this.data.school].map(e => e.uuid))
                    };
                    UserManagement.ALL_DATA!.teachers[this.data.school].push(newBreak);
                    if (!data[this.data.school]) data[this.data.school] = [];
                    data[this.data.school].push(newBreak);
                }

                UserManagement.updateBreaks("add", data);
                this.updateTable();
                this.hidePresetSelector();
            };

            this.mainMenuWrapper.appendChild(presetButton);

            // for (const day of Object.keys(BREAKS_PRESETS[school]) as DayName[]) {
            //     for (const breakValue of BREAKS_PRESETS[school][day]) {

            //     }
            // }
        }

        const buttonAddPreset = document.createElement("button");
        buttonAddPreset.classList.add("buttonAddPreset");
        buttonAddPreset.innerHTML = "Add Presets";
        buttonAddPreset.onclick = () => {
            this.showPresetSelector();
        };

        const buttonAddCustomBreak = document.createElement("button");
        buttonAddCustomBreak.classList.add("buttonAddCustomBreak");
        buttonAddCustomBreak.innerHTML = "Add Custom Break";
        buttonAddCustomBreak.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.closeMenu();
            this.addTeacher((short, firstName, surname, subjects) => {
                const teacherToAdd: Teacher = {
                    short: short,
                    name: {
                        firstName: firstName,
                        surname: surname,
                        fullName: (firstName ? firstName : "" + " " + surname ? surname : "").trim()
                    },
                    subjects: subjects,
                    uuid: Utils.uuidv4Exclude(UserManagement.ALL_DATA!.teachers[this.data.school].map(e => e.uuid))
                };
                UserManagement.ALL_DATA?.teachers[this.data.school].push(teacherToAdd);

                const data: UpdateDataTeachers = {
                    [this.data.school]: [teacherToAdd]
                };
                UserManagement.updateTeachers("add", data);

                Utils.success("Teacher added!");


                this.updateTable();
            });
        };

        this.mainMenuWrapper.appendChild(buttonAddPreset);
        this.mainMenuWrapper.appendChild(buttonAddCustomBreak);
        titleRow.appendChild(this.mainMenuWrapper);

        this.element.appendChild(teacherTable);
        this.element.appendChild(this.tableStatText);

    }


    private showPresetSelector() {
        this.mainMenuWrapper?.classList.add("presetSelector");
        this.mainMenuWrapper?.classList.add("open");
        this.addOnclickOutside(this.mainMenuWrapper!, this.hidePresetSelector.bind(this));
    }

    private hidePresetSelector() {
        this.mainMenuWrapper?.classList.remove("open");
        this.mainMenuWrapper?.addEventListener("transitionend", () => {
            this.mainMenuWrapper?.classList.remove("presetSelector");
        }, { once: true });
    }

    private openMenu() {
        this.mainMenuWrapper?.classList.add("open");
        this.addOnclickOutside(this.mainMenuWrapper!, this.closeMenu.bind(this));
    }

    private closeMenu() {
        this.mainMenuWrapper?.classList.remove("open");
    }

    private addOnclickOutside(element: HTMLElement, closeCallback: () => void) {
        const onclick = (e: PointerEvent) => {
            if (!e.target) return;
            if (element.contains(e.target as Node)) return;
            closeCallback();
            document.removeEventListener("click", onclick);
            console.log("Closed", e);
        };
        document.addEventListener("click", onclick);
    }

    private addTeacher(callback: (short: string, firstName: string, surname: string, subjects: Subject[]) => void) {
        const bgWrapper = document.createElement("div");

        const addTeacherDiv = document.createElement("div");

        const title = document.createElement("h2");
        title.innerHTML = "Add Teacher";
        title.classList.add("title");
        addTeacherDiv.appendChild(title);

        const [teacherShortNameInputWrapper, teacherShortNameInput] = createInputWithLabel(undefined, "Short Name", /.{2,4}/, true);
        teacherShortNameInput.className = "teacher-short-name";
        addTeacherDiv.appendChild(teacherShortNameInputWrapper);

        const [teacherFirstNameInputWrapper, teacherFirstNameInput] = createInputWithLabel(undefined, "First Name", /^(\s|.{2,})$/, true);
        teacherFirstNameInput.className = "teacher-first-name";
        addTeacherDiv.appendChild(teacherFirstNameInputWrapper);

        const [teacherSurnameInputWrapper, teacherSurnameInput] = createInputWithLabel(undefined, "Surname", /^(\s|.{2,})$/, true);
        teacherSurnameInput.className = "teacher-surname";
        addTeacherDiv.appendChild(teacherSurnameInputWrapper);

        const [teacherSubjectsInputWrapper, teacherSubjectsInput] = createInputWithLabel(undefined, "Subjects (comma separated)", /^([A-Za-z0-9]{2,5})(,[A-Za-z0-9]{2,5})*$/, false);
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
                Utils.error("The Short Name has to be set!");
                return;
            }

            if (UserManagement.ALL_DATA!.teachers[this.data.school].find(e => e.short == short)) {
                Utils.error("Teacher Already Exists!");
                return;
            }

            teacherShortNameInput.value = "";
            teacherFirstNameInput.value = "";
            teacherSurnameInput.value = "";
            teacherSubjectsInput.value = "";

            callback(short, firstName, surname, subjects as Subject[]);
            document.body.removeChild(bgWrapper);
        };
        addTeacherDiv.appendChild(addTeacherButton);
        addTeacherDiv.classList.add("settings-teachers-addTeacherDiv");

        bgWrapper.classList.add("settings-teachers-bgWrapper");
        bgWrapper.appendChild(addTeacherDiv);
        document.body.appendChild(bgWrapper);


        const onclick = (e: PointerEvent) => {
            if (!e.target) return;
            if (addTeacherDiv.contains(e.target as Node)) return;
            document.removeEventListener("click", onclick);
            document.body.removeChild(bgWrapper);
        };


        document.addEventListener("click", onclick);

    }

    private updateTable() {
        this.teacherRows.forEach(e => e.remove());
        this.teacherRows = [];

        let removedSince: string[] = [];
        let timeoutId = -1;

        for (const teacher of UserManagement.ALL_DATA!.teachers[this.data.school]) {
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
                UserManagement.ALL_DATA!.teachers[this.data.school] = UserManagement.ALL_DATA!.teachers[this.data.school].filter(e => e != teacher);
                removedSince.push(teacher.uuid);
                const row = this.teacherRows.find((r) => r.teacher == teacher) as HTMLTableRowElement;
                this.teacherRows = this.teacherRows.filter(row => row.teacher != teacher);
                this.teacherTableBody.removeChild(row);
                if (this.tableStatText) this.tableStatText.innerHTML = this.teacherTableBody.children.length + " of " + UserManagement.ALL_DATA!.teachers[this.data.school].length + this.teachersVisibleText;
                Utils.success(removedSince.length == 1 ? "Deleted Teacher Successfully" : "Deleted " + removedSince.length + " Teachers Successfully", "teacherDeleteToast");

                if (timeoutId != -1) {
                    clearTimeout(timeoutId);
                }

                timeoutId = setTimeout(() => {
                    UserManagement.updateTeachers("remove", removedSince);
                    removedSince = [];
                }, 500);

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