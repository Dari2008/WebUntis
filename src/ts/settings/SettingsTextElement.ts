import type { SettingsContentData, SettingsContentElement } from "./SettingsTitleElement";

export type SettingsTextData = {
    type: "text",
    text: string,
    name?: string,
    id?: string,
    elementType: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span",
    disabled?: boolean,
    onload?: (checked: boolean, getOtherElement: (name: string) => SettingsContentElement | undefined) => void
}

export class SettingsTextElement {


    private data: SettingsTextData;
    private elements: SettingsContentElement[] = [];
    private element: HTMLElement;

    type: string = "text";


    onload: (checked?: boolean, func?: (name: string) => SettingsContentElement | undefined) => void = (checked?: boolean, func?: (name: string) => SettingsContentElement | undefined) => { }

    constructor(data: SettingsTextData, elements: SettingsContentElement[]) {
        this.elements = elements;
        this.element = document.createElement(data.elementType) as HTMLElement;
        this.element.classList.add("settings-title-element");
        this.element.id = data.id || "";
        this.element.innerHTML = data.text || "";

        // if(data.title.startsWith("#")){
        //     this.element.innerHTML = lang.get(data.title.substring(1));
        //     lang.addUpdater(()=>{
        //         this.element.innerHTML = lang.get(data.title.substring(1));
        //     });
        // }else{
        //     this.element.innerHTML = data.title || "TITLE";
        // }

        this.data = data;

        if (data.disabled) {
            this.setDisabled(true);
        }

    }

    getElement() {
        return this.element;
    }

    setElement(element: HTMLDivElement) {
        this.element = element;
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