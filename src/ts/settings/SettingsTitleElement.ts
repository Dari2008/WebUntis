import { SettingsColorSelectorElement, type SettingsColorSelectorData } from "./SettingsColorSelectorElement";
import { SettingsFoldableSectionElement, type SettingsFoldableSectionData } from "./SettingsFoldableSectionElement";
import { SETTINGS_ELEMENTS } from "./SettingsGenerator";
import { SettingsNumberSelectorElelement, type SettingsNumberSelectorData } from "./SettingsNumberSelectorElement";
import { SettingsTextElement, type SettingsTextData } from "./SettingsTextElement";
import { SettingsTextFieldElement, type SettingsTextFieldData } from "./SettingsTextFieldElement";
import type { SettingsToggleData } from "./SettingsToggleElement";
import { SettingsToggleElement } from "./SettingsToggleElement";


export type SettingsTitleData = {
    type: "title",
    title: string,
    name?: string,
    id?: string,
    hnumber: number,
    disabled?: boolean,
    content: SettingsContentData[]
};

export type SettingsFunctionData = _SettingsFunctionData & {
    [key: string]: any;
}


type _SettingsFunctionData = {
    type: <T>(data: T) => SettingsElement,
    name: string,
    id?: string,
    disabled?: boolean,
    onload?: (checked: any, getOtherElement: (name: string) => SettingsContentElement | undefined) => void
}

export abstract class SettingsElement {

    type: string = "function";

    onload: (checked?: any, func?: (name: string) => SettingsContentElement | undefined) => void = (checked?: any, func?: (name: string) => SettingsContentElement | undefined) => { };
    onchange: (checked: any, func: (name: string) => SettingsContentElement | undefined) => void = (checked: any, func: (name: string) => SettingsContentElement | undefined) => { };

    // constructor(data: T, elements: SettingsContentElement[]) { }

    abstract getElement(): HTMLDivElement;
    abstract setElement(element: HTMLDivElement): void;
    abstract setTitle(title: string): void;
    abstract getTitle(): string;
    abstract getName(): string;
    abstract setName(name: string): void;
    abstract setDisabled(disabled: boolean): void;
    abstract isDisabled(): boolean;
    abstract setVisible(visible: boolean): void;
    abstract isVisible(): boolean;
    // abstract load(): void;

}

export type SettingsContentElement = SettingsTitleElement | SettingsToggleElement | SettingsNumberSelectorElelement | SettingsColorSelectorElement | SettingsTextElement | SettingsFoldableSectionElement | SettingsTextFieldElement | SettingsElement;
export type SettingsContentData = SettingsTitleData | SettingsToggleData | SettingsNumberSelectorData | SettingsColorSelectorData | SettingsTextData | SettingsFoldableSectionData | SettingsTextFieldData | SettingsFunctionData;

export class SettingsTitleElement {


    private element: HTMLHeadingElement;
    private data: SettingsTitleData;
    private mainElement: HTMLDivElement;
    private contentElement: HTMLDivElement;
    private content: SettingsContentData[] = [];
    private elements: SettingsContentElement[];

    type: string = "title";

    onload: (func?: (name: string) => SettingsContentElement | undefined) => void = (func?: (name: string) => SettingsContentElement | undefined) => { }

    constructor(data: SettingsTitleData) {
        this.mainElement = document.createElement("div");
        this.mainElement.classList.add("settings-title-element-wrapper");
        this.element = document.createElement("h" + (data.hnumber || 3)) as HTMLHeadingElement;
        this.element.classList.add("settings-title-element");
        this.mainElement.id = data.id || "";

        this.elements = [];

        // if(data.title.startsWith("#")){
        //     this.element.innerHTML = lang.get(data.title.substring(1));
        //     lang.addUpdater(()=>{
        //         this.element.innerHTML = lang.get(data.title.substring(1));
        //     });
        // }else{
        //     this.element.innerHTML = data.title || "TITLE";
        // }

        this.element.innerHTML = data.title || "TITLE";

        this.data = data;
        this.content = data.content || [];

        this.contentElement = document.createElement("div");
        this.contentElement.classList.add("settings-title-element-content");
        this.parseData();

        this.mainElement.appendChild(this.element);
        this.mainElement.appendChild(this.contentElement);

        if (data.disabled) {
            this.setDisabled(true);
        }

    }

    parseData() {
        for (let element of this.content) {
            if (element.type === "title") {
                let classElement = new SettingsTitleElement(element);
                this.contentElement.appendChild(classElement.getElement());
                this.elements.push(classElement);
                SETTINGS_ELEMENTS.push(classElement);
            } else if (element.type === "toggle") {
                let classElement = new SettingsToggleElement(element as SettingsToggleData);
                this.contentElement.appendChild(classElement.getElement());
                this.elements.push(classElement);
                SETTINGS_ELEMENTS.push(classElement);
            } else if (element.type === "number") {
                let classElement = new SettingsNumberSelectorElelement(element);
                this.contentElement.appendChild(classElement.getElement());
                this.elements.push(classElement);
                SETTINGS_ELEMENTS.push(classElement);
            } else if (element.type === "color") {
                let classElement = new SettingsColorSelectorElement(element);
                this.contentElement.appendChild(classElement.getElement());
                this.elements.push(classElement);
                SETTINGS_ELEMENTS.push(classElement);
            } else if (element.type === "text") {
                let classElement = new SettingsTextElement(element);
                this.contentElement.appendChild(classElement.getElement());
                this.elements.push(classElement);
                SETTINGS_ELEMENTS.push(classElement);
            } else if (element.type === "foldableSection") {
                let classElement = new SettingsFoldableSectionElement(element);
                this.contentElement.appendChild(classElement.getElement());
                this.elements.push(classElement);
                SETTINGS_ELEMENTS.push(classElement);
            } else if (element.type === "textField") {
                let classElement = new SettingsTextFieldElement(element);
                this.contentElement.appendChild(classElement.getElement());
                this.elements.push(classElement);
                SETTINGS_ELEMENTS.push(classElement);
            } else if (typeof element.type == "function") {
                let classElement: SettingsElement = element.type(element);
                this.contentElement.appendChild(classElement.getElement());
                this.elements.push(classElement);
                SETTINGS_ELEMENTS.push(classElement);
            }
        }
    }

    getElement() {
        return this.mainElement;
    }

    setElement(element: HTMLDivElement) {
        this.mainElement = element;
    }

    setTitle(title: string) {
        this.element.innerHTML = title;
    }

    getTitle() {
        return this.element.innerHTML;
    }

    getName() {
        return this.data.name || "";
    }

    setName(name: string) {
        this.data.name = name;
    }

    setVisible(visible: boolean) {
        this.mainElement.setAttribute("visible", visible + "");
    }

    isVisible(): boolean {
        return this.mainElement.getAttribute("visible") == "true";
    }

    setDisabled(disabled: boolean) {
        this.element.setAttribute("disabled", disabled ? "true" : "false");
        // this.element.disabled = disabled;
    }

    isDisabled() {
        return this.element.getAttribute("disabled") === "true";
    }

    load() {
        for (let element of this.elements) {
            if (element instanceof SettingsTitleElement) {
                element.load();
            }
            if (!element.onload) continue;
            element.onload();
        }
    }

}