import { SettingsColorSelectorElement, type SettingsColorSelectorData } from "./SettingsColorSelectorElement";
import { SettingsNumberSelectorElelement, type SettingsNumberSelectorData } from "./SettingsNumberSelectorElement";
import { SettingsTextElement, type SettingsTextData } from "./SettingsTextElement";
import type { SettingsToggleData } from "./SettingsToggleElement";
import { SettingsToggleElement } from "./SettingsToggleElement";


export type SettingsTitleData = {
    type: "title",
    title: string,
    name?: string,
    id?: string,
    hnumber: number,
    disabled?: boolean,
    content: SettingsContentData[],
    onchange?: (checked: boolean, getOtherElement: (name: string) => SettingsContentElement | undefined) => void,
    onload?: (checked: boolean, getOtherElement: (name: string) => SettingsContentElement | undefined) => void
};

export type SettingsFunctionData = _SettingsFunctionData & {
    [key: string]: any;
}


type _SettingsFunctionData = {
    type: <T>(data: T, elements: SettingsContentElement[]) => SettingsElement,
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

export type SettingsContentElement = SettingsTitleElement | SettingsToggleElement | SettingsNumberSelectorElelement | SettingsColorSelectorElement | SettingsTextElement | SettingsElement;
export type SettingsContentData = SettingsTitleData | SettingsToggleData | SettingsNumberSelectorData | SettingsColorSelectorData | SettingsTextData | SettingsFunctionData;

export class SettingsTitleElement {


    private element: HTMLHeadingElement;
    private data: SettingsTitleData;
    private elements: SettingsContentElement[] = [];
    private mainElement: HTMLDivElement;
    private contentElement: HTMLDivElement;
    private content: SettingsContentData[] = [];

    type: string = "title";


    onchange: (checked: boolean, func: (name: string) => SettingsContentElement | undefined) => void = (checked: boolean, func: (name: string) => SettingsContentElement | undefined) => { };
    onload: (checked?: boolean, func?: (name: string) => SettingsContentElement | undefined) => void = (checked?: boolean, func?: (name: string) => SettingsContentElement | undefined) => { }

    constructor(data: SettingsTitleData, elements: SettingsContentElement[]) {
        this.elements = elements;
        this.mainElement = document.createElement("div");
        this.element = document.createElement("h" + (data.hnumber || 3)) as HTMLHeadingElement;
        this.element.classList.add("settings-title-element");
        this.element.id = data.id || "";

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
                let classElement = new SettingsTitleElement(element, this.elements);
                this.contentElement.appendChild(classElement.getElement());
                this.elements.push(classElement);
            } else if (element.type === "toggle") {
                let classElement = new SettingsToggleElement(element as SettingsToggleData, this.elements);
                this.contentElement.appendChild(classElement.getElement());
                this.elements.push(classElement);
            } else if (element.type === "number") {
                let classElement = new SettingsNumberSelectorElelement(element, this.elements);
                this.contentElement.appendChild(classElement.getElement());
                this.elements.push(classElement);
            } else if (element.type === "color") {
                let classElement = new SettingsColorSelectorElement(element, this.elements);
                this.contentElement.appendChild(classElement.getElement());
                this.elements.push(classElement);
            } else if (element.type === "text") {
                let classElement = new SettingsTextElement(element, this.elements);
                this.contentElement.appendChild(classElement.getElement());
                this.elements.push(classElement);
            } else if (typeof element.type == "function") {
                let classElement: SettingsElement = element.type(element, this.elements);
                this.contentElement.appendChild(classElement.getElement());
                this.elements.push(classElement);
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
        this.element.setAttribute("visible", visible + "");
    }

    isVisible(): boolean {
        return this.element.getAttribute("visible") == "true";
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
            if (!element.onload) continue;
            element.onload();
        }
    }

}