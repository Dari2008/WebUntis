export function createInputWithLabel(id: string | undefined, label: string, regex: RegExp, isRequired: boolean = false,): [HTMLDivElement, HTMLInputElement] {
    const wrapper = document.createElement("div");
    wrapper.classList.add("inputWithLabel-wrapper");
    wrapper.setAttribute("data-label", label);

    if (isRequired) {
        const span = document.createElement("span");
        span.classList.add("inputWithLabel-asterisk");
        span.textContent = "*";
        wrapper.appendChild(span);
    }

    const input = document.createElement("input");
    input.id = id || "";
    input.required = isRequired;
    input.pattern = regex.source;
    input.placeholder = "";

    wrapper.appendChild(input);
    return [wrapper, input];
}
