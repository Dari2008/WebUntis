export class GestureHandler {
    private element: HTMLElement;
    private startX = 0;
    private startY = 0;
    private threshold = 50;
    private moved = false;

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

    private handleSwipe = (clientX: number, clientY: number) => {
        const deltaX = clientX - this.startX;
        const deltaY = clientY - this.startY;

        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            if (Math.abs(deltaX) > this.threshold) {
                this.moved = true;
                if (deltaX > 0) {
                    this.onSwipeRight();
                    console.log('Swipe Right');
                } else {
                    this.onSwipeLeft();
                    console.log('Swipe Left');
                }
            }
        } else {
            if (Math.abs(deltaY) > this.threshold) {
                this.moved = true;
                if (deltaY > 0) {
                    this.onSwipeDown();
                    console.log('Swipe Down');
                } else {
                    this.onSwipeUp();
                    console.log('Swipe Up');
                }
            }
        }
    };

    private attachListeners() {
        this.element.addEventListener("click", (e) => {
            e.preventDefault();
            this.handleClick(e.clientX, e.clientY);
        });

        this.element.addEventListener("mousedown", (e) => {
            this.handleStart(e.clientX, e.clientY);
        });

        this.element.addEventListener("mouseup", (e) => {
            this.handleSwipe(e.clientX, e.clientY);
        });

        this.element.addEventListener("touchstart", (e) => {
            this.handleStart(e.touches[0].clientX, e.touches[0].clientY);
        });

        this.element.addEventListener("touchend", (e) => {
            this.handleSwipe(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
        });
    }
}
