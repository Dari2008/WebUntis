import type { NotificationMessageEnabledLayouts, NotificationMessageLayouts } from "../@types/UserManagement";
import { SettingsBreakList } from "../customSettings/SettingsBreakList";
import { SettingsExamsList } from "../customSettings/SettingsExamList";
import { SettingsNotificationMessageLayoutElement, type SettingsNotificationMessageLayoutData } from "../customSettings/SettingsNotificationMessageLayoutElement";
import { SettingsPushServiceSubscribedDevicesList } from "../customSettings/SettingsPushServiceSubscribedDevicesList";
import { SettingsTeacherList, type SettingsTeacherListData } from "../customSettings/SettingsTeacherList";
import { SettingsUntisAccessesList } from "../customSettings/SettingsUntisAccessesList";
import { PushService } from "../notifications/PushService";
import { SyntaxInputField } from "../syntaxInputField/SyntaxInputField";
import { UserManagement } from "../userManagement/UserManagement";
import Utils from "../Utils";
import { Settings } from "./Settings";
import type { SettingsColorSelectorElement } from "./SettingsColorSelectorElement";
import type { SettingsFoldableSectionData } from "./SettingsFoldableSectionElement";
import { initForSettings, loadSettings, SETTINGS_ELEMENTS, type SettingsData } from "./SettingsGenerator";
import { SettingsTitleElement, type SettingsContentData, type SettingsContentElement, type SettingsTitleData } from "./SettingsTitleElement";
import type { SettingsToggleElement } from "./SettingsToggleElement";


export async function initSettings() {

    const TEACHER_SETTINGS = generateTeacherSettings();

    const NOTIFICATION_MESSAGE_LAYOUT = generateNotificationsMessageLayout();

    const ALL_SUBSCRIBED_DEVICES = await PushService.getAllSubscriptions();

    let settingsPushServiceList: SettingsPushServiceSubscribedDevicesList | undefined;

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
            id: "notifications",
            label: "Notifications",
            selected: false,
            options: [
                {
                    type: "title",
                    title: "Notifications",
                    hnumber: 1,
                    content: [
                        {
                            type: "toggle",
                            label: "Enable Notifications",
                            title: " ",
                            name: "enableNotifications",
                            description: "To get notifications when a lesson is canceled or changed",
                            async onchange(checked, getOtherElement) {
                                if (checked) {
                                    console.log(await PushService.isPushEnabled());
                                    if (await PushService.isPushEnabled()) {
                                        PushService.updateEndpoint(true);
                                    }
                                    Utils.success("Push notifications enabled!");
                                } else {
                                    Utils.error("Push notifications disabled!"); // in reality success but is better red because faster to notice it is off
                                }

                                if (checked) {
                                    (getOtherElement("enableNotificationsOnThisDevice") as SettingsToggleElement).setVisible(true);
                                    (getOtherElement("subscribedDevicesTitle") as SettingsTitleElement).setVisible(true);
                                    settingsPushServiceList?.setVisible(true);
                                } else {
                                    (getOtherElement("enableNotificationsOnThisDevice") as SettingsToggleElement).setVisible(false);
                                    (getOtherElement("subscribedDevicesTitle") as SettingsTitleElement).setVisible(false);
                                    settingsPushServiceList?.setVisible(false);
                                }

                                changed("notificationsEnabled", false, checked);
                            },
                            onload(checked, getOtherElement) {
                                if (UserManagement.ALL_DATA) {
                                    if (UserManagement.ALL_DATA.preferences.notificationsEnabled) {
                                        (getOtherElement("enableNotifications") as SettingsToggleElement).setChecked(UserManagement.ALL_DATA.preferences.notificationsEnabled);
                                        checked = UserManagement.ALL_DATA.preferences.notificationsEnabled;
                                    }
                                }
                                console.log(getOtherElement("subscribedDevicesTitle"));

                                if (checked) {
                                    (getOtherElement("enableNotificationsOnThisDevice") as SettingsToggleElement).setVisible(true);
                                    (getOtherElement("subscribedDevicesTitle") as SettingsTitleElement).setVisible(true);
                                    settingsPushServiceList?.setVisible(true);
                                } else {
                                    (getOtherElement("enableNotificationsOnThisDevice") as SettingsToggleElement).setVisible(false);
                                    (getOtherElement("subscribedDevicesTitle") as SettingsTitleElement).setVisible(false);
                                    settingsPushServiceList?.setVisible(false);
                                }
                            }
                        },
                        {
                            type: "toggle",
                            label: "Enable Notifications On this Device",
                            title: " ",
                            name: "enableNotificationsOnThisDevice",
                            description: "To get notifications when a lesson is canceled or changed",
                            async onchange(checked, getOtherElement) {
                                if (checked) {
                                    const success = await PushService.updateEndpoint(true);
                                    if (!success) {
                                        Utils.error("Could not enable push notifications on this Device!");
                                    } else {
                                        Utils.success("Push notifications enabled on this Device!");
                                    }
                                    settingsPushServiceList?.addSelf();
                                } else {
                                    const endpoint = PushService.pushSubscription?.endpoint ?? "";
                                    const success = PushService.disablePushNotifications();
                                    if (!success) {
                                        Utils.error("Could not disable push notifications on this Device!");
                                    } else {
                                        Utils.error("Push notifications disabled on this Device!");
                                    }
                                    settingsPushServiceList?.removedSelf(endpoint);
                                }
                            },
                            async onload(checked, getOtherElement) {
                                (getOtherElement("enableNotificationsOnThisDevice") as SettingsToggleElement).setChecked(await PushService.isPushEnabled());
                            }
                        },
                        {
                            type: "title",
                            title: "Subscribed Devices",
                            name: "subscribedDevicesTitle",
                            id: "subscribedDevicesTitle",
                            hnumber: 2,
                            content: [
                                {
                                    type: <SettingsPushServiceSubscribedDevicesListData>(data: SettingsPushServiceSubscribedDevicesListData) => settingsPushServiceList = new SettingsPushServiceSubscribedDevicesList(data as any),
                                    name: "subscribedDevicesList",
                                    allSubscribers: ALL_SUBSCRIBED_DEVICES
                                }
                            ]
                        }
                    ]
                },
                {
                    type: "title",
                    title: "Notification Text Layout",
                    hnumber: 1,
                    content: [
                        ...NOTIFICATION_MESSAGE_LAYOUT
                    ]
                },
                {
                    type: "title",
                    title: "Exam Reminder Notifications",
                    hnumber: 1,
                    content: [
                        {
                            type: "textField",
                            desc: "List of times to notify before an exam (separated by commas) (e.g. 1w,1d,2h,30m)",
                            title: "Exam Reminder",
                            label: "Exam Reminder Notifications",
                            validation(value: string): string {
                                const parts = value.split(",");
                                const validParts: string[] = [];
                                const regex = /(\d+)([wdhm])?/;
                                for (const part of parts) {
                                    if (regex.test(part)) {
                                        validParts.push(part);
                                    }
                                }
                                return (validParts.length > 0 ? validParts.join(",") : "") + (value.endsWith(",") ? "," : "");
                            },
                            name: "examReminderTimes",
                            id: "examReminderTimes",
                            value: UserManagement.ALL_DATA?.preferences.examReminderTimes || "1w,1d",
                            onchange(value, getOtherElement) {
                                if (UserManagement.ALL_DATA) {
                                    UserManagement.ALL_DATA.preferences.examReminderTimes = value;
                                }
                                changed("examReminderTimes", "", value);
                            },
                        }
                    ]
                }
            ],
            elements: []
        },
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
                                                (getOtherElement("separateChangeColors") as SettingsToggleElement).setChecked(UserManagement.ALL_DATA.preferences.oneColorForEveryChange);
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

        const foldableElement: SettingsFoldableSectionData = {
            type: "foldableSection",
            content: settingsElementTitle,
            name: "foldable" + school,
            open: false
        }
        settingData.push(foldableElement);
    }
    return settingData;
}

function generateNotificationsMessageLayout(): SettingsNotificationMessageLayoutData[] {

    const labels: {
        [key: string]: string;
    } = {
        lessonNormalAgain: "Lesson Normal Again Message",
        lessonCancelled: "Lesson Cancelled Message",
        lessonReplacedByAdditional: "Lesson Replaced By an Additional Lesson Message",
        lessonReplacedByEvent: "Lesson Replaced By an Event Message",
        teacherSubstitution: "Teacher Substitution Message",
        teacherAbsent: "Teacher Absent Message",
        roomSubstitution: "Room Substitution Message",
        event: "Event Message",
        additionalLesson_new: "Additional Lesson Message",
        exam: "Exam Message"
    }

    const notificationMessageLayout: SettingsNotificationMessageLayoutData[] = [];

    for (const notificationMessageLayoutKey of Object.keys(labels)) {
        const settingElement: SettingsNotificationMessageLayoutData = {
            type: <SettingsNotificationMessageLayoutData>(data: SettingsNotificationMessageLayoutData) => new SettingsNotificationMessageLayoutElement((data as any)),
            name: "notificationMessageLayout" + notificationMessageLayoutKey,
            label: labels[notificationMessageLayoutKey],
            onchange(newValue) {
                if (UserManagement.ALL_DATA && UserManagement.ALL_DATA.preferences) {
                    UserManagement.ALL_DATA.preferences.notificationMessageLayouts[notificationMessageLayoutKey as keyof NotificationMessageLayouts] = newValue;
                    UserManagement.updatePreferences({
                        notificationMessageLayouts: {
                            [notificationMessageLayoutKey as keyof NotificationMessageLayouts]: newValue
                        } as any
                    });
                }
            },
            onEnableStateChange(enabled: boolean) {
                if (UserManagement.ALL_DATA && UserManagement.ALL_DATA.preferences) {
                    UserManagement.ALL_DATA.preferences.notificationMessageEnabledLayouts[notificationMessageLayoutKey as keyof NotificationMessageEnabledLayouts] = enabled;
                    UserManagement.updatePreferences({
                        notificationMessageEnabledLayouts: {
                            [notificationMessageLayoutKey as keyof NotificationMessageEnabledLayouts]: enabled
                        } as any
                    });
                }
            },
            isEnabled: UserManagement.ALL_DATA?.preferences.notificationMessageEnabledLayouts[notificationMessageLayoutKey as keyof NotificationMessageEnabledLayouts] !== undefined
                ?
                UserManagement.ALL_DATA?.preferences.notificationMessageEnabledLayouts[notificationMessageLayoutKey as keyof NotificationMessageEnabledLayouts]
                :
                true,
            defaultValue: UserManagement.ALL_DATA?.preferences.notificationMessageLayouts[notificationMessageLayoutKey as keyof NotificationMessageLayouts] || "",
            additionalCommands: []
        };

        if (notificationMessageLayoutKey == "exam") {
            settingElement.additionalCommands = [
                {
                    match: "timeUntil",
                    color: SyntaxInputField.NUMBER,
                    hoverInfo: "2",
                    description: "How many Days until the exam"
                },
                {
                    match: "timeUntil.totalHours",
                    color: SyntaxInputField.NUMBER,
                    hoverInfo: "200",
                    description: "How many hours total until the exam"
                },
                {
                    match: "timeUntil.hours",
                    color: SyntaxInputField.NUMBER,
                    hoverInfo: "8",
                    description: "How many hours until the exam time"
                },
                {
                    match: "timeUntil.minutes",
                    color: SyntaxInputField.NUMBER,
                    hoverInfo: "30",
                    description: "How many minutes until the exam minutes"
                },
                {
                    match: "timeUntil.totalMinutes",
                    color: SyntaxInputField.NUMBER,
                    hoverInfo: "500",
                    description: "How many minutes total until the exam minutes"
                },
                {
                    match: "timeUntil.totalDays",
                    color: SyntaxInputField.NUMBER,
                    hoverInfo: "8",
                    description: "How many days total until the exam minutes"
                },
                {
                    match: "timeUntil.days",
                    color: SyntaxInputField.NUMBER,
                    hoverInfo: "6",
                    description: "How many days until the exam minutes"
                },
                {
                    match: "timeUntil.totalWeeks",
                    color: SyntaxInputField.NUMBER,
                    hoverInfo: "1",
                    description: "How many weeks total until the exam minutes"
                }
            ];
        }

        notificationMessageLayout.push(settingElement);
    }
    return notificationMessageLayout;
}