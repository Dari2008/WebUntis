import { SettingsTitleElement, type SettingsContentElement, type SettingsTitleData } from "./SettingsTitleElement";

var isDataLoaded = false;

export type SettingsData = {
    id: string;
    label: string;
    selected: boolean;
    options: SettingsTitleData[];
    elements: SettingsContentElement[];
};

export function initForSettings() {


    document.addEventListener("keyup", (e) => {
        const dialog = document.getElementById("settingsDialog") as HTMLDialogElement;
        if (dialog.hasAttribute("show")) {
            if (e.key == "Escape") {
                e.preventDefault();
                toggleSettings();
            }
        }
    });

    document.getElementById("closeSettings")?.addEventListener("click", () => {
        if (!isSettingsMenuOpen()) return;
        toggleSettings();
    });

    document.getElementById("settingsOpenBtn")?.addEventListener("click", () => {
        if (isSettingsMenuOpen()) return;
        toggleSettings();
    });
}


function isSettingsMenuOpen() {
    const dialog = document.getElementById("settingsDialog") as HTMLDialogElement;
    return dialog.hasAttribute("show");
}

function toggleSettings() {
    let settings = document.getElementById("settingsDialog") as HTMLDialogElement;
    if (settings.hasAttribute("show")) {
        settings.removeAttribute("show");
    } else {
        settings.setAttribute("show", "");
    }
}

function switchToSettingsTab(id: string) {
    // $("#settingsList #" + id).click();
}

const ELEMENTS = [];

export function loadSettings(settingOptions: SettingsData[]) {

    let settingsList = document.getElementById("settingsList") as HTMLDivElement;
    let contents = document.getElementById("contents") as HTMLDivElement;

    let elements = [];

    for (let setting of settingOptions) {
        let settingElement = document.createElement("button");
        let borderRemover = document.createElement("div");
        borderRemover.classList.add("borderRemover");
        // if(setting.label.startsWith("#")){
        //     settingElement.innerText = lang.get(setting.label.substring(1));
        //     settingElement.appendChild(borderRemover);
        //     lang.addUpdater(()=>{
        //         settingElement.innerText = lang.get(setting.label.substring(1))
        //         settingElement.appendChild(borderRemover);
        //     });
        // }else{
        //     settingElement.innerText = setting.label || "";
        //     settingElement.appendChild(borderRemover);
        // }

        settingElement.innerText = setting.label || "";
        settingElement.appendChild(borderRemover);

        settingElement.id = setting.id;
        settingsList.appendChild(settingElement);
        settingElement.onclick = () => {

            document.querySelectorAll("#settingsList button")?.forEach(e => e.removeAttribute("selected"));


            settingElement.setAttribute("selected", "");

            contents.innerHTML = "";

            for (let e of setting.elements) {
                contents.appendChild(e.getElement());
            }

        };

        setting.elements = [];
        for (let e of setting.options) {
            let titleElement: SettingsTitleElement = new SettingsTitleElement(e, elements);
            setting.elements.push(titleElement);
            elements.push(titleElement);
        }

        if (setting.selected) {
            settingElement.setAttribute("selected", "");
            settingElement.click();
        }

    }

    ELEMENTS.push(...elements);

    for (let e of elements) {
        if (e.load) e.load();
    }
}

export function loadSetting(setting: SettingsData) {

    let settingsList = document.getElementById("settingsList") as HTMLDivElement;
    let contents = document.getElementById("contents") as HTMLDivElement;

    let elements = [];
    let settingElement = document.createElement("button");
    let borderRemover = document.createElement("div");
    borderRemover.classList.add("borderRemover");
    // if(setting.label.startsWith("#")){
    //     settingElement.innerText = lang.get(setting.label.substring(1));
    //     settingElement.appendChild(borderRemover);
    //     lang.addUpdater(()=>{
    //         settingElement.innerText = lang.get(setting.label.substring(1))
    //         settingElement.appendChild(borderRemover);
    //     });
    // }else{
    //     settingElement.innerText = setting.label || "";
    //     settingElement.appendChild(borderRemover);
    // }

    settingElement.innerText = setting.label || "";
    settingElement.appendChild(borderRemover);

    settingElement.id = setting.id;
    settingsList.appendChild(settingElement);
    settingElement.onclick = () => {

        document.querySelectorAll("#settingsList button")?.forEach(e => e.removeAttribute("selected"));


        settingElement.setAttribute("selected", "");

        contents.innerHTML = "";

        for (let e of setting.elements) {
            contents.appendChild(e.getElement());
        }

    };

    setting.elements = [];
    for (let e of setting.options) {
        let titleElement: SettingsTitleElement = new SettingsTitleElement(e, elements);
        setting.elements.push(titleElement);
        elements.push(titleElement);
    }

    if (setting.selected) {
        settingElement.setAttribute("selected", "");
        settingElement.click();
    }

    ELEMENTS.push(...elements);

    for (let e of elements) {
        if (e.load) e.load();
    }
}
