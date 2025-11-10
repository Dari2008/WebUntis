export type Step = ImageStep | InteractiveStep | TextStep;

export type ImageStep = {
    stepType: "ImageStep";
    img: HTMLImageElement | string;
    text: string;
    element?: HTMLElement | string;
    centeredHorizontally?: true;
    isLast?: true;
    allowedElements?: (HTMLElement | string)[];
    onNext?: () => boolean | void;
    onPrev?: () => boolean | void;
}

export type InteractiveStep = {
    stepType: "InteractiveStep";
    element: HTMLElement | string;
    block: boolean;
    action: "click" | "hover" | "function";
    onAction?: (continueCallback: (() => void)) => void;
    allowedElements?: (HTMLElement | string)[];
    dailogData: ImageStep | TextStep;
    onNext?: () => boolean | void;
    onPrev?: () => boolean | void;
}

export type TextStep = {
    stepType: "TextStep";
    element?: HTMLElement | string;
    centeredHorizontally?: true;
    text: string;
    isLast?: true;
    allowedElements?: (HTMLElement | string)[];
    onNext?: () => boolean | void;
    onPrev?: () => boolean | void;
}