import { SETTINGS_ELEMENTS } from "./SettingsGenerator";
import type { SettingsContentElement } from "./SettingsTitleElement";
import { HexColorPicker } from "vanilla-colorful";

export type SettingsColorSelectorData = {
    type: "color",
    title?: string,
    label: string,
    description: string,
    name?: string,
    id?: string,
    disabled?: boolean,
    autoSave?: boolean,
    onchange?: (value: Color, getOtherElement: (name: string) => SettingsContentElement | undefined) => void,
    onload?: (value: Color, getOtherElement: (name: string) => SettingsContentElement | undefined) => void
    inputType?: string,
    placeholder?: string,
    color?: string,
};


export type Color = {
    rgba?: { r: number, g: number, b: number, a: number }
    hex?: string
    hsl?: { h: number, s: number, l: number }
}

export function toColor(input: string): Color {
    input = input.trim();

    let color: Color = {};

    function calculateAllFromRGB(r: number, g: number, b: number, a: number = 1): Color {
        let hex = rgbToHex(r, g, b);
        let hsl = rgbToHsl(r, g, b);
        return { hex: hex, rgba: { r: r, g: g, b: b, a: a }, hsl: hsl };
    }

    function rgbToHsl(r: number, g: number, b: number): { h: number, s: number, l: number } {
        r /= 255;
        g /= 255;
        b /= 255;
        let max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h = 0, s = 0, l = (max + min) / 2;
        if (max != min) {
            let d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }
        return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
    }

    function calculateAllFromHSL(h: number, s: number, l: number): Color {
        s /= 100;
        l /= 100;
        let r: number, g: number, b: number;

        if (s === 0) {
            r = g = b = Math.round(l * 255);
        } else {
            let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            let p = 2 * l - q;
            r = Math.round(hueToRgb(p, q, h + 1 / 3) * 255);
            g = Math.round(hueToRgb(p, q, h) * 255);
            b = Math.round(hueToRgb(p, q, h - 1 / 3) * 255);
        }

        return { rgba: { r: r, g: g, b: b, a: 1 }, hex: rgbToHex(r, g, b), hsl: { h: h, s: s, l: l } };
    }

    function hueToRgb(p: number, q: number, t: number): number {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
    }

    function rgbToHex(r: number, g: number, b: number): string {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
    }

    if (input.startsWith("#")) {
        // Hex
        if (input.length == 7) {
            let r = parseInt(input.substring(1, 3), 16);
            let g = parseInt(input.substring(3, 5), 16);
            let b = parseInt(input.substring(5, 7), 16);
            color = calculateAllFromRGB(r, g, b);
        } else if (input.length == 4) {
            let r = parseInt(input.substring(1, 2) + input.substring(1, 2), 16);
            let g = parseInt(input.substring(2, 3) + input.substring(2, 3), 16);
            let b = parseInt(input.substring(3, 4) + input.substring(3, 4), 16);
            color = calculateAllFromRGB(r, g, b);
        }
    } else if (input.startsWith("rgb")) {
        // rgb or rgba
        let values = input.substring(input.indexOf("(") + 1, input.indexOf(")")).split(",");
        if (values.length == 3 || values.length == 4) {
            let r = parseInt(values[0].trim());
            let g = parseInt(values[1].trim());
            let b = parseInt(values[2].trim());
            let a = values.length == 4 ? parseFloat(values[3].trim()) : 1;
            color = calculateAllFromRGB(r, g, b, a);
        }
    } else if (input.startsWith("hsl")) {
        // hsl or hsla
        let values = input.substring(input.indexOf("(") + 1, input.indexOf(")")).split(",");
        if (values.length == 3 || values.length == 4) {
            let h = parseInt(values[0].trim());
            let s = parseInt(values[1].trim().replace("%", ""));
            let l = parseInt(values[2].trim().replace("%", ""));
            color = calculateAllFromHSL(h, s, l);
        }
    }

    input = input.toUpperCase();

    color.hex = input.startsWith("#") ? input : color.hex;
    return color;
}

export class SettingsColorSelectorElement {

    private element: HTMLDivElement;
    private title: HTMLHeadingElement;
    private label: HTMLLabelElement;
    private description: HTMLSpanElement;
    private name: string = "";
    private data: SettingsColorSelectorData;
    // private colorpicker: HexColorPicker;
    private divWrapper: HTMLDivElement;
    private currentColorDiv: HTMLDivElement
    private resetBtn: HTMLButtonElement;

    private currentColor: string = "#000000";

    private validateInput: (input: string) => Color = (input: string) => { return toColor(input); };

    onload: (value?: Color, func?: (name: string) => void) => void = (value?: Color, func?: (name: string) => void) => { }

    type: string = "color";
    onchange: (value?: Color, func?: (name: string) => SettingsContentElement | undefined) => void = (value?: Color, func?: (name: string) => SettingsContentElement | undefined) => { };



    constructor(data: SettingsColorSelectorData) {

        this.data = data;

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

        this.divWrapper = document.createElement("div");
        this.divWrapper.classList.add("settings-inputOnlyGridWrapper");


        this.currentColorDiv = document.createElement("div");
        this.currentColorDiv.classList.add("settings-current-color");

        this.resetBtn = document.createElement("button");
        this.resetBtn.classList.add("settings-current-color-reset");
        this.resetBtn.innerHTML = "&#x21BA;";
        this.resetBtn.title = "Reset to default";

        this.divWrapper.appendChild(this.currentColorDiv);
        this.divWrapper.appendChild(this.resetBtn);

        this.resetBtn.onclick = () => {
            this.currentColor = data.color || "#000000";
            this._onchange();
        }

        this.currentColorDiv.onclick = () => {

            document.querySelectorAll("dialog.settings-color-dialog").forEach(d => (d as HTMLDialogElement).close());

            const dialog = document.createElement("dialog");
            dialog.classList.add("settings-color-dialog");

            const title = document.createElement("h2");
            title.innerText = data.title || "";
            title.classList.add("settings-color-dialog-title");

            const desc = document.createElement("span");
            desc.innerText = data.description || "";
            desc.classList.add("settings-color-dialog-desc");

            dialog.onclick = (e) => {
                if (e.target === dialog) {
                    dialog.close();
                    dialog.remove();
                }
            };

            const picker = new HexColorPicker();
            picker.color = this.currentColor;
            picker.addEventListener("color-changed", (e) => {
                this.currentColor = e.detail.value;
                this._onchange();
            });

            dialog.appendChild(title);
            dialog.appendChild(picker);
            dialog.appendChild(desc);

            document.body.appendChild(dialog);
            dialog.showModal();

        };

        this.element.appendChild(this.divWrapper);


        // this.colorpicker = document.createElement("hex-color-picker") as HexColorPicker;
        // this.colorpicker.addEventListener("color-changed", (event: CustomEvent) => {
        //     console.log(event.detail.value);
        //     // this.saveState();
        //     this._onchange();
        // });

        // this.colorpicker.classList.add("settings-inputOnlyGrid");

        // this.colorpicker.color = data.color || "#000000";
        this.currentColor = data.color || "#000000";
        this.currentColorDiv.style.backgroundColor = this.currentColor;

        // this.element.appendChild(this.colorpicker);

        if (data.autoSave || false) {
            if (localStorage.getItem(this.name) == null) {
                // this.currentColor = data.color || "#000000";
                this.setValue(data.color || "#000000");
            } else {
                const colorString = localStorage.getItem(this.name) || "";
                if (!colorString) {
                    localStorage.setItem(this.name, JSON.stringify(this.validateInput(this.currentColor)));
                } else {
                    const colorParsed = JSON.parse(colorString) as Color;
                    this.currentColor = colorParsed.hex || this.currentColor;
                    this.currentColorDiv.style.backgroundColor = this.currentColor;
                }
            }
        }

        this.onload = () => {
            if ((this.data.disabled || false)) return;
            (data.onload || ((value: Color, func: (name: string) => SettingsContentElement | undefined) => { }))(this.validateInput(this.currentColor), this.getOtherElement);
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
        // this.colorpicker.color = this.validateInput(value).hex || "#000000";
        this.currentColor = this.validateInput(value).hex || "#000000";
        this.currentColorDiv.style.backgroundColor = this.currentColor;
        this.saveState();
    }

    getValue() {
        return this.validateInput(this.currentColor);
    }

    saveState() {
        if ((this.data.disabled || false)) return;
        if (this.data.autoSave || false) {
            localStorage.setItem(this.name, JSON.stringify(this.validateInput(this.currentColor)));
        }
    }

    _onchange() {
        if ((this.data.disabled || false)) return;
        let newValue = this.validateInput(this.currentColor);
        if (this.data.autoSave || false) {
            localStorage.setItem(this.name, JSON.stringify(newValue));
        }
        this.currentColor = newValue.hex || "";
        this.currentColorDiv.style.backgroundColor = this.currentColor;
        this.data.onchange?.(newValue, this.getOtherElement.bind(this));
    }

    setVisible(visible: boolean) {
        this.element.setAttribute("visible", visible + "");
    }

    isVisible(): boolean {
        return this.element.getAttribute("visible") == "true";
    }

    setDisabled(disabled: boolean) {
        this.data.disabled = disabled;
        // this.element.setAttribute("disabled", disabled ? "true" : "false");

        if (disabled) this.element.setAttribute("disabled", "");
        else this.element.removeAttribute("disabled");
    }

    isDisabled() {
        return this.data.disabled;
    }

}