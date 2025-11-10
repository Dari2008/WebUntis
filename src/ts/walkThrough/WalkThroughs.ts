import type { Step } from "../@types/WalkThrough";
import { UserManagement } from "../userManagement/UserManagement";
import { WalkThrough } from "./WalkThrough";

export class WalkThroughs {

    public static INITIAL: Step[] = [
        {
            stepType: "InteractiveStep",
            action: "click",
            element: "header.hamburger",
            block: false,
            dailogData: {
                stepType: "TextStep",
                text: "In the menu, you can view your Timetable, check Grades, manage Settings, or Log out.",
                element: "header.hamburger"
            },
            onAction() {
                const menu = document.querySelector("header.hamburger") as HTMLElement;
                menu.addEventListener("transitionend", () => {
                    WalkThrough.nextStep();
                }, { once: true });
            },
            onNext() {
                const menu = document.querySelector("header.hamburger") as HTMLElement;
                menu.click();
                return false;
            },
            onPrev() {
                WalkThrough.closeDialogs();
            },
        },
        {
            stepType: "TextStep",
            text: "Use this button to log out of your account.",
            allowedElements: ["header.hamburger"],
            element: "#logout",
            onPrev() {
                const menu = document.querySelector("header.hamburger") as HTMLElement;
                menu.addEventListener("transitionend", () => {
                    WalkThrough.prevStep();
                }, { once: true });
                menu.click();
                return false;
            },
        },
        {
            stepType: "InteractiveStep",
            action: "hover",
            block: false,
            element: "#notificationsBell",
            dailogData: {
                stepType: "TextStep",
                text: "Here you can check notifications whenever a lesson changes or an exam is coming up.",
                element: "#notificationsBell"
            }
        },
        {
            stepType: "InteractiveStep",
            action: "click",
            element: "#settingsOpenBtn",
            block: false,
            allowedElements: ["#settingsOpenBtn"],
            dailogData: {
                stepType: "TextStep",
                text: "Let’s explore the Settings where you can customize how the app behaves.",
                element: "#settingsOpenBtn"
            },
            onAction() {
                const settings = document.querySelector("#settingsDialog") as HTMLElement;
                settings.addEventListener("transitionend", () => {
                    WalkThrough.nextStep();
                }, { once: true });
            },
            onNext() {
                const settings = document.querySelector("#settingsOpenBtn") as HTMLElement;
                settings.click();
                return false;
            }
        },
        {
            stepType: "TextStep",
            element: "#schedule",
            centeredHorizontally: true,
            text: "Under <b>Schedule</b>, you can adjust how your timetable is displayed.",
            allowedElements: ["#closeSettings", "header.hamburger"],
            // waitForTarget: "#settingsDialog",
            // waitFor: "transition",
            onPrev() {
                (document.querySelector("#closeSettings") as HTMLElement).click();
                const menu = document.querySelector("header.hamburger") as HTMLElement;
                menu.addEventListener("transitionend", () => {
                    WalkThrough.prevStep();
                }, { once: true });
                menu.click();
                return false;
            },
        },
        {
            stepType: "TextStep",
            element: "#untisAccesses",
            centeredHorizontally: true,
            text: "In <b>Untis Accesses</b>, add your school credentials to connect your account.",
        },
        {
            stepType: "TextStep",
            element: "#breaks",
            centeredHorizontally: true,
            text: "Use <b>Breaks</b> to define custom breaks or load presets for your school.",
        },
        {
            stepType: "TextStep",
            element: "#exams",
            centeredHorizontally: true,
            text: "Here you can add <b>exam dates</b> and assign them to subjects so they appear directly in your timetable.",
        },
        {
            stepType: "TextStep",
            element: "#teachers",
            centeredHorizontally: true,
            text: "Add <b>Teachers</b> here so their names appear directly in your timetable.",
        },
        {
            stepType: "TextStep",
            element: "#appearance",
            centeredHorizontally: true,
            text: "Customize the look of your timetable under <b>Appearance</b>.",
        },
        {
            stepType: "TextStep",
            element: "#notifications",
            centeredHorizontally: true,
            text: "Enable and personalize <b>Notifications</b> here. You can even edit the message text.",
            isLast: true
        }
    ];

    public static SETTINGS_TOOLS: Step[] = [
        {
            stepType: "TextStep",
            allowedElements: ["#contents .settings-foldable-section-element", "#contents .settings-foldable-section-element .settings-foldable-section-element"],
            text: "In the <b>Excuse System</b>, you can create excuse letters for teachers to sign. It automatically pulls data from Untis and calculates which lessons you missed, making it easy to generate accurate absence forms.",
            onNext() {
                const allClickable = document.querySelectorAll("#contents .settings-foldable-section-element .settings-title-element") as NodeListOf<HTMLElement>;
                allClickable.forEach(e => e.click());

                const allAnimationEvents = document.querySelectorAll("#contents .settings-foldable-section-element") as NodeListOf<HTMLElement>;
                allAnimationEvents.item(allAnimationEvents.length - 1).addEventListener("animationend", () => {
                    WalkThrough.nextStep();
                }, { once: true });

                return false;
            },
            onPrev() {
                WalkThrough.closeDialogs();
            },
        },
        {
            stepType: "InteractiveStep",
            action: "click",
            block: false,
            element: ".settings-tools-excuse-system-element .illDayAddBtn",
            allowedElements: ["#contents .settings-foldable-section-element", "#contents .settings-foldable-section-element .settings-foldable-section-element"],
            dailogData: {
                stepType: "TextStep",
                text: "Here you can create a new one",
                element: ".settings-tools-excuse-system-element .illDayAddBtn"
            },
            onNext() {
                const add = document.querySelector(".settings-tools-excuse-system-element .illDayAddBtn") as HTMLElement;
                if (add) {
                    add.click();
                }
            },
            onAction() {

            },
        },
        {
            stepType: "TextStep",
            text: "Use this button to add a new time span, either when you were absent or present at school.",
            element: ".addIllDayDialog .illDayRangeAddBtn",
            isLast: true,
            onPrev() {
                const cancel = document.querySelector(".addIllDayDialog .cancel") as HTMLElement;
                if (cancel) cancel.click();
            },
        }
    ];

    public static SETTINGS_TOOLS_OPEN_ILL_DATE: Step[] = [
        {
            stepType: "TextStep",
            text: "Here you can <b>add</b>, <b>remove</b>, or <b>adjust</b> the lessons you missed to make sure your excuse is accurate."
        },
        {
            stepType: "TextStep",
            text: "You can <b>change</b> the number of missed lessons by clicking the “−” or “+” buttons.",
            element: ".lessonCountCell",
            centeredHorizontally: true
        },
        {
            stepType: "TextStep",
            text: "When a lesson isn’t listed automatically, you can <b>add it manually</b> here.",
            element: ".settings-tools-excuse-system-element tr.open ~ .lessonsToExcuse .addIllLesson"
        },
        {
            stepType: "TextStep",
            text: "When you’ve reviewed everything, you can <b>print</b> the document to have it signed by your teachers.",
            isLast: true,
            element: ".settings-tools-excuse-system-element .open .printBtn"
        }
    ];

    public static SETTINGS_SCHEDULE: Step[] = [
        {
            stepType: "TextStep",
            text: "Here you can set your lessons, specify when they take place and which subjects you have."
        },
        {
            stepType: "TextStep",
            text: "You can see all schools you’ve added in <i>Untis Accesses</i>.",
            element: "#contents .settings-foldable-section-element .settings-title-element",
            allowedElements: ["#contents .settings-foldable-section-element .settings-title-element"],
            centeredHorizontally: true,
            onNext() {
                const firstFoldable = document.querySelector("#contents .settings-foldable-section-element .settings-title-element") as HTMLElement;
                const animationEvent = document.querySelector("#contents .settings-foldable-section-element .settings-foldable-section-element-content") as HTMLElement;
                if (firstFoldable) {
                    animationEvent?.addEventListener("animationend", () => {
                        WalkThrough.nextStep();
                    }, { once: true });
                    firstFoldable.click();
                    return false;
                }
            },
        },
        {
            stepType: "TextStep",
            text: "By clicking the “+” button, you can select which lesson you have.",
            element: ".settings-foldable-section-element.open .settings-schedule div:not(.lessonLoaded):not(.doNotRemove):not(.lesson-time-slot)"
        },
        {
            stepType: "TextStep",
            text: "By clicking a lesson, you remove it from your schedule and can choose a new one.",
            element: ".settings-foldable-section-element.open .settings-schedule div.lessonLoaded",
            isLast: true
        }
    ];

    // public static SETTINGS_UNTIS_ACCESSES: Step[] = [
    //     {
    //         stepType: "TextStep",
    //         text: "Here you can add your school’s Untis account accesses.",
    //         isLast: true
    //     }
    // ];


    public static initTriggers() {
        // this.initUntisAccesses();
        this.initSchedule();
        this.initTools();
        this.initInital();

    }

    // private static initUntisAccesses() {
    //     const untisAccesses = document.querySelector("#untisAccesses") as HTMLElement;
    //     untisAccesses.addEventListener("click", () => {
    //         WalkThrough.startWalkthrough(WalkThroughs.SETTINGS_UNTIS_ACCESSES);
    //     }, { once: true });
    // }

    private static initInital() {
        if (UserManagement.ALL_DATA!.preferences.walkThroughIntitalWatched) return;
        WalkThrough.startWalkthrough(WalkThroughs.INITIAL);
        UserManagement.updatePreferences({
            walkThroughIntitalWatched: true
        });
    }

    private static initSchedule() {

        if (UserManagement.ALL_DATA!.preferences.walkThroughScheduleWatched) return;

        const schedule = document.querySelector("#schedule") as HTMLElement;
        schedule.addEventListener("click", () => {
            WalkThrough.startWalkthrough(WalkThroughs.SETTINGS_SCHEDULE);
            UserManagement.updatePreferences({
                walkThroughScheduleWatched: true
            });
        }, { once: true });
    }


    private static initTools() {
        const tools = document.querySelector("#tools") as HTMLElement;
        if (!UserManagement.ALL_DATA!.preferences.walkThroughToolsWatched) {
            tools.addEventListener("click", () => {
                WalkThrough.startWalkthrough(WalkThroughs.SETTINGS_TOOLS);
                UserManagement.updatePreferences({
                    walkThroughToolsWatched: true
                });
            }, { once: true });
        }

        if (UserManagement.ALL_DATA!.preferences.walkThroughToolsListWatched) return;

        let initTools = false;
        tools.addEventListener("click", () => {
            if (initTools) return;
            initTools = true;

            const illDatesElements = document.querySelectorAll(".settings-tools-excuse-system-element table tbody tr") as NodeListOf<HTMLElement>;

            const unregisterCallbacks: (() => void)[] = [];
            illDatesElements.forEach(e => {
                const callback = () => {
                    unregisterCallbacks.forEach(e => e());
                    WalkThrough.startWalkthrough(WalkThroughs.SETTINGS_TOOLS_OPEN_ILL_DATE);
                    UserManagement.updatePreferences({
                        walkThroughToolsListWatched: true
                    });
                };
                e.addEventListener("click", callback);
                unregisterCallbacks.push(() => {
                    e.removeEventListener("click", callback);
                });
            })
        });
    }

}