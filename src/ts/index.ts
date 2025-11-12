import { formatDate } from "date-fns";
import { HTMLTableManager } from "./htmlTable/HtmlTableManager";
// import { SCHEDULE } from "./ScheduleDarius_old";
import UntisManager, { type TempLesson } from "./untis/UntisManager"
import UntisSchedule from "./untis/UntisSchedule";
import { initSettings } from "./settings/settingsLoader";
import { v4 } from "uuid";
import type { CompiledLesson } from "./@types/Schedule";
import { UserManagement } from "./userManagement/UserManagement";
import Utils from "./Utils";
import { SWManager } from "./SWManager";
import { GestureHandler } from "./gestures/gestures";
import NotificationManager from "./notificationManager/NotificationManager";
import { AllLessonsManager } from "./untis/AllLessonsManager";
import { HolidayLoader } from "./untis/HolidayLoader";
import type { UntisAccess } from "./@types/UntisAccess";
import { WalkThroughs } from "./walkThrough/WalkThroughs";
import dayjs from "dayjs";
// import { HolidayLoader } from "./untis/HolidayLoader";

window.addEventListener("online", () => {
    document.documentElement.classList.remove("offlineMode");
});

window.addEventListener("offline", () => {
    document.documentElement.classList.add("offlineMode");
});

if (!navigator.onLine) {
    document.documentElement.classList.add("offlineMode");
}

export class UntisCombiner {


    private static MIN_LIMIT_TABLES = 0;
    private static MAX_LIMIT_TABLES = 0;

    private static MIN_LIMIT_SET = false;
    private static MAX_LIMIT_SET = false;


    private static currentIndexOfWeek: number = 0;

    private static lessonsLoaded: {
        [key: string]: UntisSchedule[];
    } = {};

    private static currentlyLoadingHtmlTableManagers: {
        [key: string]: Promise<HTMLTableManager | null>;
    } = {};

    private static updateLimits(week: number) {
        UntisCombiner.MIN_LIMIT_TABLES = Math.min(UntisCombiner.MIN_LIMIT_TABLES, week);
        UntisCombiner.MAX_LIMIT_TABLES = Math.max(UntisCombiner.MAX_LIMIT_TABLES, week);
    }

    private static CURRENT_SCHEDULE: HTMLTableManager | null = null;
    private static UNTIS_MANAGERS: UntisManager[] = [];
    private static htmlTableManagers: HTMLTableManager[] = [];
    private static timeSchedule: HTMLElement;

    public static async loadSchedules(forceOfflineLoad: boolean = false) {
        if (forceOfflineLoad) {
            const manager = await UntisCombiner.createHtmlTableManagerForDate({
                date: new Date(),
                week: 0
            }, forceOfflineLoad);
            if (manager) {
                UntisCombiner.htmlTableManagers.push(manager);
                if (manager.tableElement) UntisCombiner.timeSchedule.appendChild(manager.tableElement);
                manager.tableElement?.classList.add("currentSchedule");
                manager.updateCurrentDayPosition();
                UntisCombiner.CURRENT_SCHEDULE = manager;
            }
            return;
        }

        for (const date of [{ week: 0, date: new Date() }, { week: -1, date: UntisCombiner.getWeeksFriday(new Date(), -1) }, { week: 1, date: UntisCombiner.getWeeksMonday(new Date(), 1) }]) {
            if (date.week != 0) {
                const promise = UntisCombiner.createHtmlTableManagerForDate(date);
                UntisCombiner.currentlyLoadingHtmlTableManagers[date.week + ""] = promise;
                promise.then(manager => {
                    if (!manager) return;
                    UntisCombiner.updateLimits(date.week);
                    UntisCombiner.htmlTableManagers.push(manager);
                    delete UntisCombiner.currentlyLoadingHtmlTableManagers[date.week + ""];
                });
            }

            if (date.week == 0) {
                UntisCombiner.currentlyLoadingHtmlTableManagers = {};
                const oldTableManagers = UntisCombiner.htmlTableManagers;
                UntisCombiner.htmlTableManagers = [];
                UntisCombiner.lessonsLoaded = {};
                const manager = await UntisCombiner.createHtmlTableManagerForDate(date);
                if (!manager) continue;
                UntisCombiner.updateLimits(date.week);

                UntisCombiner.timeSchedule.innerHTML = "";
                oldTableManagers.forEach(e => e.tableElement?.remove());

                UntisCombiner.htmlTableManagers.push(manager);
                if (manager.tableElement) UntisCombiner.timeSchedule.appendChild(manager.tableElement);
                manager.tableElement?.classList.add("currentSchedule");
                manager.updateCurrentDayPosition();
                UntisCombiner.CURRENT_SCHEDULE = manager;
            }

        }
    }

    private static async loadAll(forceOfflineLoad: boolean) {
        UntisCombiner.timeSchedule = document.getElementById("timeSchedule") as HTMLElement;
        if (!UntisCombiner.timeSchedule) return;
        const loadedData = await UserManagement.loadData(forceOfflineLoad);
        console.log(Object.values(loadedData).length > 0);
        if (Object.values(loadedData).length > 0) {

            UntisCombiner.UNTIS_MANAGERS = [];

            for (const untisManagerData of UserManagement.ALL_DATA!.untisAccesses) {
                const manager = new UntisManager(untisManagerData);
                UntisCombiner.UNTIS_MANAGERS.push(manager);
            }

            const HOLIDAY_LOADER = new HolidayLoader(UntisCombiner.UNTIS_MANAGERS);
            if (UserManagement.ALL_DATA) {
                UserManagement.ALL_DATA.holidays = await HOLIDAY_LOADER.getHolidays();
            }

            await UntisCombiner.loadSchedules(forceOfflineLoad);

        } else {
            if (!forceOfflineLoad) {
                Utils.error("Failed to load Data From Account");
            }
            (document.getElementById("loadingAnimation") as HTMLDialogElement).showModal();
            return;
        }
    }

    public static async init() {

        const loadingDialog = document.getElementById("loadingAnimation") as HTMLDialogElement;

        loadingDialog?.showModal(); // loading...

        UserManagement.init(); // Check if User logged in

        UntisCombiner.initWindowSize();

        await UntisCombiner.loadAll(true);

        loadingDialog?.close();

        await UntisCombiner.loadAll(false);

        if (UserManagement.ALL_DATA) {
            SWManager.install(UserManagement.ALL_DATA!.preferences.notificationsEnabled);
            NotificationManager.initNotificationManager();
        }


        UntisCombiner.initGestures();
        UntisCombiner.initLogoutBtn();

        await initSettings();
        WalkThroughs.initTriggers();
        if (loadingDialog?.open) loadingDialog?.close();

    }

    private static initWindowSize() {
        window.addEventListener("resize", () => {
            document.body.style.setProperty("--windowHeight", window.innerHeight + "px");
            document.body.style.setProperty("--windowWidth", window.innerWidth + "px");
        });
        document.body.style.setProperty("--windowHeight", window.innerHeight + "px");
        document.body.style.setProperty("--windowWidth", window.innerWidth + "px");
    }

    public static async loadHtmlTableManagerForCurrentIndexOfWeek() {
        if (UntisCombiner.MIN_LIMIT_SET && UntisCombiner.MAX_LIMIT_SET) return;
        const nextPreviousIndex = UntisCombiner.currentIndexOfWeek - 1;
        const nextNextIndex = UntisCombiner.currentIndexOfWeek + 1;

        const foundNextPrevious = UntisCombiner.htmlTableManagers.find((manager) => {
            return manager.week == nextPreviousIndex;
        });
        const foundNextNext = UntisCombiner.htmlTableManagers.find((manager) => {
            return manager.week == nextNextIndex;
        });

        if (!foundNextNext && !UntisCombiner.MAX_LIMIT_SET) {
            const manager = await UntisCombiner.createHtmlTableManagerForDate({
                date: UntisCombiner.getWeeksMonday(new Date(), nextNextIndex),
                week: nextNextIndex
            });
            if (manager) {
                UntisCombiner.updateLimits(nextNextIndex);
                UntisCombiner.htmlTableManagers.push(manager);
            } else {
                UntisCombiner.MAX_LIMIT_SET = true;
            }
        }

        if (!foundNextPrevious && !UntisCombiner.MIN_LIMIT_SET) {
            const manager = await UntisCombiner.createHtmlTableManagerForDate({
                date: UntisCombiner.getWeeksFriday(new Date(), nextPreviousIndex),
                week: nextPreviousIndex
            });
            if (manager) {
                UntisCombiner.updateLimits(nextPreviousIndex);
                UntisCombiner.htmlTableManagers.push(manager);
            } else {
                UntisCombiner.MIN_LIMIT_SET = true;
            }
        }
    }


    public static initGestures() {
        const timeSchedule = document.getElementById("timeSchedule");
        if (!timeSchedule) return;
        const swipeGesture = new GestureHandler(timeSchedule);
        swipeGesture.onSwipeLeft = () => {
            if (UntisCombiner.CURRENT_SCHEDULE && UntisCombiner.CURRENT_SCHEDULE.tableElement && UntisCombiner.CURRENT_SCHEDULE.tableElement.classList.contains("onlyShow")) {

                let currentDayShowing = UntisCombiner.CURRENT_SCHEDULE.tableElement.getAttribute("data-dateShown");
                let nextDay = (() => {
                    if (!currentDayShowing) return "tuesday";
                    switch (currentDayShowing.toLowerCase()) {
                        case "monday": return "tuesday";
                        case "tuesday": return "wednesday";
                        case "wednesday": return "thursday";
                        case "thursday": return "friday";
                        case "friday": return "monday";
                    }
                    return "tuesday";
                })();
                if (!currentDayShowing) return;
                if (nextDay == "monday") {
                    const nextManager = UntisCombiner.animateToNext();
                    if (nextManager && nextManager.tableElement) {
                        nextManager.tableElement.classList.add("onlyShow");
                        nextManager.tableElement.setAttribute("data-dateShown", nextDay);
                        nextManager.tableElement.classList.remove(currentDayShowing);
                        nextManager.tableElement.classList.add(nextDay);
                        UserManagement.ALL_DATA!.schools.filter(e => !!nextManager.tableElement?.querySelector("." + e.toLowerCase().replaceAll(" ", "_") + "." + nextDay)).sort().forEach((school, i) => {
                            nextManager.tableElement?.style.setProperty("--schoolIndex" + school.toLowerCase().replaceAll(" ", "_"), i + "");
                        });

                        const schoolShownCount = UserManagement.ALL_DATA!.schools.map(e => UntisCombiner.CURRENT_SCHEDULE!.tableElement!.querySelector("." + e.toLowerCase().replaceAll(" ", "_") + "." + nextDay)).filter(e => !!e).length;
                        nextManager.tableElement?.style.setProperty("--schoolsShownCount", schoolShownCount + "");

                    }
                    return;
                }

                UntisCombiner.CURRENT_SCHEDULE.tableElement.classList.add("onlyShow");
                UntisCombiner.CURRENT_SCHEDULE.tableElement.setAttribute("data-dateShown", nextDay);
                UntisCombiner.CURRENT_SCHEDULE.tableElement.classList.add("animate");
                UntisCombiner.CURRENT_SCHEDULE.tableElement.querySelectorAll(".lesson." + nextDay).forEach(e => e.classList.add("fadeInNext"));
                UntisCombiner.CURRENT_SCHEDULE.tableElement.querySelectorAll(".break." + nextDay + ":not(.lessonTime)").forEach(e => e.classList.add("fadeInNext"));
                UntisCombiner.CURRENT_SCHEDULE.tableElement.querySelectorAll(".lesson." + currentDayShowing).forEach(e => e.classList.add("fadeOutNext"));
                UntisCombiner.CURRENT_SCHEDULE.tableElement.querySelectorAll(".break." + currentDayShowing + ":not(.lessonTime)").forEach(e => e.classList.add("fadeOutNext"));
                UntisCombiner.CURRENT_SCHEDULE.tableElement.classList.add("next-" + nextDay);

                const currentSchoolCount = parseInt(UntisCombiner.CURRENT_SCHEDULE.tableElement.style.getPropertyValue("--schoolsShownCount")) || 0;
                const newSchoolCount = UserManagement.ALL_DATA!.schools.map(e => UntisCombiner.CURRENT_SCHEDULE!.tableElement!.querySelector("." + e.toLowerCase().replaceAll(" ", "_") + "." + nextDay)).filter(e => !!e).length
                let classAdded = "";

                if (currentSchoolCount > newSchoolCount) {
                    classAdded = "removedTimeColumn";
                } else if (currentSchoolCount < newSchoolCount) {
                    classAdded = "addedTimeColumn";
                }

                if (classAdded) {
                    UntisCombiner.CURRENT_SCHEDULE.tableElement.classList.add(classAdded);
                }


                UntisCombiner.CURRENT_SCHEDULE.tableElement.addEventListener("animationend", () => {
                    UntisCombiner.CURRENT_SCHEDULE!.tableElement!.classList.add(nextDay);
                    UntisCombiner.CURRENT_SCHEDULE!.tableElement!.classList.remove("animate");
                    UntisCombiner.CURRENT_SCHEDULE!.tableElement!.classList.remove(currentDayShowing);
                    UntisCombiner.CURRENT_SCHEDULE!.tableElement!.querySelectorAll(".lesson." + nextDay).forEach(e => e.classList.remove("fadeInNext"));
                    UntisCombiner.CURRENT_SCHEDULE!.tableElement!.querySelectorAll(".break." + nextDay + ":not(.lessonTime)").forEach(e => e.classList.remove("fadeInNext"));
                    UntisCombiner.CURRENT_SCHEDULE!.tableElement!.querySelectorAll(".lesson." + currentDayShowing).forEach(e => e.classList.remove("fadeOutNext"));
                    UntisCombiner.CURRENT_SCHEDULE!.tableElement!.querySelectorAll(".break." + currentDayShowing + ":not(.lessonTime)").forEach(e => e.classList.remove("fadeOutNext"));
                    UntisCombiner.CURRENT_SCHEDULE!.tableElement!.classList.remove("next-" + nextDay);

                    if (classAdded) UntisCombiner.CURRENT_SCHEDULE!.tableElement!.classList.remove(classAdded);

                    UserManagement.ALL_DATA!.schools.filter(e => !!UntisCombiner.CURRENT_SCHEDULE!.tableElement?.querySelector("." + e.toLowerCase().replaceAll(" ", "_") + "." + nextDay)).sort().forEach((school, i) => {
                        UntisCombiner.CURRENT_SCHEDULE!.tableElement?.style.setProperty("--schoolIndex" + school.toLowerCase().replaceAll(" ", "_"), i + "");
                    });

                    const schoolShownCount = newSchoolCount;
                    UntisCombiner.CURRENT_SCHEDULE?.tableElement?.style.setProperty("--schoolsShownCount", schoolShownCount + "");
                });
                const schoolShownCount = newSchoolCount;
                UntisCombiner.CURRENT_SCHEDULE?.tableElement?.style.setProperty("--animateToSchoolsShownCount", schoolShownCount + "");
            } else {
                UntisCombiner.animateToNext();
            }
        };
        swipeGesture.onSwipeRight = () => {
            if (UntisCombiner.CURRENT_SCHEDULE && UntisCombiner.CURRENT_SCHEDULE.tableElement && UntisCombiner.CURRENT_SCHEDULE.tableElement.classList.contains("onlyShow")) {

                let currentDayShowing = UntisCombiner.CURRENT_SCHEDULE.tableElement.getAttribute("data-dateShown");
                let prevDay = (() => {
                    if (!currentDayShowing) return "tuesday";
                    switch (currentDayShowing.toLowerCase()) {
                        case "monday": return "friday";
                        case "tuesday": return "monday";
                        case "wednesday": return "tuesday";
                        case "thursday": return "wednesday";
                        case "friday": return "thursday";
                    }
                    return "tuesday";
                })();
                if (!currentDayShowing) return;

                if (prevDay == "friday") {
                    const prevManager = UntisCombiner.animateToPrevious();
                    if (prevManager && prevManager.tableElement) {
                        prevManager.tableElement.classList.add("onlyShow");
                        prevManager.tableElement.setAttribute("data-dateShown", prevDay);
                        prevManager.tableElement.classList.remove(currentDayShowing);
                        prevManager.tableElement.classList.add(prevDay);
                        UserManagement.ALL_DATA!.schools.filter(e => !!prevManager.tableElement?.querySelector("." + e.toLowerCase().replaceAll(" ", "_") + "." + prevDay)).sort().forEach((school, i) => {
                            prevManager.tableElement?.style.setProperty("--schoolIndex" + school.toLowerCase().replaceAll(" ", "_"), i + "");
                        });

                        const schoolShownCount = UserManagement.ALL_DATA!.schools.map(e => UntisCombiner.CURRENT_SCHEDULE!.tableElement!.querySelector("." + e.toLowerCase().replaceAll(" ", "_") + "." + prevDay)).filter(e => !!e).length;
                        prevManager.tableElement?.style.setProperty("--schoolsShownCount", schoolShownCount + "");

                    }
                    return;
                }

                UntisCombiner.CURRENT_SCHEDULE.tableElement.classList.add("onlyShow");
                UntisCombiner.CURRENT_SCHEDULE.tableElement.setAttribute("data-dateShown", prevDay);
                UntisCombiner.CURRENT_SCHEDULE.tableElement.classList.add("animate");
                UntisCombiner.CURRENT_SCHEDULE.tableElement.querySelectorAll(".lesson." + prevDay).forEach(e => e.classList.add("fadeInPrev"));
                UntisCombiner.CURRENT_SCHEDULE.tableElement.querySelectorAll(".break." + prevDay + ":not(.lessonTime)").forEach(e => e.classList.add("fadeInPrev"));
                UntisCombiner.CURRENT_SCHEDULE.tableElement.querySelectorAll(".lesson." + currentDayShowing).forEach(e => e.classList.add("fadeOutPrev"));
                UntisCombiner.CURRENT_SCHEDULE.tableElement.querySelectorAll(".break." + currentDayShowing + ":not(.lessonTime)").forEach(e => e.classList.add("fadeOutPrev"));
                UntisCombiner.CURRENT_SCHEDULE.tableElement.classList.add("next-" + prevDay);

                const currentSchoolCount = parseInt(UntisCombiner.CURRENT_SCHEDULE.tableElement.style.getPropertyValue("--schoolsShownCount")) || 0;
                const newSchoolCount = UserManagement.ALL_DATA!.schools.map(e => UntisCombiner.CURRENT_SCHEDULE!.tableElement!.querySelector("." + e.toLowerCase().replaceAll(" ", "_") + "." + prevDay)).filter(e => !!e).length
                let classAdded = "";

                if (currentSchoolCount > newSchoolCount) {
                    classAdded = "removedTimeColumn";
                } else if (currentSchoolCount < newSchoolCount) {
                    classAdded = "addedTimeColumn";
                }

                if (classAdded) {
                    UntisCombiner.CURRENT_SCHEDULE.tableElement.classList.add(classAdded);
                }

                UntisCombiner.CURRENT_SCHEDULE.tableElement.addEventListener("animationend", () => {
                    UntisCombiner.CURRENT_SCHEDULE!.tableElement!.classList.add(prevDay);
                    UntisCombiner.CURRENT_SCHEDULE!.tableElement!.classList.remove("animate");
                    UntisCombiner.CURRENT_SCHEDULE!.tableElement!.classList.remove(currentDayShowing);
                    UntisCombiner.CURRENT_SCHEDULE!.tableElement!.querySelectorAll(".lesson." + prevDay).forEach(e => e.classList.remove("fadeInPrev"));
                    UntisCombiner.CURRENT_SCHEDULE!.tableElement!.querySelectorAll(".break." + prevDay + ":not(.lessonTime)").forEach(e => e.classList.remove("fadeInPrev"));
                    UntisCombiner.CURRENT_SCHEDULE!.tableElement!.querySelectorAll(".lesson." + currentDayShowing).forEach(e => e.classList.remove("fadeOutPrev"));
                    UntisCombiner.CURRENT_SCHEDULE!.tableElement!.querySelectorAll(".break." + currentDayShowing + ":not(.lessonTime)").forEach(e => e.classList.remove("fadeOutPrev"));
                    UntisCombiner.CURRENT_SCHEDULE!.tableElement!.classList.remove("next-" + prevDay);
                    if (classAdded) UntisCombiner.CURRENT_SCHEDULE!.tableElement!.classList.remove(classAdded);

                    UserManagement.ALL_DATA!.schools.filter(e => !!UntisCombiner.CURRENT_SCHEDULE!.tableElement?.querySelector("." + e.toLowerCase().replaceAll(" ", "_") + "." + prevDay)).sort().forEach((school, i) => {
                        UntisCombiner.CURRENT_SCHEDULE!.tableElement?.style.setProperty("--schoolIndex" + school.toLowerCase().replaceAll(" ", "_"), i + "");
                    });

                    const schoolShownCount = newSchoolCount;
                    UntisCombiner.CURRENT_SCHEDULE?.tableElement?.style.setProperty("--schoolsShownCount", schoolShownCount + "");
                });
                const schoolShownCount = newSchoolCount;
                UntisCombiner.CURRENT_SCHEDULE?.tableElement?.style.setProperty("--animateToSchoolsShownCount", schoolShownCount + "");
            } else {
                UntisCombiner.animateToPrevious();
            }
        };
    }


    public static getCurrentTableManager(offset: number = 0) {
        const weekIndex = UntisCombiner.currentIndexOfWeek + offset;
        return UntisCombiner.htmlTableManagers.find(e => e.week === weekIndex);
    }
    public static getNextTableManager() {
        return UntisCombiner.getCurrentTableManager(1);
    }
    public static getPreviousTableManager() {
        return UntisCombiner.getCurrentTableManager(-1);
    }

    private static currentlyAnimates = false;


    public static animateToPrevious(): HTMLTableManager | false {

        if (UntisCombiner.currentIndexOfWeek <= UntisCombiner.MIN_LIMIT_TABLES) {
            return false;
        }
        if (UntisCombiner.currentlyAnimates) return false;

        const currentManager = UntisCombiner.getCurrentTableManager();
        const prevManager = UntisCombiner.getPreviousTableManager();

        if (prevManager) UntisCombiner.CURRENT_SCHEDULE = prevManager;

        const currentSchedule = currentManager?.tableElement;
        const prevSchedule = prevManager?.tableElement;

        UntisCombiner.currentIndexOfWeek--;

        prevSchedule?.classList.add("previousSchedule");
        if (prevSchedule) UntisCombiner.timeSchedule.appendChild(prevSchedule);

        UntisCombiner.currentlyAnimates = true;

        setTimeout(() => {
            prevSchedule?.classList.add("animateToCurrent");
            currentSchedule?.classList.add("animateToPrevious");
        }, 10);

        const animationTime = parseFloat((prevSchedule ? getComputedStyle(prevSchedule).getPropertyValue("--animationTime") : "1s").replace("s", ""));

        setTimeout(() => {
            currentSchedule?.classList.remove("animateToPrevious");
            currentSchedule?.classList.remove("currentSchedule");

            prevSchedule?.classList.add("currentSchedule");
            prevSchedule?.classList.remove("previousSchedule");
            prevSchedule?.classList.remove("animateToCurrent");
            if (currentSchedule) {
                UntisCombiner.timeSchedule.removeChild(currentSchedule);
                currentSchedule.classList.remove("onlyShow");
                for (const day of ["monday", "tuesday", "wednesday", "thuesday", "friday"]) {
                    currentSchedule.classList.remove(day);
                }
            }
            prevManager?.updateCurrentDayPosition();
            UntisCombiner.currentlyAnimates = false;
        }, (animationTime * 1000) + 200);

        UntisCombiner.loadHtmlTableManagerForCurrentIndexOfWeek();
        return prevManager ?? false;
    }

    private static animateToNext(): HTMLTableManager | false {
        if (UntisCombiner.currentIndexOfWeek >= UntisCombiner.MAX_LIMIT_TABLES) {
            return false;
        }


        if (UntisCombiner.currentlyAnimates) return false;

        const currentManager = UntisCombiner.getCurrentTableManager();
        const nextManager = UntisCombiner.getNextTableManager();

        if (nextManager) UntisCombiner.CURRENT_SCHEDULE = nextManager;

        const nextSchedule = nextManager?.tableElement;
        const currentSchedule = currentManager?.tableElement;

        nextSchedule?.classList.add("nextSchedule");
        if (nextSchedule) UntisCombiner.timeSchedule.appendChild(nextSchedule);

        setTimeout(() => {
            nextSchedule?.classList.add("animateToCurrent");
            currentSchedule?.classList.add("animateToNext");
        }, 10);

        UntisCombiner.currentlyAnimates = true;
        UntisCombiner.currentIndexOfWeek++;

        const animationTime = parseFloat((nextSchedule ? getComputedStyle(nextSchedule).getPropertyValue("--animationTime") : "1s").replace("s", ""));

        setTimeout(() => {

            currentSchedule?.classList.remove("animateToNext");
            currentSchedule?.classList.remove("currentSchedule");

            nextSchedule?.classList.add("currentSchedule");
            nextSchedule?.classList.remove("nextSchedule");
            nextSchedule?.classList.remove("animateToCurrent");
            if (currentSchedule) {
                UntisCombiner.timeSchedule.removeChild(currentSchedule);
                currentSchedule.classList.remove("onlyShow");
                for (const day of ["monday", "tuesday", "wednesday", "thuesday", "friday"]) {
                    currentSchedule.classList.remove(day);
                }
            }

            nextManager?.updateCurrentDayPosition();
            UntisCombiner.currentlyAnimates = false;
        }, (animationTime * 1000) + 200);

        UntisCombiner.loadHtmlTableManagerForCurrentIndexOfWeek();
        return nextManager ?? false;
    }
    private static getWeeksMonday(date: Date, offsetWeeks: number = 0): Date {
        const d = new Date(date);
        const day = d.getDay();
        const diffToMonday = (day === 0 ? -6 : 1 - day);
        d.setDate(d.getDate() + diffToMonday + offsetWeeks * 7);
        d.setHours(12, 0, 0, 0);
        return d;
    }

    private static getWeeksFriday(date: Date, offsetWeeks: number = 0): Date {
        const d = new Date(date);
        const day = d.getDay();
        const diffToFriday = (day === 0 ? -2 : 5 - day);
        d.setDate(d.getDate() + diffToFriday + offsetWeeks * 7);
        d.setHours(12, 0, 0, 0);
        return d;
    }

    // let currentIdDisplayed: string | null = null;

    private static async createHtmlTableManagerForDate(date: {
        week: number;
        date: Date;
    }, forceOfflineLoad: boolean = false): Promise<HTMLTableManager | null> {
        const finding = UntisCombiner.htmlTableManagers.find(e => e.week === date.week);
        if (finding) return finding;

        if (UntisCombiner.currentlyLoadingHtmlTableManagers[date.week + ""] != undefined) {
            return UntisCombiner.currentlyLoadingHtmlTableManagers[date.week + ""];
        }

        const htmlTableManager = new HTMLTableManager("schedule" + date.week, "schedule" + date.week, UntisCombiner.getWeeksMonday(date.date, 0), date.week);
        const allSchedules = await UntisCombiner.loadSchedule(date.date, forceOfflineLoad);
        if (allSchedules.length == 0) return null;
        if (allSchedules.map(e => e.lessons).flat().length == 0) return null;
        AllLessonsManager.checkForNew(allSchedules);
        htmlTableManager.preloadTimes();
        htmlTableManager.showSchedule(allSchedules);
        return htmlTableManager;
    }

    private static getCurrentWeekRange(now: Date): { monday: Date; friday: Date } {
        const dayOfWeek = now.getDay() || 7; // Sunday → 0, so set to 7

        // Monday of this week
        const monday = new Date(now);
        monday.setDate(now.getDate() - dayOfWeek + 1);
        monday.setHours(0, 0, 0, 0);

        // Friday of this week
        const friday = new Date(monday);
        friday.setDate(monday.getDate() + 4);
        friday.setHours(23, 59, 59, 999);

        return { monday, friday };
    }

    private static async loadSchedule(date: Date, forceOfflineLoad: boolean = false): Promise<UntisSchedule[]> {
        if (UserManagement.ALL_DATA!.untisAccesses.length == 0) return [];
        const { monday } = UntisCombiner.getCurrentWeekRange(date);
        if (navigator.onLine && !forceOfflineLoad) {

            const schedules: UntisSchedule[] = [];
            // const isCurrentWeek = isDateInCurrentWeek(date);
            if (UntisCombiner.lessonsLoaded[formatDate(monday, "yyyyMMMdd")]) {
                return UntisCombiner.lessonsLoaded[formatDate(monday, "yyyyMMMdd")];
            }

            const lessonsAll: TempLesson[] = [];
            const scheduleDatas: {
                [key: string]: UntisAccess & {
                    className: string;
                }
            } = {};

            for (const manager of UntisCombiner.UNTIS_MANAGERS) {
                for (const CLASS_NAME of manager.getClassNames()) {
                    const lessons = await manager.getLessonForWeekCompiledViaProxy(CLASS_NAME, date);
                    if (!lessons) continue;
                    const id = manager.getUntis().uuid ?? v4();
                    const mappedLesson = lessons.map(l => {
                        const tmp = l as TempLesson;
                        tmp.scheduleUUID = id;
                        tmp.school = manager.getSchool();
                        return tmp;
                    });
                    lessonsAll.push(...mappedLesson);
                    scheduleDatas[id] = {
                        className: CLASS_NAME,
                        ...manager.getUntis()
                    };
                }
            }

            const compiledLessons = UntisManager.checkForMultipleLessons(lessonsAll);

            const lessonsSorted: {
                [key: string]: TempLesson[];
            } = {};

            for (const lesson of compiledLessons) {
                if (!lessonsSorted[lesson.scheduleUUID]) lessonsSorted[lesson.scheduleUUID] = [];
                lessonsSorted[lesson.scheduleUUID].push(lesson);
            }

            console.log("lessonsSorted", lessonsSorted);

            for (const scheduleKey of Object.keys(lessonsSorted)) {
                if (!scheduleKey) continue;
                const scheduleData = scheduleDatas[scheduleKey];
                if (!scheduleData) continue;
                const compiledLessons: CompiledLesson[] = UntisManager.compileLessons(lessonsSorted[scheduleKey]);
                const schedule = new UntisSchedule(compiledLessons, scheduleData.className, UntisCombiner.getWeeksMonday(date, 0), scheduleData);
                schedule.filter(UserManagement.ALL_DATA!.schedule);
                const allLesonsFiltered = schedule.getAllLessons().map(e => {
                    delete e.bkRemark;
                    delete e.activityType;
                    delete e.bkText;
                    delete e.classes;
                    delete e.statflags;
                    delete e.bkText;
                    delete e.elements;
                    return e;
                });
                await Utils.saveInDB("OfflineData", "OfflineStorageOfTimetable", `OFFLINE_STORAGE_${dayjs(monday).format("YYYY-MM-DD")}_${scheduleData.className.replaceAll(" ", "_")}_ ${scheduleData.uuid.replaceAll(" ", "_")}`, allLesonsFiltered);
                schedules.push(schedule);
            }

            UntisCombiner.lessonsLoaded[formatDate(monday, "yyyyMMMdd")] = schedules;

            return schedules;
        } else {
            const schedules = [];
            for (const manager of UntisCombiner.UNTIS_MANAGERS) {
                for (const CLASS_NAME of manager.getClassNames()) {
                    const allLessons = await Utils.loadFromDB("OfflineData", "OfflineStorageOfTimetable", `OFFLINE_STORAGE_${dayjs(monday).format("YYYY-MM-DD")}_${CLASS_NAME.replaceAll(" ", "_")}_ ${manager.getSchoolUUID().replaceAll(" ", "_")}`) ?? [];
                    if (!allLessons) continue;
                    const filteredLessons = UntisCombiner.filterForDate(allLessons, date);
                    const schedule = new UntisSchedule(filteredLessons, CLASS_NAME, UntisCombiner.getWeeksMonday(date, 0), manager.getUntis());
                    schedules.push(schedule);
                }
            }
            return schedules;
        }
    }

    private static filterForDate(allLessons: CompiledLesson[], date: Date): CompiledLesson[] {
        const datesOfWeek = this.getCurrentWeekRange(date);
        datesOfWeek.monday.setHours(1);
        datesOfWeek.friday.setHours(23);
        const mondayTime = datesOfWeek.monday.getTime();
        const friday = datesOfWeek.friday.getTime();
        return allLessons.filter(lesson => {
            const lessonDate = UntisManager.formatUntisDateAsDate(lesson.date + "");
            const time = lessonDate.getTime();
            return time >= mondayTime && time <= friday;
        });
    }



    private static initLogoutBtn() {
        const logoutBtn = document.getElementById("logout");
        const logoutQuestion = document.getElementById("logoutQuestion");
        if (!logoutBtn) return;
        if (!logoutQuestion) return;
        logoutBtn.onclick = () => {
            logoutQuestion.classList.add("open");
        };
        logoutQuestion.querySelector(".no")?.addEventListener("click", () => {
            logoutQuestion.classList.remove("open");
        });
        logoutQuestion.querySelector(".yes")?.addEventListener("click", () => {
            logoutQuestion.classList.remove("open");
            Utils.success("Successfully Logged out!");
            setTimeout(() => {
                UserManagement.logout();
            }, 1000);
        });
    }

}

UntisCombiner.init();

// async function initEnv() {




//     var currentIndexOfWeek: number = 0;

//     initAll();
// }
// initEnv();
