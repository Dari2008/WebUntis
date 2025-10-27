import { SettingsBreakList } from "../customSettings/SettingsBreakList";
import { SettingsExamsList } from "../customSettings/SettingsExamList";
import { SettingsTeacherList, type SettingsTeacherListData } from "../customSettings/SettingsTeacherList";
import { SettingsUntisAccessesList } from "../customSettings/SettingsUntisAccessesList";
import { UserManagement } from "../userManagement/UserManagement";
import { Settings } from "./Settings";
import type { SettingsColorSelectorElement } from "./SettingsColorSelectorElement";
import { initForSettings, loadSettings, type SettingsData } from "./SettingsGenerator";
import { type SettingsContentData, type SettingsTitleData } from "./SettingsTitleElement";


export function initSettings() {

    const TEACHER_SETTINGS = generateTeacherSettings();

    let timeoutLessonColorChange: number = -1;

    let timeoutData: {
        [key: string]: number;
    } = {};

    const changed = (key: string, defaultVal: string | boolean | number, value: string | boolean | number) => {
        if (timeoutData[key]) {
            clearTimeout(timeoutData[key]);
        }
        timeoutData[key] = setTimeout(() => {
            (UserManagement.ALL_DATA!.preferences as any)[key] = value ?? defaultVal;
            UserManagement.updatePreferences({
                [key]: value ?? defaultVal
            });
        }, 100);
    };

    let settingOptions: SettingsData[] = [
        {
            id: "appearance",
            label: "Appearance",
            selected: true,
            options: [
                {
                    type: "title",
                    title: "Appearance",
                    hnumber: 1,
                    content: [
                        {
                            type: "color",
                            label: "Lesson Cancel Color",
                            description: "Color of the lesson border when the lesson is canceled",
                            name: "lessonCancelColor",
                            id: "lessonCancelColor",
                            title: "Lesson Canceled",
                            autoSave: true,
                            color: Settings.colors.canceledBorderColor,
                            onchange(value, getOtherElement) {
                                if (!value.hex) return;
                                document.documentElement.style.setProperty("--canceledBorderColor", value.hex + "");
                                changed("lessonCancelColor", Settings.colors.canceledBorderColor, value.hex);
                            },
                            onload(value, getOtherElement) {
                                console.log(value);
                                if (!value.hex) return;
                                document.documentElement.style.setProperty("--canceledBorderColor", value.hex + "");
                                if (UserManagement.ALL_DATA) {
                                    if (UserManagement.ALL_DATA.preferences.lessonCancelColor)
                                        document.documentElement.style.setProperty("--canceledBorderColor", UserManagement.ALL_DATA.preferences.lessonCancelColor + "");
                                }
                            },
                        },
                        {
                            type: "color",
                            label: "Additional Lesson Color",
                            description: "Color of the lesson border when the lesson not reqular",
                            name: "additionalLessonColor",
                            id: "additionalLessonColor",
                            title: "Additional Lesson",
                            autoSave: true,
                            color: Settings.colors.additionalLessonBorderColor,
                            onchange(value, getOtherElement) {
                                if (!value.hex) return;
                                document.documentElement.style.setProperty("--additionalLessonBorderColor", value.hex + "");
                                changed("additionalLessonColor", Settings.colors.additionalLessonBorderColor, value.hex);
                            },
                            onload(value, getOtherElement) {
                                if (!value.hex) return;
                                document.documentElement.style.setProperty("--additionalLessonBorderColor", value.hex + "");
                                if (UserManagement.ALL_DATA) {
                                    if (UserManagement.ALL_DATA.preferences.additionalLessonColor)
                                        document.documentElement.style.setProperty("--additionalLessonBorderColor", UserManagement.ALL_DATA.preferences.additionalLessonColor + "");
                                }
                            },
                        },
                        {
                            type: "color",
                            label: "Exam Lesson Color",
                            description: "Color of the lesson when the lesson is an exam",
                            name: "examLessonColor",
                            id: "examLessonColor",
                            title: "Exam Lesson",
                            autoSave: true,
                            color: Settings.colors.examColor,
                            onchange(value, getOtherElement) {
                                if (!value.hex) return;
                                document.documentElement.style.setProperty("--examColor", value.hex + "");
                                changed("examLessonColor", Settings.colors.examColor, value.hex);
                            },
                            onload(value, getOtherElement) {
                                if (!value.hex) return;
                                document.documentElement.style.setProperty("--examColor", value.hex + "");
                                if (UserManagement.ALL_DATA) {
                                    if (UserManagement.ALL_DATA.preferences.examLessonColor)
                                        document.documentElement.style.setProperty("--examColor", UserManagement.ALL_DATA.preferences.examLessonColor + "");
                                }
                            },
                        },
                        {
                            type: "title",
                            hnumber: 3,
                            title: "Lesson Event Change Colors",
                            content: [
                                {
                                    type: "toggle",
                                    title: "Lesson Event Change Colors",
                                    description: "One Color for every change",
                                    name: "separateChangeColors",
                                    label: "",
                                    autoSave: true,
                                    checked: false,
                                    onchange(checked, getOtherElement) {
                                        const roomChange = getOtherElement("roomChangeColor") as SettingsColorSelectorElement;
                                        const teacherChange = getOtherElement("teacherChangeColor") as SettingsColorSelectorElement;
                                        const changeColor = getOtherElement("changeColor") as SettingsColorSelectorElement;
                                        if (!checked) {
                                            roomChange.setVisible(false);
                                            teacherChange.setVisible(false);
                                            changeColor.setVisible(true);
                                        } else {
                                            roomChange.setVisible(true);
                                            teacherChange.setVisible(true);
                                            changeColor.setVisible(false);
                                        }
                                        changed("oneColorForEveryChange", false, checked);
                                    },
                                    onload(checked, getOtherElement) {
                                        const roomChange = getOtherElement("roomChangeColor") as SettingsColorSelectorElement;
                                        const teacherChange = getOtherElement("teacherChangeColor") as SettingsColorSelectorElement;
                                        const changeColor = getOtherElement("changeColor") as SettingsColorSelectorElement;
                                        if (UserManagement.ALL_DATA) {
                                            if (UserManagement.ALL_DATA.preferences.oneColorForEveryChange)
                                                checked = UserManagement.ALL_DATA.preferences.oneColorForEveryChange;
                                        }
                                        if (!checked) {
                                            roomChange.setVisible(false);
                                            teacherChange.setVisible(false);
                                            changeColor.setVisible(true);
                                        } else {
                                            roomChange.setVisible(true);
                                            teacherChange.setVisible(true);
                                            changeColor.setVisible(false);
                                        }
                                    },
                                },
                                {
                                    type: "color",
                                    title: "Room Change Color",
                                    label: "Room Change Color",
                                    description: "Color of the lesson border when the room is changed",
                                    autoSave: true,
                                    name: "roomChangeColor",
                                    color: Settings.colors.roomSubstitutionBorderColor,
                                    onchange(value, getOtherElement) {
                                        if (!value.hex) return;
                                        document.documentElement.style.setProperty("--roomSubstitutionBorderColor", value.hex + "");
                                        changed("roomChangeColor", Settings.colors.roomSubstitutionBorderColor, value.hex);
                                    },
                                    onload(value, getOtherElement) {
                                        if (!value.hex) return;
                                        document.documentElement.style.setProperty("--roomSubstitutionBorderColor", value.hex + "");
                                        if (UserManagement.ALL_DATA) {
                                            if (UserManagement.ALL_DATA.preferences.roomChangeColor)
                                                document.documentElement.style.setProperty("--roomSubstitutionBorderColor", UserManagement.ALL_DATA.preferences.roomChangeColor + "");
                                        }
                                    },
                                },
                                {
                                    type: "color",
                                    title: "Teacher Change Color",
                                    label: "Teacher Change Color",
                                    description: "Color of the lesson border when the teacher is changed",
                                    autoSave: true,
                                    name: "teacherChangeColor",
                                    color: Settings.colors.substitutionBorderColor,
                                    onchange(value, getOtherElement) {
                                        if (!value.hex) return;
                                        document.documentElement.style.setProperty("--absenceBorderColor", value.hex + "");
                                        changed("teacherChangeColor", Settings.colors.substitutionBorderColor, value.hex);
                                    },
                                    onload(value, getOtherElement) {
                                        if (!value.hex) return;
                                        document.documentElement.style.setProperty("--absenceBorderColor", value.hex + "");
                                        if (UserManagement.ALL_DATA) {
                                            if (UserManagement.ALL_DATA.preferences.teacherChangeColor)
                                                document.documentElement.style.setProperty("--absenceBorderColor", UserManagement.ALL_DATA.preferences.teacherChangeColor + "");
                                        }
                                    },
                                },
                                {
                                    type: "color",
                                    title: "Change Color",
                                    label: "Change Color",
                                    description: "Color of the lesson border when something in the lesson is changed",
                                    autoSave: true,
                                    name: "changeColor",
                                    color: Settings.colors.absenceBorderColor,
                                    onchange(value, getOtherElement) {
                                        if (!value.hex) return;
                                        document.documentElement.style.setProperty("--absenceBorderColor", value.hex + "");
                                        document.documentElement.style.setProperty("--roomSubstitutionBorderColor", value.hex + "");
                                        changed("changeColor", Settings.colors.absenceBorderColor, value.hex);
                                    },
                                    onload(value, getOtherElement) {
                                        if (!value.hex) return;
                                        document.documentElement.style.setProperty("--roomSubstitutionBorderColor", value.hex + "");
                                        if (UserManagement.ALL_DATA) {
                                            if (UserManagement.ALL_DATA.preferences.changeColor)
                                                document.documentElement.style.setProperty("--roomSubstitutionBorderColor", UserManagement.ALL_DATA.preferences.changeColor + "");
                                        }
                                    },
                                }
                            ]
                        }
                    ]

                }
            ],
            elements: []
        },
        {
            id: "teachers",
            label: "Teachers",
            selected: false,
            options: [
                {
                    type: "title",
                    title: "Teachers",
                    hnumber: 1,
                    content: [
                        {
                            type: "text",
                            text: "Manage your teachers here.",
                            id: "manageTeachersText",
                            elementType: "p",
                        },
                        ...TEACHER_SETTINGS
                    ]
                }
            ],
            elements: []
        },
        {
            id: "exams",
            label: "Exams",
            selected: false,
            options: [
                {
                    type: "title",
                    hnumber: 1,
                    title: "Exams",
                    name: "exams",
                    content: [
                        {
                            type: "text",
                            elementType: "p",
                            text: "Manage your Exams here.",
                            id: "manageExamsText"
                        },
                        {
                            type: () => new SettingsExamsList(),
                            name: "examList",
                            id: "examList",
                        }
                    ]
                }
            ],
            elements: []
        },
        {
            id: "breaks",
            label: "Breaks",
            selected: false,
            options: [
                {
                    type: "title",
                    hnumber: 1,
                    title: "Breaks",
                    name: "breaks",
                    content: [
                        {
                            type: "text",
                            elementType: "p",
                            text: "Manage your Breaks here.",
                            id: "manageBreaksText"
                        },
                        {
                            type: <SettingsBreakListData>(data: SettingsBreakListData) => new SettingsBreakList((data as any)),
                            name: "breakList",
                            id: "breakList",
                        }
                    ]
                }
            ],
            elements: []
        },
        {
            id: "untisAccesses",
            label: "Untis Accesses",
            selected: false,
            options: [
                {
                    type: "title",
                    hnumber: 1,
                    title: "Untis Accesses",
                    name: "untisAccesses",
                    content: [
                        {
                            type: "text",
                            elementType: "p",
                            text: "Manage your Schedules here.",
                            id: "manageSchedulesText"
                        },
                        {
                            type: <SettingsUntisAccessesListData>(data: SettingsUntisAccessesListData) => new SettingsUntisAccessesList((data as any)),
                            name: "breakList",
                            id: "breakList",
                        }
                    ]
                }
            ],
            elements: []
        }
    ];

    initForSettings();
    loadSettings(settingOptions);

}

function generateTeacherSettings(): SettingsContentData[] {
    const settingData: SettingsContentData[] = [];

    for (const school of UserManagement.ALL_DATA!.schools) {
        const settingElement: SettingsTeacherListData = {
            type: <SettingsTeacherListData>(data: SettingsTeacherListData) => new SettingsTeacherList((data as any)),
            name: "teacherList" + school,
            id: "teacherList" + school,
            disabled: false,
            school: school
        };

        const settingsElementTitle: SettingsTitleData = {
            title: "Teachers from " + school,
            type: "title",
            disabled: false,
            name: "titleOf" + school,
            id: "titleOf" + school,
            hnumber: 2,
            content: [settingElement]
        }
        settingData.push(settingsElementTitle);
    }
    return settingData;
}