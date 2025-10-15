export class ToggleElement extends HTMLElement {

  static get observedAttributes() {
    return ["toggled"];
  }

  private _toggleGroup: any = null;
  private image?: HTMLDivElement = undefined;

  constructor() {
    // @ts-ignore
    super(arguments);
  }

  connectedCallback() {
    this.addEventListener("click", this.toggle);
    this.image = document.createElement("div");
    this.image.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="currentColor"></path></svg>';

    this.appendChild(this.image);

  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (name == "toggled") {
      this.updateImage();
    }
  }

  isToggled() {
    return this.hasAttribute("toggled");
  }

  toggle() {
    if (this.hasAttribute("toggled")) {
      this.removeAttribute("toggled");
    } else {
      this.setAttribute("toggled", "");
    }
    if (this._toggleGroup) {
      let isAllowed = this._toggleGroup.selectElement(this);
      if (!isAllowed) {
        if (this.hasAttribute("toggled")) {
          this.removeAttribute("toggled");
        } else {
          this.setAttribute("toggled", "");
        }
      } else {
        this.dispatchEvent(new CustomEvent("toggle", { detail: this.isToggled() }));
      }
    } else {
      this.dispatchEvent(new CustomEvent("toggle", { detail: this.isToggled() }));
    }

    this.updateImage();
  }

  updateImage() {
    if (this.isToggled()) {
      this.image!.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="currentColor"></path><circle cx="12" cy="12" r="5" fill="currentColor"></circle></svg>';
    } else {
      this.image!.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="currentColor"></path></svg>';
    }
  }

  setToggleGroup(toggleGroup: any) {
    this._toggleGroup = toggleGroup;
  }

}

customElements.define('toggle-element', ToggleElement);

document.addEventListener('documentLoaded', () => {
  let style = document.createElement('style');
  style.textContent = `
    toggle-element{
      border-radius: 100%;
      aspect-ratio: 1/1;
      border: none;
      color: white;
      width: 25px;
      display: block;
    }
    `;
  document.body.appendChild(style);

});