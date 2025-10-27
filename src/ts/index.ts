import { formatDate } from "date-fns";
import { HTMLTableManager } from "./htmlTable/HtmlTableManager";
import { SCHEDULE } from "./ScheduleDarius";
import UntisManager, { type TempLesson } from "./untis/UntisManager"
import UntisSchedule from "./untis/UntisSchedule";
import { initSettings } from "./settings/settingsLoader";
import { v4 } from "uuid";
import type { School } from "./@types/School";
import type { CompiledLesson } from "./@types/Schedule";
import { UserManagement } from "./userManagement/UserManagement";
// import { HolidayLoader } from "./untis/HolidayLoader";

let env: {
    [key: string]: EnvSchoolData;
} = {};

type EnvSchoolData = {
    className: string;
    schoolId: string;
    username: string;
    password: string;
    host: string;
}

async function initEnv() {

    UserManagement.init();
    const response = await ((await fetch("./env.json")).json());
    env = response;

    const CLASS_NAME_GROOTMOOR = env.Grootmoor.className;
    const CLASS_NAME_MEIENDORF = env.Meiendorf.className;

    const untisManagerGrootmoor = new UntisManager(env.Grootmoor.schoolId, env.Grootmoor.username, env.Grootmoor.password, env.Grootmoor.host, "Grootmoor");
    const untisManagerMeiendorf = new UntisManager(env.Meiendorf.schoolId, env.Meiendorf.username, env.Meiendorf.password, env.Meiendorf.host, "Meiendorf");

    const UNTIS_MANAGERS = [untisManagerGrootmoor, untisManagerMeiendorf];

    const htmlTableManagerCurrently: HTMLTableManager = new HTMLTableManager("currentSchedule", "schedule");
    const htmlTableManagerNext: HTMLTableManager = new HTMLTableManager("nextSchedule", "nextSchedule");
    const htmlTableManagerPrevious: HTMLTableManager = new HTMLTableManager("previousSchedule", "previousSchedule");

    const htmlTableManagers = [htmlTableManagerCurrently, htmlTableManagerNext, htmlTableManagerPrevious];

    // const holidayLoader = new HolidayLoader(UNTIS_MANAGERS);
    // console.log(await holidayLoader.getHolidays());

    async function initAll() {

        initSettings();

        (document.getElementById("loadingAnimation") as HTMLDialogElement)?.showModal();

        window.addEventListener("resize", () => {
            document.body.style.setProperty("--windowHeight", window.innerHeight + "px");
            document.body.style.setProperty("--windowWidth", window.innerWidth + "px");
        });
        document.body.style.setProperty("--windowHeight", window.innerHeight + "px");
        document.body.style.setProperty("--windowWidth", window.innerWidth + "px");

        htmlTableManagers.forEach(m => m.preloadTimes());

        // await untisManagerGrootmoor.init();

        // const classes = await untisManagerGrootmoor.getClasses();
        // if(classes.length == 0)return;
        // console.log(classes);

        // const s = await untisManagerGrootmoor.getLessons(getWeeksMonday(1), getWeeksFriday(1), 1501);
        // console.log(s);

        // const classFiltered = classes.find(c => c.name == CLASS_NAME);
        // if(!classFiltered){
        //     console.log("Class " + CLASS_NAME + " not found!");
        //     console.log("Possible classes are:");
        //     classes.forEach(c => {
        //         console.log("- " + c.name);
        //     });
        //     return;
        // }

        // console.log("Found class: " + classFiltered.name + " with id: " + classFiltered.id);

        await loadAllWeeksFor(new Date());
        (document.getElementById("loadingAnimation") as HTMLDialogElement)?.close();

        document.getElementById("nextWeek")!.onclick = animateToNext;
        document.getElementById("prevWeek")!.onclick = animateToPrevious;

    }

    var currentIndexOfWeek: number = 0;



    function animateToPrevious() {

        if (currentIndexOfWeek <= -1) {
            document.getElementById("prevWeek")?.classList.add("disabled");
            return;
        }

        document.getElementById("nextWeek")?.classList.remove("disabled");
        const nextSchedule = document.getElementById("nextSchedule");
        const currentSchedule = document.getElementById("schedule");
        const prevSchedule = document.getElementById("previousSchedule");

        currentIndexOfWeek--;
        if (currentIndexOfWeek <= -1) {
            document.getElementById("prevWeek")?.classList.add("disabled");
        } else {
            document.getElementById("prevWeek")?.classList.remove("disabled");
        }

        prevSchedule?.setAttribute("animate", "");
        currentSchedule?.setAttribute("animate", "");

        currentSchedule?.addEventListener("transitionend", () => {
            prevSchedule?.removeAttribute("animate");
            currentSchedule?.removeAttribute("animate");

            nextSchedule!.id = "previousSchedule";
            currentSchedule!.id = "nextSchedule";
            prevSchedule!.id = "schedule";

            currentSchedule?.removeAttribute("animatePrevious");

            // loadAllWeeksFor(getDateFroWeek(currentIndexOfWeek), false);

        }, { once: true });

        currentSchedule?.setAttribute("animatePrevious", "");

    }

    function animateToNext() {
        if (currentIndexOfWeek >= 1) {
            document.getElementById("nextWeek")?.classList.add("disabled");
            return;
        }

        document.getElementById("prevWeek")?.classList.remove("disabled");

        const nextSchedule = document.getElementById("nextSchedule");
        const currentSchedule = document.getElementById("schedule");
        const prevSchedule = document.getElementById("previousSchedule");

        currentIndexOfWeek++;
        if (currentIndexOfWeek >= 1) {
            document.getElementById("nextWeek")?.classList.add("disabled");
        } else {
            document.getElementById("nextWeek")?.classList.remove("disabled");
        }

        nextSchedule?.setAttribute("animate", "");
        currentSchedule?.setAttribute("animate", "");

        currentSchedule?.addEventListener("transitionend", () => {
            nextSchedule?.removeAttribute("animate");
            currentSchedule?.removeAttribute("animate");

            nextSchedule!.id = "schedule";
            currentSchedule!.id = "previousSchedule";
            prevSchedule!.id = "nextSchedule";

            currentSchedule?.removeAttribute("animateNext");

            // loadAllWeeksFor(getDateFroWeek(currentIndexOfWeek), false);

        }, { once: true });

        currentSchedule?.setAttribute("animateNext", "");

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



    function getDateFroWeek(offsetWeeks: number): Date {
        const date: Date = new Date();
        date.setDate(date.getDate() + (7 * offsetWeeks));
        return date;
    }

    let currentIdDisplayed: string | null = null;

    async function loadAllWeeksFor(date: Date, loadCurrentSchedule: boolean = true) {

        const requests = [];

        let currentPromise = null;
        let idForDisplay = v4();
        currentIdDisplayed = idForDisplay;

        if (loadCurrentSchedule) {
            htmlTableManagerCurrently.reloadFromId();
            htmlTableManagerCurrently.clearLessons();
            // if(loadCurrentSchedule)htmlTableManagerCurrently.showSchedule(...(await loadSchedule(date)));
            const promise = loadSchedule(date);
            currentPromise = promise;
            requests.push({ promise: promise, htmlTableManager: htmlTableManagerCurrently });
        }

        const nextDate = getWeeksMonday(new Date(date), 1);
        htmlTableManagerNext.reloadFromId();
        htmlTableManagerNext.clearLessons();
        // htmlTableManagerNext.showSchedule(...(await loadSchedule(nextDate)));
        requests.push({ promise: loadSchedule(nextDate), htmlTableManager: htmlTableManagerNext });

        const prevDate = getWeeksFriday(new Date(date), -1);
        htmlTableManagerPrevious.reloadFromId();
        htmlTableManagerPrevious.clearLessons();
        // htmlTableManagerPrevious.showSchedule(...(await loadSchedule(prevDate)));
        requests.push({ promise: loadSchedule(prevDate), htmlTableManager: htmlTableManagerPrevious });

        for (const request of requests) {
            request.promise.then((schedules) => {
                if (currentIdDisplayed != idForDisplay) return;
                request.htmlTableManager.showSchedule(...schedules);
            });
        }

        if (currentPromise) {
            await currentPromise;
        } else {
            await Promise.all(requests.map(r => r.promise));
        }

    }

    function isDateInCurrentWeek(date: Date): boolean {
        const now = new Date();
        const dayOfWeek = now.getDay() || 7; // Sunday → 0, so treat as 7
        const monday = new Date(now);
        monday.setDate(now.getDate() - dayOfWeek + 1);
        monday.setHours(0, 0, 0, 0);

        const sunday = new Date(monday);
        sunday.setDate(monday.getDate() + 6);
        sunday.setHours(23, 59, 59, 999);

        return date >= monday && date <= sunday;
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

    const lessonsLoaded: {
        [key: string]: UntisSchedule[];
    } = {};

    async function loadSchedule(date: Date): Promise<UntisSchedule[]> {

        const schedules: UntisSchedule[] = [];
        // const isCurrentWeek = isDateInCurrentWeek(date);
        const isCurrentWeek = true; //Because it gets more information from getLessonForWeekCompiledViaProxy and it works (didint before ?)
        const { monday, friday } = getCurrentWeekRange(date);
        if (lessonsLoaded[formatDate(monday, "yyyyMMMdd")]) {
            return lessonsLoaded[formatDate(monday, "yyyyMMMdd")];
        }

        const lessonsAll: TempLesson[] = [];
        const scheduleDatas: {
            [key: string]: {
                className: string;
                school: School;
            }
        } = {};

        for (const manager of UNTIS_MANAGERS) {
            let CLASS_NAME = manager.getSchool() == "Grootmoor" ? CLASS_NAME_GROOTMOOR : CLASS_NAME_MEIENDORF;
            if (isCurrentWeek) {
                await manager.getLessonForWeekCompiledViaProxy(CLASS_NAME, date);
                const lessons = manager.getRawLessons();
                if (!lessons) continue;
                const id = v4();
                console.log(lessons);
                lessons.map(l => {
                    const tmp = l as TempLesson;
                    tmp.scheduleId = id;
                    tmp.school = manager.getSchool();
                    return tmp;
                })
                lessonsAll.push(...(lessons as TempLesson[]));
                scheduleDatas[id] = {
                    className: CLASS_NAME,
                    school: manager.getSchool()
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
                    school: manager.getSchool()
                };
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

        console.log(scheduleDatas, lessonsSorted);

        for (const scheduleKey of Object.keys(lessonsSorted)) {
            if (!scheduleKey) continue;
            const scheduleData = scheduleDatas[scheduleKey];
            if (!scheduleData) continue;
            const compiledLessons: CompiledLesson[] = UntisManager.compileLessons(lessonsSorted[scheduleKey]);
            console.log("compiledLessons", compiledLessons, scheduleData);
            const schedule = new UntisSchedule(compiledLessons, scheduleData.className, scheduleData.school);
            schedule.filter(SCHEDULE);
            schedules.push(schedule);
        }



        lessonsLoaded[formatDate(monday, "yyyyMMMdd")] = schedules;

        return schedules;
    }



    initAll();

}
initEnv();