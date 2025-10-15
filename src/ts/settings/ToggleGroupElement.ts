import type { ToggleElement } from "./ToggleElement";

export class ToggleGroupElement extends HTMLElement {

    private toggleElements: HTMLElement[] = [];
    private _selectedElement: HTMLElement | null = null;

    constructor() {
        //@ts-ignore
        super(arguments);
    }

    connectedCallback() {
        let observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type != 'childList') return;
                const target = mutation.target as HTMLElement;
                if (mutation.addedNodes.length > 0) {
                    if (target.role == 'toggle') {
                        if (target.tagName == 'TOGGLE-ELEMENT') {
                            if (this.toggleElements.indexOf(mutation.target as HTMLElement) == -1) {
                                this.addToggleElement(mutation.target as ToggleElement);
                            }
                        } else if (target.tagName === 'DIV') {
                            for (let i = 0; i < target.children.length; i++) {
                                if (target.children[i].tagName == 'TOGGLE-ELEMENT') {
                                    if (this.toggleElements.indexOf(target.children[i] as HTMLElement) == -1) {
                                        this.addToggleElement(target.children[i] as ToggleElement);
                                    }
                                }
                            }
                        }
                    } else {
                        for (let i = 0; i < mutation.addedNodes.length; i++) {
                            if ((mutation.addedNodes[i] as HTMLElement).tagName) {
                                if ((mutation.addedNodes[i] as HTMLElement).tagName == 'TOGGLE-ELEMENT') {
                                    if (this.toggleElements.indexOf(target.children[i] as HTMLElement) == -1) {
                                        this.addToggleElement(target.children[i] as ToggleElement);
                                    }
                                }
                            }
                        }

                    }
                }
            });
        });
        observer.observe(this, { childList: true, subtree: true });
    }

    selectElement(element: HTMLElement) {
        let isSelected = element.hasAttribute('toggled');
        if (this._selectedElement == element) {
            if (isSelected) {
                return true;
            } else {
                return false;
            }
        } else if (!this._selectedElement) {
            if (isSelected) {
                this._selectedElement = element;
                return true;
            }
            return false;
        } else {
            if (isSelected) {
                this._selectedElement.removeAttribute('toggled');
                this._selectedElement = element;
                return true;
            } else {
                return true;
            }
        }
    }

    getValues() {
        let values: {
            [key: string]: boolean;
        } = {};
        this.toggleElements.forEach((element) => {
            values[element.id || element.getAttribute("name")!] = element.hasAttribute('toggled');
        });
        return values;
    }

    getSelectedValue() {
        if (!this._selectedElement) return null;
        return this._selectedElement.id || this._selectedElement.getAttribute('name');
    }

    addToggleElement(toggle: ToggleElement) {
        this.toggleElements.push(toggle);
        toggle.setToggleGroup(this);
    }

    getSelectedElement() {
        return this._selectedElement;
    }
}

customElements.define('toggle-group-element', ToggleGroupElement);