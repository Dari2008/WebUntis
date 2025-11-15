import { SETTINGS_ELEMENTS } from "./SettingsGenerator";
import type { SettingsContentElement } from "./SettingsTitleElement";

export type SettingsButtonData = {
    type: "button",
    label?: string,
    desc?: string,
    title?: string,
    name?: string,
    id?: string,
    buttonText: string;
    disabled?: boolean,
    onclick?: (getOtherElement: (name: string) => SettingsContentElement | undefined) => void,
}

export class SettingsButtonElement {


    private data: SettingsButtonData;
    private element: HTMLElement;
    private button: HTMLButtonElement;

    type: string = "textField";


    onload: (checked?: boolean, func?: (name: string) => SettingsContentElement | undefined) => void = () => { }


    constructor(data: SettingsButtonData) {
        this.element = document.createElement("div");
        this.element.classList.add("settings-element");
        this.element.classList.add("settings-textField-element");
        this.element.id = data.id || "";

        this.button = document.createElement("button");
        this.button.classList.add("settings-button-input");
        this.button.innerHTML = data.buttonText;

        this.button.addEventListener("click", () => {
            if (data.onclick) data.onclick(this.getOtherElement.bind(this));
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
        this.element.appendChild(this.button);

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