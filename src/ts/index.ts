import { formatDate } from "date-fns";
import { HTMLTableManager } from "./htmlTable/HtmlTableManager";
// import { SCHEDULE } from "./ScheduleDarius_old";
import UntisManager, { type TempLesson } from "./untis/UntisManager"
import UntisSchedule from "./untis/UntisSchedule";
import { initSettings } from "./settings/settingsLoader";
import { v4 } from "uuid";
import type { School } from "./@types/School";
import type { CompiledLesson } from "./@types/Schedule";
import { UserManagement } from "./userManagement/UserManagement";
import Utils from "./Utils";
import type { AllData } from "./@types/UserManagement";
import { SWManager } from "./SWManager";
import { GestureHandler } from "./gestures/gestures";
import NotificationManager from "./notificationManager/NotificationManager";
import { AllLessonsManager } from "./untis/AllLessonsManager";
import { getDateWithOptions } from "date-fns/fp";
import { HolidayLoader } from "./untis/HolidayLoader";
import type { UntisAccess } from "./@types/UntisAccess";
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

let MIN_LIMIT_TABLES = 0;
let MAX_LIMIT_TABLES = 0;

let MIN_LIMIT_SET = false;
let MAX_LIMIT_SET = false;


const lessonsLoaded: {
    [key: string]: UntisSchedule[];
} = {};

const currentlyLoadingHtmlTableManagers: {
    [key: string]: Promise<HTMLTableManager | null>;
} = {};

function updateLimits(week: number) {
    MIN_LIMIT_TABLES = Math.min(MIN_LIMIT_TABLES, week);
    MAX_LIMIT_TABLES = Math.max(MAX_LIMIT_TABLES, week);
}

async function initEnv() {

    const timeSchedule = document.getElementById("timeSchedule") as HTMLElement;
    if (!timeSchedule) return;

    (document.getElementById("loadingAnimation") as HTMLDialogElement)?.showModal();

    UserManagement.init();

    const allData = await UserManagement.loadAll() as AllData;
    if (!allData) {
        Utils.error("Failed to load Data From Account");
        return;
    }
    SWManager.install(allData.preferences.notificationsEnabled);

    NotificationManager.initNotificationManager();



    // const CLASS_NAME_GROOTMOOR = env.Grootmoor.className;
    // const CLASS_NAME_MEIENDORF = env.Meiendorf.className;

    // const untisManagerGrootmoor = new UntisManager(env.Grootmoor.schoolId, env.Grootmoor.username, env.Grootmoor.password, env.Grootmoor.host, "Grootmoor");
    // const untisManagerMeiendorf = new UntisManager(env.Meiendorf.schoolId, env.Meiendorf.username, env.Meiendorf.password, env.Meiendorf.host, "Meiendorf");

    const UNTIS_MANAGERS: UntisManager[] = [];

    for (const untisManagerData of allData.untisAccesses) {
        const manager = new UntisManager(untisManagerData);
        UNTIS_MANAGERS.push(manager);
    }

    const HOLIDAY_LOADER = new HolidayLoader(UNTIS_MANAGERS);
    if (UserManagement.ALL_DATA) {
        UserManagement.ALL_DATA.holidays = await HOLIDAY_LOADER.getHolidays();
    }
    // console.log(await HOLIDAY_LOADER.getHolidays());

    // const htmlTableManagerCurrently: HTMLTableManager = new HTMLTableManager("currentSchedule", "schedule", new Date());
    // const htmlTableManagerNext: HTMLTableManager = new HTMLTableManager("nextSchedule", "nextSchedule", getWeeksMonday(new Date(), 1));
    // const htmlTableManagerPrevious: HTMLTableManager = new HTMLTableManager("previousSchedule", "previousSchedule", getWeeksFriday(new Date(), -1));
    //htmlTableManagerCurrently, htmlTableManagerNext, htmlTableManagerPrevious
    const htmlTableManagers: HTMLTableManager[] = [];

    for (const date of [{ week: -1, date: getWeeksFriday(new Date(), -1) }, { week: 0, date: new Date() }, { week: 1, date: getWeeksMonday(new Date(), 1) }]) {
        if (date.week != 0) {
            const promise = createHtmlTableManagerForDate(date);
            currentlyLoadingHtmlTableManagers[date.week] = promise;
            promise.then(manager => {
                if (!manager) return;
                updateLimits(date.week);
                htmlTableManagers.push(manager);
                delete currentlyLoadingHtmlTableManagers[date.week];
            });
        }

        if (date.week == 0) {
            const manager = await createHtmlTableManagerForDate(date);
            if (!manager) continue;
            updateLimits(date.week);
            htmlTableManagers.push(manager);
            if (manager.tableElement) timeSchedule.appendChild(manager.tableElement);
            manager.tableElement?.classList.add("currentSchedule");
            manager.updateCurrentDayPosition();
        }

    }

    async function loadHtmlTableManagerForCurrentIndexOfWeek() {
        if (MIN_LIMIT_SET && MAX_LIMIT_SET) return;
        const nextPreviousIndex = currentIndexOfWeek - 1;
        const nextNextIndex = currentIndexOfWeek + 1;

        const foundNextPrevious = htmlTableManagers.find((manager) => {
            return manager.week == nextPreviousIndex;
        });
        const foundNextNext = htmlTableManagers.find((manager) => {
            return manager.week == nextNextIndex;
        });

        if (!foundNextNext && !MAX_LIMIT_SET) {
            const manager = await createHtmlTableManagerForDate({
                date: getWeeksMonday(new Date(), nextNextIndex),
                week: nextNextIndex
            });
            if (manager) {
                updateLimits(nextNextIndex);
                htmlTableManagers.push(manager);
            } else {
                MAX_LIMIT_SET = true;
            }
        }

        if (!foundNextPrevious && !MIN_LIMIT_SET) {
            const manager = await createHtmlTableManagerForDate({
                date: getWeeksFriday(new Date(), nextPreviousIndex),
                week: nextPreviousIndex
            });
            if (manager) {
                updateLimits(nextPreviousIndex);
                htmlTableManagers.push(manager);
            } else {
                MIN_LIMIT_SET = true;
            }
        }
    }


    function initGestures() {
        const timeSchedule = document.getElementById("timeSchedule");
        if (!timeSchedule) return;
        const swipeGesture = new GestureHandler(timeSchedule);
        swipeGesture.onSwipeLeft = () => {
            animateToNext();
        };
        swipeGesture.onSwipeRight = () => {
            animateToPrevious();
        };
    }
    initGestures();


    async function initAll() {

        initSettings();

        window.addEventListener("resize", () => {
            document.body.style.setProperty("--windowHeight", window.innerHeight + "px");
            document.body.style.setProperty("--windowWidth", window.innerWidth + "px");
        });
        document.body.style.setProperty("--windowHeight", window.innerHeight + "px");
        document.body.style.setProperty("--windowWidth", window.innerWidth + "px");
        (document.getElementById("loadingAnimation") as HTMLDialogElement)?.close();
    }

    var currentIndexOfWeek: number = 0;

    function getCurrentTableManager(offset: number = 0) {
        const weekIndex = currentIndexOfWeek + offset;
        return htmlTableManagers.find(e => e.week === weekIndex);
    }
    function getNextTableManager() {
        return getCurrentTableManager(1);
    }
    function getPreviousTableManager() {
        return getCurrentTableManager(-1);
    }

    let currentlyAnimates = false;

    function animateToPrevious() {

        if (currentIndexOfWeek <= MIN_LIMIT_TABLES) {
            return;
        }
        if (currentlyAnimates) return;

        const currentManager = getCurrentTableManager();
        const prevManager = getPreviousTableManager();

        const currentSchedule = currentManager?.tableElement;
        const prevSchedule = prevManager?.tableElement;

        currentIndexOfWeek--;

        prevSchedule?.classList.add("previousSchedule");
        if (prevSchedule) timeSchedule.appendChild(prevSchedule);

        currentlyAnimates = true;

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
            if (currentSchedule) timeSchedule.removeChild(currentSchedule);
            prevManager?.updateCurrentDayPosition();
            currentlyAnimates = false;
        }, (animationTime * 1000) + 200);

        loadHtmlTableManagerForCurrentIndexOfWeek();

    }

    function animateToNext() {
        if (currentIndexOfWeek >= MAX_LIMIT_TABLES) {
            return;
        }


        if (currentlyAnimates) return;

        const currentManager = getCurrentTableManager();
        const nextManager = getNextTableManager();

        const nextSchedule = nextManager?.tableElement;
        const currentSchedule = currentManager?.tableElement;

        nextSchedule?.classList.add("nextSchedule");
        if (nextSchedule) timeSchedule.appendChild(nextSchedule);

        setTimeout(() => {
            nextSchedule?.classList.add("animateToCurrent");
            currentSchedule?.classList.add("animateToNext");
        }, 10);

        currentlyAnimates = true;
        currentIndexOfWeek++;

        const animationTime = parseFloat((nextSchedule ? getComputedStyle(nextSchedule).getPropertyValue("--animationTime") : "1s").replace("s", ""));

        setTimeout(() => {

            currentSchedule?.classList.remove("animateToNext");
            currentSchedule?.classList.remove("currentSchedule");

            nextSchedule?.classList.add("currentSchedule");
            nextSchedule?.classList.remove("nextSchedule");
            nextSchedule?.classList.remove("animateToCurrent");
            if (currentSchedule) timeSchedule.removeChild(currentSchedule);
            nextManager?.updateCurrentDayPosition();
            currentlyAnimates = false;
        }, (animationTime * 1000) + 200);

        loadHtmlTableManagerForCurrentIndexOfWeek();
    }

    function getWeeksMonday(date: Date, offsetWeeks: number): Date {
        const day = date.getDay();
        const diffToMonday = (day === 0 ? -6 : 1 - day); // move to current Monday
        date.setDate(date.getDate() + diffToMonday + offsetWeeks * 7);
        date.setHours(12, 0, 0, 0);
        return date;
    }

    function getWeeksFriday(date: Date, offsetWeeks: number): Date {
        const day = date.getDay();              // 0 = Sun … 6 = Sat
        const diffToFriday = 5 - day;           // distance from today to this week's Friday
        date.setDate(date.getDate() + diffToFriday + (offsetWeeks) * 7);
        date.setHours(12, 0, 0, 0);
        return date;
    }

    // let currentIdDisplayed: string | null = null;

    async function createHtmlTableManagerForDate(date: {
        week: number;
        date: Date;
    }): Promise<HTMLTableManager | null> {
        const finding = htmlTableManagers.find(e => e.week === date.week);
        if (finding) return finding;

        if (currentlyLoadingHtmlTableManagers[date.week] != undefined) {
            return currentlyLoadingHtmlTableManagers[date.week];
        }

        const htmlTableManager = new HTMLTableManager("schedule" + date.week, "schedule" + date.week, date.week);
        const allSchedules = await loadSchedule(date.date);
        if (allSchedules.length == 0) return null;
        if (allSchedules.map(e => e.lessons).flat().length == 0) return null;
        AllLessonsManager.checkForNew(allSchedules);
        htmlTableManager.preloadTimes();
        htmlTableManager.showSchedule(allSchedules);
        return htmlTableManager;
    }

    function getCurrentWeekRange(now: Date): { monday: Date; friday: Date } {
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

    async function loadSchedule(date: Date): Promise<UntisSchedule[]> {
        if (allData.untisAccesses.length == 0) return [];
        if (navigator.onLine) {

            const schedules: UntisSchedule[] = [];
            // const isCurrentWeek = isDateInCurrentWeek(date);
            const isCurrentWeek = true; //Because it gets more information from getLessonForWeekCompiledViaProxy and it works (didint before ?)
            const { monday, friday } = getCurrentWeekRange(date);
            if (lessonsLoaded[formatDate(monday, "yyyyMMMdd")]) {
                return lessonsLoaded[formatDate(monday, "yyyyMMMdd")];
            }

            const lessonsAll: TempLesson[] = [];
            const scheduleDatas: {
                [key: string]: UntisAccess & {
                    className: string;
                }
            } = {};

            for (const manager of UNTIS_MANAGERS) {
                for (const CLASS_NAME of manager.getClassNames()) {
                    if (isCurrentWeek) {
                        await manager.getLessonForWeekCompiledViaProxy(CLASS_NAME, date);
                        const lessons = manager.getRawLessons();
                        if (!lessons) continue;
                        const id = v4();
                        lessons.map(l => {
                            const tmp = l as TempLesson;
                            tmp.scheduleId = id;
                            tmp.school = manager.getSchool();
                            return tmp;
                        })
                        lessonsAll.push(...(lessons as TempLesson[]));
                        scheduleDatas[id] = {
                            className: CLASS_NAME,
                            ...manager.getUntis()
                        };

                    } else {
                        await manager.getCompiledLessonForRange(CLASS_NAME, monday, friday);
                        const lessons = manager.getRawLessons();
                        if (!lessons) continue;
                        const id = v4();
                        lessons.map(l => {
                            const tmp = l as TempLesson;
                            tmp.scheduleId = id;
                            tmp.school = manager.getSchool();
                            return tmp;
                        })
                        lessonsAll.push(...(lessons as TempLesson[]));
                        scheduleDatas[id] = {
                            className: CLASS_NAME,
                            ...manager.getUntis()
                        };
                    }
                }
            }


            const compiledLessons = UntisManager.checkForMultipleLessons(lessonsAll);

            const lessonsSorted: {
                [key: string]: TempLesson[];
            } = {};

            for (const lesson of compiledLessons) {
                if (!lessonsSorted[lesson.scheduleId]) lessonsSorted[lesson.scheduleId] = [];
                lessonsSorted[lesson.scheduleId].push(lesson);
            }

            for (const scheduleKey of Object.keys(lessonsSorted)) {
                if (!scheduleKey) continue;
                const scheduleData = scheduleDatas[scheduleKey];
                if (!scheduleData) continue;
                const compiledLessons: CompiledLesson[] = UntisManager.compileLessons(lessonsSorted[scheduleKey]);
                const schedule = new UntisSchedule(compiledLessons, scheduleData.className, getWeeksMonday(date, 0), scheduleData);
                schedule.filter(allData.schedule);
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
                await Utils.saveInDB("OfflineData", "OfflineStorageOfTimetable", "OFFLINE_STORAGE_" + scheduleData.className + "_" + scheduleData.school, allLesonsFiltered);
                schedules.push(schedule);
            }



            lessonsLoaded[formatDate(monday, "yyyyMMMdd")] = schedules;

            return schedules;
        } else {
            const schedules = [];
            for (const manager of UNTIS_MANAGERS) {
                for (const CLASS_NAME of manager.getClassNames()) {
                    const allLessons = await Utils.loadFromDB("OfflineData", "OfflineStorageOfTimetable", "OFFLINE_STORAGE_" + CLASS_NAME + "_" + manager.getSchool()) ?? [];
                    if (!allLessons) continue;

                    const schedule = new UntisSchedule(allLessons as CompiledLesson[], CLASS_NAME, getWeeksMonday(date, 0), manager.getUntis());
                    schedules.push(schedule);
                }
            }
            return schedules;
        }
    }
    initAll();
}
initEnv();


function initLogoutBtn() {
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
initLogoutBtn();