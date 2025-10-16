import { HOST, SCHOOLS, UNTIS_ACCESSES, type UntisAccess } from "../ScheduleDarius";
import { SettingsElement, type SettingsContentElement, type SettingsFunctionData } from "../settings/SettingsTitleElement";
import { TEACHER_DATABASE, TEACHER_DATABASE_ARRAY, type School, type Subject, type Teacher } from "../untis/TeacherDatabase";
import { Images } from "./Images";
import Toast from "toastify-js";

export type SettingsUntisAccessesListData = SettingsFunctionData & {
    school: School;
}

type MemoryRow = HTMLTableRowElement & {
    untisAccess: UntisAccess;
}

type SchoolData = {
    address: string;
    displayName: string;
    loginName: string;
    mobilServiceUrl: string | null;
    schoolId: string;
    server: string;
    serverUrl: string;
    tenantId: string;
    useMobileServiceUrlAndroid: boolean;
    useMobileServiceUrlIos: boolean;
}

type SchoolDataError = {
    error: {
        code: number;
        message: string;
    };
    message: string;
}

export class SettingsUntisAccessesList extends SettingsElement {
    private element: HTMLDivElement;
    private name: string = "";
    private disabled: boolean = false;
    private data: SettingsUntisAccessesListData;
    private schoolRows: MemoryRow[] = [];
    private schoolTableBody: HTMLTableSectionElement;
    private schoolTableHead: HTMLTableSectionElement;

    constructor(data: SettingsUntisAccessesListData) {
        super();
        this.data = data;
        this.name = data.name;
        this.element = document.createElement("div");
        this.element.className = "settings-untis-accesses-list";
        this.schoolTableHead = document.createElement("thead");
        this.schoolTableBody = document.createElement("tbody");
        this.initElement();
    }

    private initElement() {
        const teacherTable = document.createElement("table");

        const titleRow = this.schoolTableHead.insertRow()
        for (const title of ["School", "School Id", "username", "Password", "Host", ""]) {
            const titleCell = titleRow.insertCell();
            titleCell.innerHTML = title;
            if (title == "") {
                titleCell.innerHTML = "+";
                titleCell.classList.add("examButton");
                titleCell.onclick = () => {
                    this.addUntisAccess((schoolData, username, password) => {
                        const accesses = UNTIS_ACCESSES.get();
                        accesses.push({
                            school: schoolData.displayName as School,
                            schoolId: schoolData.loginName,
                            username: username,
                            password: password,
                            host: schoolData.server || ""
                        });
                        UNTIS_ACCESSES.set(accesses);
                        this.updateTable();
                    });
                };
            }
        }

        this.schoolRows = [];

        this.updateTable();

        teacherTable.appendChild(this.schoolTableHead);
        teacherTable.appendChild(this.schoolTableBody);

        this.element.appendChild(teacherTable);

    }

    private addUntisAccess(callback: (selected: SchoolData, username: string, password: string) => void) {
        let SELECTED: SchoolData | null = null;
        const addUntisAccessDialogWrapper = document.createElement("div");
        addUntisAccessDialogWrapper.classList.add("dialogWrapper");

        const allreadyRequested: {
            [key: string]: SchoolData[];
        } = {};

        const addUntisAccessDialog = document.createElement("div");
        addUntisAccessDialog.classList.add("dialog");

        const usernameInput = document.createElement("input");
        usernameInput.type = "text";
        usernameInput.placeholder = "Username";
        usernameInput.classList.add("username");
        addUntisAccessDialog.appendChild(usernameInput);

        const passwordInput = document.createElement("input");
        passwordInput.type = "password";
        passwordInput.placeholder = "Password";
        passwordInput.classList.add("password");
        addUntisAccessDialog.appendChild(passwordInput);

        const tableWrapper = document.createElement("div");
        tableWrapper.classList.add("tableWrapper");
        addUntisAccessDialog.appendChild(tableWrapper);

        const schoolTable = document.createElement("table");
        schoolTable.classList.add("schoolTable");
        tableWrapper.appendChild(schoolTable);
        const schoolTableHead = document.createElement("thead");
        const schoolTableBody = document.createElement("tbody");
        schoolTable.appendChild(schoolTableHead);
        schoolTable.appendChild(schoolTableBody);

        const titleRow = schoolTableHead.insertRow();
        for (const title of ["School", "School Id", "Address"]) {
            const titleCell = titleRow.insertCell();
            titleCell.innerText = title;
        }

        const title = document.createElement("h2");
        title.innerText = "Add Untis Access";
        addUntisAccessDialog.appendChild(title);

        const schoolInput = document.createElement("input");
        schoolInput.placeholder = "Search School...";
        schoolInput.classList.add("school");
        let timeout = 0;
        schoolInput.oninput = () => {
            const value = schoolInput.value;
            if (value.length < 3) return;

            if (timeout) clearTimeout(timeout);
            timeout = setTimeout(async () => {
                if (allreadyRequested[value]) {
                    updateList(allreadyRequested[value]);
                    return;
                }
                const response = await (await fetch("http://" + HOST + "/untis/querySchools.php?q=" + encodeURIComponent(value), {
                    method: "GET"
                })).json();
                allreadyRequested[value] = response;
                updateList(response);
            }, 200);
        };
        addUntisAccessDialog.appendChild(schoolInput);

        const okBtn = document.createElement("button");
        okBtn.classList.add("addBtn");
        okBtn.innerText = "Add";
        okBtn.disabled = true;
        okBtn.onclick = () => {

            const notify = (msg: string) => {
                const toasts = Toast({
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
            if (SELECTED) {
                if (usernameInput.value.trim() === "" || passwordInput.value.trim() === "") {
                    notify("Username and Password cannot be empty!");
                    return;
                }

                if (UNTIS_ACCESSES.get().find(e => e.schoolId == SELECTED?.loginName)) {
                    notify("You already added this school!");
                    return;
                }

                document.body.removeChild(addUntisAccessDialogWrapper);
                callback(SELECTED, usernameInput.value, passwordInput.value);
            } else {
                notify("Please select a school!");
            }
        };
        addUntisAccessDialog.appendChild(okBtn);

        const cancelbtn = document.createElement("button");
        cancelbtn.classList.add("cancelBtn");
        cancelbtn.innerText = "Cancel";
        cancelbtn.onclick = () => {
            document.body.removeChild(addUntisAccessDialogWrapper);
        };
        addUntisAccessDialog.appendChild(cancelbtn);

        const updateList = (schools: SchoolData[] | SchoolDataError) => {
            schoolTableBody.innerHTML = "";
            if ((schools as SchoolDataError).error) {
                const row = schoolTableBody.insertRow();
                const cell = row.insertCell();
                cell.classList.add("error");
                cell.colSpan = 3;
                cell.innerText = (schools as SchoolDataError).message;
                return;
            }
            for (const schoolData of schools as SchoolData[]) {
                const row = schoolTableBody.insertRow();
                const schoolCell = row.insertCell();
                const schoolIdCell = row.insertCell();
                const usernameCell = row.insertCell();
                schoolCell.innerText = schoolData.displayName;
                schoolIdCell.innerText = schoolData.loginName;
                usernameCell.innerText = schoolData.address;
                row.onclick = () => {
                    SELECTED = schoolData;
                    row.classList.add("selected");
                    okBtn.disabled = false;
                };
            }
        };


        addUntisAccessDialogWrapper.appendChild(addUntisAccessDialog);

        document.body.appendChild(addUntisAccessDialogWrapper);
    }

    private updateTable() {
        this.schoolRows.forEach(e => e.remove());
        this.schoolRows = [];

        for (const untisAccess of UNTIS_ACCESSES.get()) {
            if (!untisAccess) continue;
            const row = this.schoolTableBody.insertRow();
            const school = row.insertCell();
            const schoolId = row.insertCell();
            const username = row.insertCell();
            const password = row.insertCell();
            const host = row.insertCell();
            const trash = row.insertCell();

            school.innerText = untisAccess.school;
            schoolId.innerText = untisAccess.schoolId;
            username.innerText = untisAccess.username;
            password.innerText = "•".repeat(untisAccess.password.length);
            host.innerText = untisAccess.host;


            const trashDiv = document.createElement("div");
            trashDiv.innerHTML = Images.TRASH;
            trashDiv.classList.add("trash");
            trashDiv.onclick = () => {
                UNTIS_ACCESSES.set(UNTIS_ACCESSES.get().filter(e => e == untisAccess));
                const row = this.schoolRows.find((r) => r.untisAccess == untisAccess) as HTMLTableRowElement;
                this.schoolRows = this.schoolRows.filter(row => row.untisAccess != untisAccess);
                this.schoolTableBody.removeChild(row);
            };
            trash.appendChild(trashDiv);

            const tRow = row as MemoryRow;
            tRow.untisAccess = untisAccess;
            this.schoolRows.push(tRow);
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