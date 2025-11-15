export class GestureHandler {
    private element: HTMLElement;
    private startX = 0;
    private startY = 0;
    private swipeHorizontallyThreashold = 50;
    private swipeVerticallyThreashold = window.innerHeight / 3;
    private moved = false;

    public static IS_DARGGING_CURRENTLY = false;

    onClick: (x: number, y: number) => void = () => { };
    onSwipeLeft: () => void = () => { };
    onSwipeRight: () => void = () => { };
    onSwipeUp: () => void = () => { };
    onSwipeDown: () => void = () => { };

    constructor(element: HTMLElement) {
        this.element = element;
        this.attachListeners();
    }

    private handleClick = (clientX: number, clientY: number) => {
        if (!this.moved) {
            this.onClick(clientX, clientY);
        }
    };

    private handleStart = (clientX: number, clientY: number) => {
        this.startX = clientX;
        this.startY = clientY;
        this.moved = false;
    };

    private handleSwipe = (e: Event, clientX: number, clientY: number) => {
        const deltaX = clientX - this.startX;
        const deltaY = clientY - this.startY;

        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            if (Math.abs(deltaX) > this.swipeHorizontallyThreashold) {
                this.moved = true;
                GestureHandler.IS_DARGGING_CURRENTLY = true;
                if (deltaX > 0) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    this.onSwipeRight();
                } else {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    this.onSwipeLeft();
                }
            } else {
                GestureHandler.IS_DARGGING_CURRENTLY = false;
            }
        } else {
            if (Math.abs(deltaY) > this.swipeVerticallyThreashold) {
                this.moved = true;
                GestureHandler.IS_DARGGING_CURRENTLY = true;
                if (deltaY > 0) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    this.onSwipeDown();
                } else {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    this.onSwipeUp();
                }
            } else {
                GestureHandler.IS_DARGGING_CURRENTLY = false;
            }
        }
    };

    private attachListeners() {
        this.element.addEventListener("click", (e) => {
            this.handleClick(e.clientX, e.clientY);
        }, { capture: true, });

        this.element.addEventListener("mousedown", (e) => {
            this.handleStart(e.clientX, e.clientY);
        }, { capture: true, });

        this.element.addEventListener("mouseup", (e) => {
            this.handleSwipe(e, e.clientX, e.clientY);
        }, { capture: true, });

        this.element.addEventListener("touchstart", (e) => {
            this.handleStart(e.touches[0].clientX, e.touches[0].clientY);
        }, { capture: true, });

        this.element.addEventListener("touchend", (e) => {
            this.handleSwipe(e, e.changedTouches[0].clientX, e.changedTouches[0].clientY);
        }, { capture: true, });
    }
}
