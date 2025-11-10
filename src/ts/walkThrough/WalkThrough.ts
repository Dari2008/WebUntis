import type { ImageStep, InteractiveStep, Step, TextStep } from "../@types/WalkThrough";
import Utils from "../Utils";

export class WalkThrough {

    private static stepIndex = 0;

    private static imgWrapper: HTMLDivElement;
    private static textWrapper: HTMLDivElement;
    private static currentStep?: Step;
    private static currentSteps?: Step[] = [];
    private static allreadyInit = false;
    private static captures: (() => void)[] = [];

    private static keyEventData: {
        func: (e: KeyboardEvent) => void;
        data: any;
    } | undefined;

    public static startWalkthrough(steps: Step[]) {
        this.currentSteps = steps;
        this.stepIndex = 0;
        this.init();
        this.onStep();

        if (this.keyEventData) {
            window.removeEventListener("keyup", this.keyEventData.func, this.keyEventData.data);
        }
        this.keyEventData = {
            data: { capture: true },
            func: this.keyboardCapture.bind(this)
        };

        window.addEventListener("keyup", this.keyEventData.func, this.keyEventData.data);

    }

    private static keyboardCapture(e: KeyboardEvent) {
        if (!this.currentSteps) return;
        if (!this.currentStep) return;
        if (this.currentSteps.length <= 0) return;
        if (this.stepIndex >= this.currentSteps.length) return;
        if (this.stepIndex < 0) this.stepIndex = 0;
        if (e.code === "ArrowRight" || e.code === "Enter") {
            if ((this.currentStep.stepType == "InteractiveStep" && this.currentStep.dailogData.isLast)
                ||
                ((this.currentStep.stepType == "ImageStep" || this.currentStep.stepType == "TextStep") && this.currentStep.isLast)) {

                this.closeDialogs();
                return;
            }

            if (!(this.currentStep && this.currentStep.onNext?.() === false)) {
                this.nextStep();
            }
        } else if (e.code === "ArrowLeft") {

            if (!(this.currentStep && this.currentStep.onPrev?.() === false)) {
                this.prevStep();
            }
        } else if (e.code == "Escape") {
            this.closeDialogs();
        }
        e.preventDefault();
        e.stopPropagation();
    };

    public static nextStep() {
        this.stepIndex++;
        this.onStep();
    }

    public static prevStep() {
        this.stepIndex--;
        this.onStep();
    }

    private static init() {
        if (this.allreadyInit) return;
        this.allreadyInit = true;

        this.imgWrapper = document.createElement("div");
        this.imgWrapper.classList.add("walk-image-wrapper");
        this.imgWrapper.classList.add("walk-step");

        const img = document.createElement("img");
        img.classList.add("image");
        this.imgWrapper.appendChild(img);
        this.initButtonsAndText(this.imgWrapper);
        document.body.appendChild(this.imgWrapper);



        this.textWrapper = document.createElement("div");
        this.textWrapper.classList.add("walk-text-wrapper");
        this.textWrapper.classList.add("walk-step");
        this.initButtonsAndText(this.textWrapper);
        document.body.appendChild(this.textWrapper);
    }

    private static initButtonsAndText(parent: HTMLElement) {


        const text = document.createElement("span");
        text.classList.add("text");

        const currentProgress = document.createElement("span");
        currentProgress.classList.add("currentProgress");

        const nextBtn = document.createElement("button");
        nextBtn.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!this.currentStep) return;

            if ((this.currentStep.stepType == "InteractiveStep" && this.currentStep.dailogData.isLast)
                ||
                ((this.currentStep.stepType == "ImageStep" || this.currentStep.stepType == "TextStep") && this.currentStep.isLast)) {

                this.closeDialogs();
                return;
            }

            if (this.currentStep) {
                if (this.currentStep.onNext?.() === false) return;
            }

            this.stepIndex++;
            this.onStep();
        });
        nextBtn.classList.add("nextBtn");
        nextBtn.innerHTML = "&#9650;";

        const prevBtn = document.createElement("button");
        prevBtn.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();

            if (this.currentStep) {
                if (this.currentStep.onPrev?.() === false) return;
            }
            this.stepIndex--;
            this.onStep();
        });
        prevBtn.classList.add("prevBtn");
        prevBtn.innerHTML = "&#9650;";

        parent.appendChild(text);
        parent.appendChild(nextBtn);
        parent.appendChild(currentProgress);
        parent.appendChild(prevBtn);

    }

    public static closeDialogs() {
        this.imgWrapper.classList.add("hidden");
        this.textWrapper.classList.add("hidden");
        this.currentSteps = undefined;
        this.currentStep = undefined;
        if (this.keyEventData) {
            window.removeEventListener("keyup", this.keyEventData.func, this.keyEventData.data);
            this.keyEventData = undefined;
        }
        this.captures.forEach(unregister => unregister());
    }

    private static onStep() {
        if (!this.currentSteps) return;
        if (this.stepIndex >= this.currentSteps.length) return;
        if (this.stepIndex < 0) this.stepIndex = 0;
        const newStep = this.currentSteps[this.stepIndex];
        this.currentStep = newStep;

        document.querySelectorAll(".repositionedElement").forEach(e => {
            const uuid = e.getAttribute("data-repositionedElement-uuid");
            e.classList.remove("repositionedElement");
            if (!uuid) return;
            const psData = this.repositionedElement[uuid];
            if (!psData) return;
            if (e instanceof HTMLElement) {
                e.style.position = psData.position;
                e.style.width = psData.width;
                e.style.height = psData.height;
                e.style.top = psData.top;
                e.style.left = psData.left;
                e.style.zIndex = psData.zIndex;
            }
        });

        switch (newStep.stepType) {
            case "ImageStep":
                this.initImageStep(newStep);
                break;
            case "InteractiveStep":
                this.initInteractiveStep(newStep);
                break;
            case "TextStep":
                this.initTextStep(newStep);
                break;
            default:
                break;
        }
    }

    private static initImageStep(data: ImageStep, capture: boolean = true) {
        this.textWrapper.classList.add("hidden");
        this.imgWrapper.classList.remove("hidden");

        const img = this.imgWrapper.querySelector(".image") as HTMLImageElement;
        if (typeof data.img == "string") {
            this.imgWrapper.querySelectorAll(".extra").forEach(e => e.remove());
            img.src = data.img;
            img.classList.remove("hidden");
        } else {
            img.classList.add("hidden");

            const imgElement = data.img;
            imgElement.classList.add("extra");
            this.imgWrapper.appendChild(imgElement);
        }

        if (typeof data.element === "string") {
            data.element = document.querySelector(data.element) as HTMLElement;
        }

        if (data.centeredHorizontally) {
            this.imgWrapper.classList.add("centeredHorizontally");
        } else {
            this.imgWrapper.classList.remove("centeredHorizontally");
        }

        const currentProgress = this.imgWrapper.querySelector(".currentProgress");
        if (currentProgress) {
            currentProgress.innerHTML = (this.stepIndex + 1) + " / " + (this.currentSteps?.length ?? "unknown");
        }

        const text = this.imgWrapper.querySelector(".text") as HTMLSpanElement;
        text.innerHTML = data.text;

        const nextBtn = this.textWrapper.querySelector(".nextBtn") as HTMLElement;
        if (nextBtn) {
            if (data.isLast) {
                nextBtn.innerHTML = "Finish";
                nextBtn.classList.add("textContent");

            } else {
                nextBtn.innerHTML = "&#9650;";
                nextBtn.classList.remove("textContent");
            }
        }

        const prevBtn = this.textWrapper.querySelector(".prevBtn") as HTMLElement;
        if (prevBtn && nextBtn && capture) {
            const unregister = this.startCapture([
                this.textWrapper,
                ...(data.allowedElements ?? []).map(e => {
                    if (typeof e === "string") {
                        return document.querySelector(e);
                    }
                    return e;
                }).filter(e => e instanceof HTMLElement)
            ]);

            const callbackWrapper = () => {
                unregister();
                prevBtn.removeEventListener("click", callbackWrapper);
                nextBtn.removeEventListener("click", callbackWrapper);
            };

            prevBtn.addEventListener("click", callbackWrapper);
            nextBtn.addEventListener("click", callbackWrapper);
        }

        this.setPositionForElement(this.imgWrapper, data.element);

    }

    private static startCapture(elementsToAllow: HTMLElement[]): () => void {
        const caputreEvent = (e: Event) => {
            if (e.target) {
                const allowed = elementsToAllow.some(el => el && el.contains(e.target as Node));
                if (allowed) return;
            }
            e.preventDefault();
            e.stopPropagation();
        };

        const unregisterEvenets = () => {
            window.removeEventListener("click", caputreEvent, attsCapture);
            window.removeEventListener("mouseover", caputreEvent, attsCapture);
        };

        this.captures.forEach(unregister => unregister());
        this.captures.push(unregisterEvenets);

        const attsCapture = { capture: true };
        window.addEventListener("click", caputreEvent, attsCapture);
        window.addEventListener("mouseover", caputreEvent, attsCapture);
        return unregisterEvenets;
    }


    private static initInteractiveStep(data: InteractiveStep) {
        this.imgWrapper.classList.add("hidden");
        this.textWrapper.classList.add("hidden");

        if (typeof data.element === "string") {
            data.element = document.querySelector(data.element) as HTMLElement;
        }

        const parent = data.element;

        switch (data.dailogData.stepType) {
            case "ImageStep":
                this.initImageStep(data.dailogData, false);
                break;
            case "TextStep":
                this.initTextStep(data.dailogData, false);
                break;
        }

        const gotoNextStep = () => {
            this.stepIndex++;
            this.onStep();
        };

        parent.classList.add("interactionTarget");

        const atts = { capture: true, once: true };

        if (!data.block) {
            atts.capture = false;
        }

        const unregister = this.startCapture([
            this.imgWrapper,
            this.textWrapper,
            parent,
            ...(data.allowedElements ?? []).map(e => {
                if (typeof e === "string") {
                    return document.querySelector(e);
                }
                return e;
            }).filter(e => e instanceof HTMLElement)
        ]);

        switch (data.action) {
            case "click":
                const cClick = (e: Event) => {
                    e.preventDefault();
                    e.stopPropagation();
                    // parent.removeEventListener("click", cClick, atts);
                    // gotoNextStep();
                    // setTimeout(() => gotoNextStep(), 50);
                    unregister();
                    data.onAction?.(gotoNextStep);
                };
                parent.addEventListener("click", cClick, atts);
                break;
            case "hover":
                const cOver = (e: MouseEvent) => {
                    e.preventDefault();
                    e.stopPropagation();
                    // parent.removeEventListener("mouseover", cOver, atts);
                    // gotoNextStep();
                    // setTimeout(() => gotoNextStep(), 50);
                    unregister();
                    data.onAction?.(gotoNextStep);
                };
                parent.addEventListener("mouseover", cOver, atts);
                break;
            case "function":
                if (data.onAction) {
                    data.onAction(gotoNextStep);
                    unregister();
                }
                break;
        }

    }

    private static initTextStep(data: TextStep, capture: boolean = true) {
        this.imgWrapper.classList.add("hidden");
        this.textWrapper.classList.remove("hidden");

        if (typeof data.element === "string") {
            data.element = document.querySelector(data.element) as HTMLElement;
        }

        if (data.centeredHorizontally) {
            this.textWrapper.classList.add("centeredHorizontally");
        } else {
            this.textWrapper.classList.remove("centeredHorizontally");
        }


        const text = this.textWrapper.querySelector(".text") as HTMLSpanElement;
        text.innerHTML = data.text;


        const currentProgress = this.textWrapper.querySelector(".currentProgress");
        if (currentProgress) {
            currentProgress.innerHTML = (this.stepIndex + 1) + " / " + (this.currentSteps?.length ?? "unknown");
        }

        const nextBtn = this.textWrapper.querySelector(".nextBtn");
        if (nextBtn) {
            if (data.isLast) {
                nextBtn.innerHTML = "Finish";
                nextBtn.classList.add("textContent");

            } else {
                nextBtn.innerHTML = "&#9650;";
                nextBtn.classList.remove("textContent");
            }
        }

        const prevBtn = this.textWrapper.querySelector(".prevBtn") as HTMLElement;
        if (prevBtn && nextBtn && capture) {
            const unregister = this.startCapture([
                this.textWrapper,
                ...(data.allowedElements ?? []).map(e => {
                    if (typeof e === "string") {
                        return document.querySelector(e);
                    }
                    return e;
                }).filter(e => e instanceof HTMLElement)
            ]);

            const callbackWrapper = () => {
                unregister();
                prevBtn.removeEventListener("click", callbackWrapper);
                nextBtn.removeEventListener("click", callbackWrapper);
            };

            prevBtn.addEventListener("click", callbackWrapper);
            nextBtn.addEventListener("click", callbackWrapper);
        }

        this.setPositionForElement(this.textWrapper, data.element);
    }

    private static repositionedElement: {
        [key: string]: {
            position: string;
            top: string;
            left: string;
            width: string;
            height: string;
            zIndex: string;
        }
    } = {};

    private static setPositionForElement(dialogElement: HTMLElement, parent?: HTMLElement) {
        if (parent) {
            dialogElement.classList.remove("centered");
            parent.classList.add("repositionedElement");
            const uuid = Utils.uuidv4Exclude(Object.keys(this.repositionedElement));
            parent.setAttribute("data-repositionedElement-uuid", uuid);

            // this.repositionedElement[uuid] = {
            //     position: parent.style.position,
            //     top: parent.style.top,
            //     left: parent.style.left,
            //     width: parent.style.width,
            //     height: parent.style.height,
            //     zIndex: parent.style.zIndex,
            // };

            const updatePosition = () => {

                // if (isInitial) {
                //     parent.style.position = "fixed";
                //     parent.style.top = parent.clientTop + "px";
                //     parent.style.left = parent.clientLeft + "px";
                //     parent.style.width = parent.clientWidth + "px";
                //     parent.style.height = parent.clientHeight + "px";
                //     parent.style.zIndex = "10000000000000";
                // }


                const box = parent.getBoundingClientRect();

                const positionAndSize = {
                    top: box.top,
                    left: box.left,
                    width: box.width,
                    height: box.height
                }
                const dialogElementBox = dialogElement.getBoundingClientRect();
                const ownPositionAndSize = {
                    top: dialogElementBox.top,
                    left: dialogElementBox.left,
                    width: dialogElementBox.width,
                    height: dialogElementBox.height
                }

                dialogElement.style.setProperty("--top", positionAndSize.top + "px");
                dialogElement.style.setProperty("--left", positionAndSize.left + "px");
                dialogElement.style.setProperty("--width", positionAndSize.width + "px");
                dialogElement.style.setProperty("--height", positionAndSize.height + "px");

                dialogElement.style.setProperty("--ownTop", ownPositionAndSize.top + "px");
                dialogElement.style.setProperty("--ownLeft", ownPositionAndSize.left + "px");
                dialogElement.style.setProperty("--ownWidth", ownPositionAndSize.width + "px");
                dialogElement.style.setProperty("--ownHeight", ownPositionAndSize.height + "px");

                const windowSize = {
                    width: window.innerWidth,
                    height: window.innerHeight
                };

                const spaceToTop = positionAndSize.top;
                const spaceToLeft = positionAndSize.left;
                const spaceToBottom = windowSize.height - positionAndSize.height - positionAndSize.top;
                const spaceToRight = windowSize.width - positionAndSize.width - positionAndSize.left;

                const shouldUseTop = spaceToTop > spaceToBottom;
                const shouldUseLeft = spaceToLeft > spaceToRight;

                dialogElement.classList.remove(shouldUseTop ? "useBottom" : "useTop");
                dialogElement.classList.remove(shouldUseLeft ? "useRight" : "useLeft");

                dialogElement.classList.add(shouldUseTop ? "useTop" : "useBottom");
                dialogElement.classList.add(shouldUseLeft ? "useLeft" : "useRight");


            };
            updatePosition();

            // parent.addEventListener("animationiteration", () => updatePosition());
            // parent.addEventListener("animationcancel", () => updatePosition());
            // parent.addEventListener("animationend", () => updatePosition());
            // parent.addEventListener("transitionrun", () => updatePosition());
            // parent.addEventListener("transitionstart", () => updatePosition());
            // parent.addEventListener("transitionend", () => updatePosition());

        } else {
            dialogElement.classList.add("centered");
        }
    }


}