import { SETTINGS_ELEMENTS } from "./SettingsGenerator";
import type { SettingsContentData, SettingsContentElement } from "./SettingsTitleElement";


export type SettingsNumberSelectorData = {
    type: "number",
    title?: string,
    label: string,
    description: string,
    name?: string,
    id?: string,
    disabled?: boolean,
    autoSave?: boolean,
    onchange?: (value?: string, getOtherElement?: () => SettingsContentElement | undefined) => void,
    onload?: (value?: string, getOtherElement?: (name: string) => SettingsContentElement | undefined) => void
    inputType?: string,
    min?: number,
    max?: number | "auto",
    step?: number,
    increment?: number,
    placeholder?: string,
    value?: string,
    info?: string,
    infoImage?: string,
    validateInput?: (input: string) => string,
    onincrease?: (value: string, getOtherElement: (name: string) => SettingsContentElement | undefined) => string,
    ondecrease?: (value: string, getOtherElement: (name: string) => SettingsContentElement | undefined) => string
};



export class SettingsNumberSelectorElelement {

    private element: HTMLDivElement;
    private title: HTMLHeadingElement;
    private label: HTMLLabelElement;
    private description: HTMLSpanElement;
    private input?: HTMLDivElement;
    private spinnerInput?: HTMLDivElement;
    private decrease?: HTMLButtonElement;
    private decreaseIcon?: HTMLDivElement;
    private inputFieldForSpinner?: HTMLInputElement;
    private inputFielInfo?: HTMLDivElement;
    private inputFielInfoSpan?: HTMLSpanElement;
    private increase?: HTMLButtonElement;
    private increaseIcon?: HTMLDivElement;
    private name: string = "";
    private data: SettingsNumberSelectorData;

    private validateInput: (input: string) => string = (input: string) => { return input; };

    onload: (value?: string, func?: (name: string) => void) => void = (value?: string, func?: (name: string) => void) => { }

    type: string = "number";

    constructor(data: SettingsNumberSelectorData) {

        this.data = data;

        this.validateInput = (input: string) => {
            if (this.data.validateInput) {
                return this.data.validateInput(input);
            } else {
                return input;
            }
        };

        this.element = document.createElement("div");
        this.element.className = "settings-element";

        this.title = document.createElement("h3");
        this.title.classList.add("settings-title");
        this.element.appendChild(this.title);

        // if(data.title.startsWith("#")){
        //     this.title.innerHTML = lang.get(data.title.substring(1));
        //     lang.addUpdater(()=>{
        //         this.title.innerHTML = lang.get(data.title.substring(1))
        //     });
        // }else{
        //     this.title.innerHTML = data.title || "TITLE";
        // }

        this.title.innerHTML = data.title || "TITLE";

        this.label = document.createElement("label");
        this.label.innerHTML = data.label;
        this.label.classList.add("settings-label");
        this.element.appendChild(this.label);

        // if(data.label.startsWith("#")){
        //     this.label.innerHTML = lang.get(data.label.substring(1));
        //     lang.addUpdater(()=>{
        //         this.label.innerHTML = lang.get(data.label.substring(1))
        //     });
        // }else{
        //     this.label.innerHTML = data.label || "LABEL";
        // }
        this.label.innerHTML = data.label || "LABEL";

        this.createNumberSelectorElement(data);

        this.inputFieldForSpinner!.oninput = () => {
            if ((this.data.disabled || false)) return;
            if (this.onchange) this.onchange();
        };

        this.input?.classList.add("settings-input");

        this.description = document.createElement("span");
        this.description.innerHTML = data.description;
        this.description.classList.add("settings-description");
        this.element.appendChild(this.description);

        // if (data.label.startsWith("#")) {
        //     this.description.innerHTML = lang.get(data.description.substring(1));
        //     lang.addUpdater(() => {
        //         this.description.innerHTML = lang.get(data.description.substring(1))
        //     });
        // } else {
        //     this.description.innerHTML = data.description || "DESCRIPTION";
        // }

        this.description.innerHTML = data.description || "DESCRIPTION";
        this.name = data.name || "";

        this.element.id = data.id || "";

        if (data.autoSave || false) {
            if (localStorage.getItem(this.name) != null) {
                this.inputFieldForSpinner!.value = this.validateInput(localStorage.getItem(this.name) || "");
            }
        }

        this.onload = () => {
            if ((this.data.disabled || false)) return;
            (data.onload || ((checked: string, func: (name: string) => SettingsContentElement | undefined) => { }))(this.validateInput(localStorage.getItem(this.name) || ""), this.getOtherElement);
        };

        this.setDisabled(!!data.disabled);
    }

    getElement() {
        return this.element;
    }

    setElement(element: HTMLDivElement) {
        this.element = element;
    }

    // isChecked() {
    //     return this.inputElement.checked;
    // }

    // setChecked(checked) {
    //     this.inputElement.checked = checked;
    //     this.saveState();
    // }

    getName(): string {
        return this.name;
    }

    setName(name: string) {
        this.name = name;
    }

    getOtherElement(name: string = ""): SettingsContentElement | undefined {
        return SETTINGS_ELEMENTS.find(e => e.getName() === name);
    }

    setValue(value: string) {
        this.inputFieldForSpinner!.value = this.validateInput(value);
        this.saveState();
    }

    getValue() {
        return this.validateInput(this.inputFieldForSpinner!.value);
    }

    setVisible(visible: boolean) {
        this.element.setAttribute("visible", visible + "");
    }

    isVisible(): boolean {
        return this.element.getAttribute("visible") == "true";
    }

    createNumberSelectorElement(data: SettingsNumberSelectorData) {

        this.input = document.createElement("div");

        this.spinnerInput = document.createElement("div");
        this.spinnerInput.classList.add("spinnerInput");

        this.decrease = document.createElement("button");
        this.decrease.classList.add("decrease");

        this.decreaseIcon = document.createElement("div");
        this.decrease.appendChild(this.decreaseIcon);

        this.inputFieldForSpinner = document.createElement("input");
        this.inputFieldForSpinner.classList.add("inputFieldForSpinner");
        this.inputFieldForSpinner.type = data.inputType || "text";
        this.inputFieldForSpinner.setAttribute("min", (data.min || 0).toString());
        this.inputFieldForSpinner.setAttribute("max", (data.max || "auto").toString());
        this.inputFieldForSpinner.setAttribute("increment", (data.increment || data.step || 1).toString());
        this.inputFieldForSpinner.placeholder = data.placeholder || "";
        this.inputFieldForSpinner.value = data.value || "1";

        this.inputFielInfo = document.createElement("div");
        this.inputFielInfo.classList.add("inputFielInfo");

        this.inputFielInfo.innerHTML = data.infoImage || "";

        this.inputFielInfoSpan = document.createElement("span");

        // if (data.label.startsWith("#")) {
        //     this.inputFielInfoSpan.innerHTML = lang.get(data.info.substring(1));
        //     lang.addUpdater(() => {
        //         this.inputFielInfoSpan.innerHTML = lang.get(data.info.substring(1))
        //     });
        // } else {
        //     this.inputFielInfoSpan.innerHTML = data.info || "info";
        // }

        this.inputFielInfoSpan.innerHTML = data.info || "info";

        this.inputFielInfo.appendChild(this.inputFielInfoSpan);

        this.increase = document.createElement("button");
        this.increase.classList.add("increase");

        this.increaseIcon = document.createElement("div");
        this.increase.appendChild(this.increaseIcon);

        this.spinnerInput.appendChild(this.decrease);
        this.spinnerInput.appendChild(this.inputFieldForSpinner);
        this.spinnerInput.appendChild(this.inputFielInfo);
        this.spinnerInput.appendChild(this.increase);

        this.input.appendChild(this.spinnerInput);

        this.element.appendChild(this.input);

        this.increase.onclick = () => {
            if ((this.data.disabled || false)) return;
            const result = (this.data.onincrease || ((value: string, getOtherElement: (name: string) => SettingsContentElement | undefined) => { return value; }))(this.validateInput(this.inputFieldForSpinner!.value), this.getOtherElement);
            this.inputFieldForSpinner!.value = this.validateInput(result);
            this.saveState();
            this.onchange();
        };


        this.decrease.onclick = () => {
            if ((this.data.disabled || false)) return;
            const result = (this.data.ondecrease || ((value: string, getOtherElement: (name: string) => SettingsContentElement | undefined) => { return value; }))(this.validateInput(this.inputFieldForSpinner!.value), this.getOtherElement);
            this.inputFieldForSpinner!.value = this.validateInput(result);
            this.saveState();
            this.onchange();
        };

    }

    saveState() {
        if ((this.data.disabled || false)) return;
        if (this.data.autoSave || false) {
            localStorage.setItem(this.name, this.validateInput(this.inputFieldForSpinner!.value));
        }
    }

    onchange() {
        if ((this.data.disabled || false)) return;
        let newValue = this.validateInput(this.inputFieldForSpinner!.value);
        if (this.data.autoSave || false) {
            localStorage.setItem(this.name, newValue);
        }
        this.inputFieldForSpinner!.value = newValue;
        this.data.onchange?.(newValue, this.getOtherElement.bind(this));
    }

    setDisabled(disabled: boolean) {
        this.data.disabled = disabled;
        this.inputFieldForSpinner!.disabled = disabled;

        if (disabled) this.element.setAttribute("disabled", "");
        else this.element.removeAttribute("disabled");
    }

    isDisabled() {
        return this.data.disabled;
    }

}