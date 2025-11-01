import { SETTINGS_ELEMENTS } from "./SettingsGenerator";
import type { SettingsContentElement } from "./SettingsTitleElement";

export type SettingsTextFieldData = {
    type: "textField",
    value?: string,
    label?: string,
    desc?: string,
    title?: string,
    name?: string,
    id?: string,
    disabled?: boolean,
    onload?: (checked: boolean, getOtherElement: (name: string) => SettingsContentElement | undefined) => void,
    onchange?: (newValue: string, getOtherElement: (name: string) => SettingsContentElement | undefined) => void,
    validation?: (value: string) => string,
    inputType?: "email" | "password" | "text",
}

export class SettingsTextFieldElement {


    private data: SettingsTextFieldData;
    private element: HTMLElement;
    private input: HTMLInputElement;

    type: string = "textField";


    onload: (checked?: boolean, func?: (name: string) => SettingsContentElement | undefined) => void = (checked?: boolean, func?: (name: string) => SettingsContentElement | undefined) => { }


    constructor(data: SettingsTextFieldData) {
        this.element = document.createElement("div");
        this.element.classList.add("settings-element");
        this.element.classList.add("settings-textField-element");
        this.element.id = data.id || "";

        this.input = document.createElement("input");
        this.input.type = data.inputType || "text";
        this.input.value = data.value || "";
        this.input.classList.add("settings-textField-input");

        this.input.addEventListener("input", () => {
            const newValue = this.data.validation ? this.data.validation?.(this.input.value) : this.input.value;
            this.data.onchange?.(newValue, this.getOtherElement.bind(this));
            this.input.value = newValue;
        });

        const labelE = document.createElement("span");
        labelE.innerText = data.label || "";
        labelE.classList.add("settings-label");

        const descE = document.createElement("span");
        descE.innerText = data.desc || "";
        descE.classList.add("settings-description");

        const titleE = document.createElement("span");
        titleE.innerText = data.title || "";
        titleE.classList.add("settings-title");

        this.element.appendChild(titleE);
        this.element.appendChild(labelE);
        this.element.appendChild(descE);
        this.element.appendChild(this.input);

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

    getOtherElement(name: string = "") {
        return SETTINGS_ELEMENTS.find(e => e.getName() === name);
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

}