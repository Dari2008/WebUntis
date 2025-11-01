import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat.js";
import { SettingsElement, type SettingsFunctionData } from "../settings/SettingsTitleElement";
import { SyntaxInputField, type Command } from "../syntaxInputField/SyntaxInputField";
dayjs.extend(customParseFormat);

export type SettingsNotificationMessageLayoutData = SettingsFunctionData & {
    label?: string;
    onchange: (newValue: string) => void;
    onEnableStateChange?: (enabled: boolean) => void;
    defaultValue?: string;
    isEnabled?: boolean;
    additionalCommands: Command[];
}

export class SettingsNotificationMessageLayoutElement extends SettingsElement {
    private element: HTMLDivElement;
    private name: string = "";
    private disabled: boolean = false;
    private data: SettingsNotificationMessageLayoutData;
    private toggleElement: HTMLLabelElement | undefined;

    constructor(data: SettingsNotificationMessageLayoutData) {
        super();
        this.data = data;
        this.element = document.createElement("div");
        this.element.classList.add("settings-notification-message-layout-element");
        this.initElements();
    }


    createToggleElement(checked?: boolean, onclick?: (checked: boolean) => void): HTMLLabelElement {

        const inputLabel = document.createElement("label");
        inputLabel.classList.add("switch");

        const toggleElement = document.createElement("input");
        toggleElement.type = "checkbox";
        toggleElement.checked = checked || false;
        toggleElement.onclick = () => onclick?.(toggleElement.checked);
        toggleElement.classList.add("inputElement");

        inputLabel.appendChild(toggleElement);

        let slider = document.createElement("div");
        slider.classList.add("slider");


        let circle = document.createElement("div");
        circle.classList.add("circle");

        circle.innerHTML = `
            <svg class="cross" xml:space="preserve" style="enable-background:new 0 0 512 512" viewBox="0 0 365.696 365.696" y="0" x="0" height="6" width="6" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" xmlns="http://www.w3.org/2000/svg">
                <g>
                    <path data-original="#000000" fill="currentColor" d="M243.188 182.86 356.32 69.726c12.5-12.5 12.5-32.766 0-45.247L341.238 9.398c-12.504-12.503-32.77-12.503-45.25 0L182.86 122.528 69.727 9.374c-12.5-12.5-32.766-12.5-45.247 0L9.375 24.457c-12.5 12.504-12.5 32.77 0 45.25l113.152 113.152L9.398 295.99c-12.503 12.503-12.503 32.769 0 45.25L24.48 356.32c12.5 12.5 32.766 12.5 45.247 0l113.132-113.132L295.99 356.32c12.503 12.5 32.769 12.5 45.25 0l15.081-15.082c12.5-12.504 12.5-32.77 0-45.25zm0 0"></path>
                </g>
            </svg>
            <svg class="checkmark" xml:space="preserve" style="enable-background:new 0 0 512 512" viewBox="0 0 24 24" y="0" x="0" height="10" width="10" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" xmlns="http://www.w3.org/2000/svg">
                <g>
                    <path class="" data-original="#000000" fill="currentColor" d="M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z"></path>
                </g>
            </svg>
        `;

        slider.appendChild(circle);
        inputLabel.appendChild(slider);

        return inputLabel;
    }

    public setEnabled(enabled: boolean) {
        if (this.toggleElement) {
            const input = this.toggleElement.querySelector("input");
            if (input) {
                input.checked = enabled;
            }
        }
    }

    private initElements() {

        const label = this.data.label || "";

        let changeTimeout = -1;

        this.toggleElement = this.createToggleElement(this.data.isEnabled ?? false, (checked) => {
            if (changeTimeout != -1) {
                clearTimeout(changeTimeout);
            }

            changeTimeout = setTimeout(() => {
                this.data.onEnableStateChange?.(checked);
            }, 500);
        });

        const labelE = document.createElement("span");
        labelE.innerText = label;
        labelE.classList.add("settings-notification-message-layout-label");

        const syntaxInputField = new SyntaxInputField(this.data.additionalCommands);
        let lastTimeoutId = -1;
        syntaxInputField.onchange = (newValue: string) => {
            if (lastTimeoutId != -1) {
                clearTimeout(lastTimeoutId);
            }

            lastTimeoutId = setTimeout(() => {
                this.data.onchange(newValue);
            }, 2000);

        };

        syntaxInputField.setValue(this.data.defaultValue || "");

        this.element.appendChild(labelE);
        this.element.appendChild(this.toggleElement);
        this.element.appendChild(syntaxInputField.getElement());
        this.element.appendChild(syntaxInputField.getCompletionElement());

    }

    getElement(): HTMLDivElement {
        console.log(this.element);
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