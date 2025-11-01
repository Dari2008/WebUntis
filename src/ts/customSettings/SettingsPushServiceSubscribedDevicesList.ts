import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat.js";
import { SettingsElement, type SettingsContentElement, type SettingsFunctionData } from "../settings/SettingsTitleElement";
import { Images } from "./Images";
import Utils from "../Utils";
import { PushService, type PushSubscriptionData } from "../notifications/PushService";
import type { SettingsToggleElement } from "../settings/SettingsToggleElement";
import { SETTINGS_ELEMENTS } from "../settings/SettingsGenerator";
dayjs.extend(customParseFormat);

export type SettingsPushServiceSubscribedDevicesListData = SettingsFunctionData & {
    allSubscribers: PushSubscriptionData[];
}

type MemoryRow = HTMLTableRowElement & {
    endpointData: PushSubscriptionData;
};

export class SettingsPushServiceSubscribedDevicesList extends SettingsElement {
    private element: HTMLDivElement;
    private name: string = "";
    private disabled: boolean = false;
    private subscribedDevicesTableBody: HTMLTableSectionElement;
    private subscribedDevicesTableHead: HTMLTableSectionElement;
    private devicesRows: MemoryRow[] = [];
    private data: SettingsPushServiceSubscribedDevicesListData;

    constructor(data: SettingsPushServiceSubscribedDevicesListData) {
        super();
        this.data = data;
        this.element = document.createElement("div");
        this.element.classList.add("settings-push-service-subscribed-devices-list");
        this.subscribedDevicesTableBody = document.createElement("tbody");
        this.subscribedDevicesTableHead = document.createElement("thead");
        this.initElements();

    }

    public addSelf() {
        if (PushService.pushSubscription) this.data.allSubscribers.push(PushService.pushSubscription);
        this.updateTable();
    }

    public removedSelf(endpoint: string) {
        this.data.allSubscribers = this.data.allSubscribers.filter(e => e.endpoint != endpoint);
        this.updateTable();
    }

    private initElements() {
        const teacherTable = document.createElement("table");

        const titleRow = this.subscribedDevicesTableHead.insertRow()
        for (const title of ["Browser Name", "OS Name", "Platform", ""]) {
            const titleCell = titleRow.insertCell();
            titleCell.innerHTML = title;
        }
        this.updateTable();

        teacherTable.appendChild(this.subscribedDevicesTableHead);
        teacherTable.appendChild(this.subscribedDevicesTableBody);


        this.element.appendChild(teacherTable);

    }


    private updateTable() {
        this.devicesRows.forEach(e => e.remove());
        this.devicesRows = [];

        for (const endpointData of this.data.allSubscribers) {
            const row = this.subscribedDevicesTableBody.insertRow();
            const browserName = row.insertCell();
            const osName = row.insertCell();
            const platform = row.insertCell();
            const trash = row.insertCell();

            browserName.innerHTML = endpointData.userAgentData.browserName ? endpointData.userAgentData.browserName : "?"
            osName.innerHTML = endpointData.userAgentData.osName ? endpointData.userAgentData.osName : "?";
            platform.innerHTML = endpointData.userAgentData.platform ? endpointData.userAgentData.platform : "?";

            const trashDiv = document.createElement("div");
            trashDiv.innerHTML = Images.TRASH;
            trashDiv.classList.add("trash");
            trashDiv.onclick = () => {

                if (endpointData.endpoint == PushService.pushSubscription?.endpoint) {
                    for (const element of SETTINGS_ELEMENTS) {
                        if (element.getName() == "enableNotificationsOnThisDevice") {
                            (element as SettingsToggleElement).setChecked(false);
                        }
                    }
                }

                PushService.removePushSubscription(endpointData);
                const row = this.devicesRows.find((r) => r.endpointData == endpointData) as HTMLTableRowElement;
                this.devicesRows = this.devicesRows.filter(row => row.endpointData != endpointData);

                this.data.allSubscribers = this.data.allSubscribers.filter(e => e.endpoint != endpointData.endpoint);

                this.subscribedDevicesTableBody.removeChild(row);
                Utils.success("Removed Device from subscribed devices!");
            };
            trash.appendChild(trashDiv);

            const tRow = row as MemoryRow;
            tRow.endpointData = endpointData;
            this.devicesRows.push(tRow);
        }

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