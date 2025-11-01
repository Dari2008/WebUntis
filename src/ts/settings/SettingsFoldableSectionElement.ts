
import { SETTINGS_ELEMENTS } from "./SettingsGenerator";
import { SettingsTitleElement, type SettingsContentElement, type SettingsTitleData } from "./SettingsTitleElement";


export type SettingsFoldableSectionData = {
    type: "foldableSection",
    name?: string,
    id?: string,
    disabled?: boolean,
    content: SettingsTitleData,
    open?: boolean,
    onchange?: (checked: boolean, getOtherElement: (name: string) => SettingsContentElement | undefined) => void,
    onload?: (checked: boolean, getOtherElement: (name: string) => SettingsContentElement | undefined) => void
};

export class SettingsFoldableSectionElement {


    private element: HTMLHeadingElement;
    private data: SettingsFoldableSectionData;
    private mainElement: HTMLDivElement;
    private contentElement: HTMLDivElement;
    private content: SettingsTitleData;
    private classElement: SettingsTitleElement | undefined;

    private open = false;

    type: string = "foldableSection";


    onchange: (checked: boolean, func: (name: string) => SettingsContentElement | undefined) => void = () => { };
    onload: (checked?: boolean, func?: (name: string) => SettingsContentElement | undefined) => void = () => { }

    constructor(data: SettingsFoldableSectionData) {
        this.mainElement = document.createElement("div");
        this.mainElement.classList.add("settings-foldable-section-element");
        this.element = document.createElement("h" + (data.content.hnumber || 3)) as HTMLHeadingElement;
        this.element.classList.add("settings-title-element");
        this.element.id = data.id || "";

        const updateState = (animate: boolean) => {
            if (this.open) {
                this.mainElement.classList.add("open");
                if (animate) {
                    this.mainElement.classList.add("hasToAnimate");
                    this.mainElement.addEventListener("animationend", () => {
                        this.mainElement.classList.remove("hasToAnimate");
                    }, { once: true });
                }
            }
            else {
                this.mainElement.classList.remove("open");
                if (animate) {
                    this.mainElement.classList.add("hasToAnimate");
                    this.mainElement.addEventListener("animationend", () => {
                        this.mainElement.classList.remove("hasToAnimate");
                    }, { once: true });
                }
            }
        }

        this.element.addEventListener("click", () => {
            this.open = !this.open;
            updateState(true);
        });

        this.open = data.open || false;
        updateState(false);

        // if(data.title.startsWith("#")){
        //     this.element.innerHTML = lang.get(data.title.substring(1));
        //     lang.addUpdater(()=>{
        //         this.element.innerHTML = lang.get(data.title.substring(1));
        //     });
        // }else{
        //     this.element.innerHTML = data.title || "TITLE";
        // }

        this.element.innerHTML = data.content.title || "TITLE";

        this.data = data;
        this.content = data.content || [];

        this.contentElement = document.createElement("div");
        this.contentElement.classList.add("settings-foldable-section-element-content");
        this.parseData();

        this.mainElement.appendChild(this.element);
        this.mainElement.appendChild(this.contentElement);

        if (data.disabled) {
            this.setDisabled(true);
        }

    }

    parseData() {
        this.classElement = new SettingsTitleElement(this.content);
        this.contentElement.appendChild(this.classElement.getElement());
        SETTINGS_ELEMENTS.push(this.classElement);
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
        if (this.classElement) {
            if (this.classElement.load) this.classElement.load();
            if (this.classElement.onload) this.classElement.onload();
        }
    }

}