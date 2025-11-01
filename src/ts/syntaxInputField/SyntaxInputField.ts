export type Command = {
    match?: string;
    regex?: RegExp;
    color?: string;
    description?: string;
    completion?: string;
    hoverInfo?: string;
    matches?: Match[];
    priority?: "beforeVariableResolution";
}

export type Match = {
    color?: string;
    match?: string;
    regex?: RegExp;
    replacement?: string;
    hoverInfo?: string;
}

export type Completion = {
    completion: string;
    description: string;
    display: string;
    hoverInfo?: string;
    completionPosition: "start" | "end" | "contains" | "match";
    callback: (completion: Completion) => void;
};

export class SyntaxInputField {
    // TODO: Create Code Completions

    public static UNKNOWN_COLOR = "#FF0000";
    public static TIME_COLOR = "#0000F0";
    public static NUMBER = "#00F000";
    public static STRING = "#A060F0";
    public static BOOLEAN = "#f060b4";
    public static PARAMETER = "#60B0F0";
    public static OPERATOR = "#a7a7a7ff";
    public static CUSTOM_OPERATOR = "rgba(255, 136, 0, 0.54)";
    public static WHITE = "#FFFFFF";
    public static COMPLETIONS_MATCH_COLOR_BG = "rgba(255, 136, 0, 0.2)";


    private static HOVER_INFO = {
        TIME: "9:00",
        LESSON: "5",
        HOUR: "9",
        MINUTE: "00",
        SUBJECT: "Mathematik",
        SUBJECT_SHORT: "MAT01",
        ROOM: "O04",
        ROOM_FULL: "Oberstufe 04 (Mitte EG)",
        TEACHER: "Mu",
        TEACHER_FULL: "Max Musterman",
        TEACHER_SHORT: "Mu",
        TEACHER_SURNAME: "Musterman",
        TEACHER_FIRST_NAME: "Max",
        SUBJECTS: "Deu,Mat",
        BOOLEAN: 'true | false - kann mit ?"Yes"|"No" kombiniert werden',
        LESSON_RANGE: "1-2. OR 1.",
        DAY: "Monday",
        DAY_SHORT: "Mo",
        INFO_FOR_LESSON: "Bring Book"
    }

    private static COMMANDS: Command[] = [
        {
            match: "lessonInfo",
            description: "Information for the Lesson",
            hoverInfo: SyntaxInputField.HOVER_INFO.INFO_FOR_LESSON,
            color: SyntaxInputField.STRING
        },
        {
            match: "day",
            description: "The Day of the Lesson",
            hoverInfo: SyntaxInputField.HOVER_INFO.DAY,
            color: SyntaxInputField.STRING
        },
        {
            match: "day.short",
            description: "The short day name of the lesson",
            hoverInfo: SyntaxInputField.HOVER_INFO.DAY_SHORT,
            color: SyntaxInputField.STRING
        },
        {
            match: "startTime",
            description: "The Start Time of the Lesson Block",
            hoverInfo: SyntaxInputField.HOVER_INFO.TIME,
            color: SyntaxInputField.TIME_COLOR
        },
        {
            match: "startLesson",
            description: "The Start Lesson Number of the Lesson Block",
            hoverInfo: SyntaxInputField.HOVER_INFO.LESSON,
            color: SyntaxInputField.STRING
        },
        {
            match: "startTime.hour",
            description: "The Hour of the Start Time",
            hoverInfo: SyntaxInputField.HOVER_INFO.HOUR,
            color: SyntaxInputField.NUMBER
        },
        {
            match: "startTime.minute",
            description: "The Minute of the Start Time",
            hoverInfo: SyntaxInputField.HOVER_INFO.MINUTE,
            color: SyntaxInputField.NUMBER
        },

        {
            match: "endTime",
            description: "The End Time of the Lesson Block",
            hoverInfo: SyntaxInputField.HOVER_INFO.TIME,
            color: SyntaxInputField.TIME_COLOR
        },
        {
            match: "endLesson",
            description: "The End Lesson Number of the Lesson Block",
            hoverInfo: SyntaxInputField.HOVER_INFO.LESSON,
            color: SyntaxInputField.STRING
        },
        {
            match: "endLesson.hour",
            description: "The Hour of the End Time",
            hoverInfo: SyntaxInputField.HOVER_INFO.HOUR,
            color: SyntaxInputField.NUMBER
        },
        {
            match: "endLesson.minute",
            description: "The Minute of the End Time",
            hoverInfo: SyntaxInputField.HOVER_INFO.MINUTE,
            color: SyntaxInputField.NUMBER
        },

        {
            match: "lessonRange",
            description: "The Range of the lesson",
            hoverInfo: SyntaxInputField.HOVER_INFO.LESSON_RANGE,
            color: SyntaxInputField.NUMBER
        },

        {
            match: "subject",
            description: "The Short Name of the Subject of the Lesson Block",
            hoverInfo: SyntaxInputField.HOVER_INFO.SUBJECT_SHORT,
            color: SyntaxInputField.STRING
        },
        {
            match: "subject.full",
            description: "The Full Name of the Subject of the Lesson Block",
            hoverInfo: SyntaxInputField.HOVER_INFO.SUBJECT,
            color: SyntaxInputField.STRING
        },


        {
            match: "room",
            description: "The Room of the Lesson Block",
            hoverInfo: SyntaxInputField.HOVER_INFO.ROOM,
            color: SyntaxInputField.STRING
        },
        {
            match: "room.full",
            description: "The Full Name of the Room of the Lesson Block",
            hoverInfo: SyntaxInputField.HOVER_INFO.ROOM_FULL,
            color: SyntaxInputField.STRING
        },

        {
            match: "teacher",
            description: "The Short Name of the Teacher of the Lesson Block",
            hoverInfo: SyntaxInputField.HOVER_INFO.TEACHER,
            color: SyntaxInputField.STRING
        },
        {
            match: "teacher.full",
            description: "The Full Name of the Teacher of the Lesson Block",
            hoverInfo: SyntaxInputField.HOVER_INFO.TEACHER_FULL,
            color: SyntaxInputField.STRING
        },
        {
            match: "teacher.surname",
            description: "The Surname of the Teacher of the Lesson Block",
            hoverInfo: SyntaxInputField.HOVER_INFO.TEACHER_SURNAME,
            color: SyntaxInputField.STRING
        },
        {
            match: "teacher.firstName",
            description: "The First Name of the Teacher of the Lesson Block",
            hoverInfo: SyntaxInputField.HOVER_INFO.TEACHER_FIRST_NAME,
            color: SyntaxInputField.STRING
        },
        {
            match: "teacher.subjects",
            description: "The Subjects taught by the Teacher of the Lesson Block",
            hoverInfo: SyntaxInputField.HOVER_INFO.SUBJECTS,
            color: SyntaxInputField.STRING
        },
        {
            match: "teacher.teachesThisSubject",
            description: "Whether the Teacher teaches this Subject",
            hoverInfo: SyntaxInputField.HOVER_INFO.BOOLEAN,
            color: SyntaxInputField.BOOLEAN
        },
        {
            regex: /\(([^)]+)\)(==|!=|>|>=|<|<=|:contains:|:startsWith:|:endsWith:|:startsWithAnyIn:|:endsWithAnyIn:)\(([^)]+)\)\?\(([^)]+)\):\(([^)]+)\)/gm,
            matches: [
                {
                    regex: /\(([^)]+)\)(==|!=|>|>=|<|<=|:contains:|:startsWith:|:endsWith:|:startsWithAnyIn:|:endsWithAnyIn:)\(([^)]+)\)\?\(([^)]+)\):\(([^)]+)\)/gm,
                    replacement: `(<color style='color: ${SyntaxInputField.PARAMETER};' >$1</color><color style='color: ${SyntaxInputField.OPERATOR}' >)<color style='color: ${SyntaxInputField.CUSTOM_OPERATOR};' >$2</color>(</color><color style='color: ${SyntaxInputField.PARAMETER};' >$3</color><color style='color: ${SyntaxInputField.OPERATOR};'>)?(</color><color style='color: ${SyntaxInputField.PARAMETER};' >$4</color><color style='color: ${SyntaxInputField.OPERATOR};'>):(</color><color style='color: ${SyntaxInputField.PARAMETER};' >$5</color><color style='color: ${SyntaxInputField.OPERATOR};' >)</color>`
                }
            ]
        },
        {
            priority: "beforeVariableResolution",
            regex: /({[^)}{]+})\?\(([^)]*)\):\(([^)]*)\)/gm,
            matches: [
                {
                    regex: /({[^)}{]+})\?\(([^)]*)\):\(([^)]*)\)/gm,
                    replacement: `$1<color style='color: ${SyntaxInputField.OPERATOR};' >?(</color><color style='color: ${SyntaxInputField.PARAMETER};' >$2</color><color style='color: ${SyntaxInputField.OPERATOR};' >):(</color><color style='color: ${SyntaxInputField.PARAMETER};' >$3</color><color style='color: ${SyntaxInputField.OPERATOR};' >)</color>`
                }
            ]
        },
        {
            regex: /\\(t|n)/gm,
            matches: [
                {
                    regex: /\\(t|n)/gm,
                    replacement: `<color style='color: ${SyntaxInputField.OPERATOR};'>\\$1</color>`
                }
            ]
        }
    ];


    private elementEditable: HTMLDivElement;
    private isSuggestionOpen: boolean = false;
    private lastValue: string = "";
    private completionDiv: HTMLDivElement;
    private completionTable: HTMLTableElement;
    private completionTableBody: HTMLTableSectionElement;
    private completionTableHead: HTMLTableSectionElement;
    public onchange: (newValue: string) => void = () => { };
    private additionalCommands: Command[];

    constructor(additionalCommands: Command[] = []) {
        this.additionalCommands = additionalCommands;

        // console.log(SyntaxInputField.COMMANDS.filter(e => !!e.match).map(e => e.match))

        this.elementEditable = document.createElement("div");
        this.elementEditable.classList.add("syntax-input-wrapper");
        this.elementEditable.contentEditable = "true";
        this.elementEditable.addEventListener("input", (event) => this.inputChange(event as InputEvent));
        this.elementEditable.addEventListener("keydown", (event) => this.keypress(event));
        document.addEventListener("selectionchange", () => {
            const sel = window.getSelection();
            if (!sel || !sel.isCollapsed) return;
            if (document.activeElement !== this.elementEditable) return;

            const pos = this.getCaretCharacterOffsetWithin(this.elementEditable);
            this.selectionChange(pos);
        });

        document.addEventListener("click", (event) => {
            if (!event.target) return;
            if (this.elementEditable == event.target || this.elementEditable.contains(event.target as Node) || this.completionDiv.contains(event.target as Node)) return;
            this.closeSuggestions();
        });

        this.completionDiv = document.createElement("div");
        this.completionDiv.classList.add("completionDiv");

        this.completionTable = document.createElement("table");
        this.completionTableHead = document.createElement("thead");
        this.completionTableBody = document.createElement("tbody");
        const headerRow = this.completionTableHead.insertRow();
        headerRow.insertCell().innerHTML = "";
        headerRow.insertCell().innerHTML = "";
        headerRow.insertCell().innerHTML = "";

        this.completionTable.appendChild(this.completionTableHead);
        this.completionTable.appendChild(this.completionTableBody);

        this.completionDiv.appendChild(this.completionTable);

    }

    public setValue(value: string) {
        this.elementEditable.innerText = value;
        this.lastValue = value;
        this.reparseValue(value, value.length, true);
    }

    private updateCompletions(completionList: Completion[]) {
        this.completionTableBody.innerHTML = "";
        for (const completion of completionList) {
            const tableRow = this.completionTableBody.insertRow();

            const nameCell = tableRow.insertCell();
            const descriptionCell = tableRow.insertCell();
            const formatCell = tableRow.insertCell();

            nameCell.innerHTML = completion.display;
            descriptionCell.innerHTML = completion.description;
            formatCell.innerHTML = completion.hoverInfo ?? "";

            tableRow.addEventListener("click", () => {
                completion.callback?.(completion);
            });
        }

        if (completionList.length == 0) {

            const tableRow = this.completionTableBody.insertRow();
            const cell = tableRow.insertCell();
            cell.innerHTML = "No Completions";
            cell.classList.add("noCompletions");
        }



        // const suggestionBox = this.completionDiv.getBoundingClientRect();

        const overflowElement = document.querySelector("#settingsDialog .overflow:has(#contents)");
        if (!overflowElement) return;

        const overfloBox = overflowElement.getBoundingClientRect();

        const elemebtBox = this.elementEditable.getBoundingClientRect();


        const suggestionHeight = (30 / 100) * window.innerHeight;

        // temp1.getBoundingClientRect().height - (temp0.getBoundingClientRect().y + temp2.scrollTop) - temp0.getBoundingClientRect().height
        //temp2.getBoundingClientRect().height - temp0.getBoundingClientRect().top


        const spaceToBottomLeft = overfloBox.height - elemebtBox.top;
        const spaceToTopLeft = elemebtBox.top;

        // console.log(spaceToBottomLeft, spaceToTopLeft, suggestionHeight);

        if (spaceToBottomLeft >= suggestionHeight || (spaceToTopLeft < suggestionHeight)) {
            this.completionDiv.classList.add("bottom");
            this.completionDiv.classList.remove("top");
        } else {
            this.completionDiv.classList.add("top");
            this.completionDiv.classList.remove("bottom");
        }


    }

    public getCompletionElement() {
        return this.completionDiv;
    }

    public getElement(): HTMLDivElement {
        return this.elementEditable;
    }

    private selectionChange(newPos: number) {
        // this.closeSuggestions();

        const value = this.elementEditable.innerText;

        const startString = value.substring(0, newPos);
        const endString = value.substring(newPos, value.length);

        if (startString.match(/{[^ }]*$/g)) {
            if (endString.match(/^[^ {]*}/g)) {
                this.openSuggestions();
            } else {
                this.closeSuggestions();
            }
        } else {
            this.closeSuggestions();
        }
    }

    private updateSuggestionsList() {

        let value = this.elementEditable.innerText;
        let cursorPosition = this.getCaretCharacterOffsetWithin(this.elementEditable);

        const startString = value.substring(0, cursorPosition);
        const endString = value.substring(cursorPosition, value.length);
        let startMatch = null;
        let endMatch = null;
        if (startMatch = startString.match(/{[^ }]*$/g)) {
            if (endMatch = endString.match(/^[^ {]*}/g)) {
                if (startMatch.length == 0 || endMatch.length == 0) return;
                let startString = startMatch[0];
                let match = (startMatch[0] + endMatch[0]);
                match = match.substring(1, match.length - 1);

                const onComplete = (completion: Completion) => {
                    const fullMatch = completion.completion;
                    const searchPosStart = cursorPosition - match.length;
                    const matchIndex = value.indexOf(match, searchPosStart < 0 ? 0 : searchPosStart);
                    if (matchIndex == -1) return;
                    value = value.substring(0, matchIndex - 1) + "{" + fullMatch + "}" + value.substring(matchIndex + match.length + 1, value.length);
                    cursorPosition += fullMatch.length - startString.length + 1;
                    this.setCaretAtPosition(this.elementEditable, cursorPosition);
                    this.reparseValue(value, cursorPosition);
                };

                const possibleCompletions = [...SyntaxInputField.COMMANDS, ...this.additionalCommands]
                    .map(e => ({ hoverInfo: e.hoverInfo, originalValue: (e.match ?? e.match), value: (e.match ?? e.match), description: (e.description ?? "") }))
                    .filter(e => {
                        if (!e.value) return false;
                        if (match == "") return true;
                        if (e.value.includes(match)) return true;
                        return false;
                    })
                    .map(e => {
                        if (!e.value) return null;
                        if (match == "") return {
                            display: e?.value,
                            hoverInfo: e?.hoverInfo,
                            completion: e?.originalValue,
                            description: e?.description,
                            completionPosition: "match",
                            callback: onComplete
                        } as Completion;
                        const length = match.length;
                        let value = e.value;
                        let completionPosition = "none";
                        if (value.startsWith(match)) {
                            value = `<mark style='background-color: ${SyntaxInputField.COMPLETIONS_MATCH_COLOR_BG}; color: inherit;'>` + value.substring(0, length) + "</mark>" + value.substring(length, value.length);
                            completionPosition = "start";
                        } else if (value.endsWith(match)) {
                            value = value.substring(0, value.length - length) + `<mark style='background-color: ${SyntaxInputField.COMPLETIONS_MATCH_COLOR_BG}; color: inherit;'>` + value.substring(value.length - length, value.length) + "</mark>";
                            completionPosition = "end";
                        } else {
                            const matchIndex = value.indexOf(match);
                            value = value.substring(0, matchIndex) + `<mark style='background-color: ${SyntaxInputField.COMPLETIONS_MATCH_COLOR_BG}; color: inherit;'>` + value.substring(matchIndex, matchIndex + length) + "</mark>" + value.substring(matchIndex + length, value.length);
                            completionPosition = "contains";
                        }
                        if (completionPosition == "none") return null;
                        e.value = value;
                        return {
                            display: e?.value,
                            hoverInfo: e?.hoverInfo,
                            completion: e?.originalValue,
                            description: e?.description,
                            completionPosition: completionPosition,
                            callback: onComplete
                        } as Completion;
                    });

                if (!this.completionDiv.classList.contains("visible")) {
                    this.completionDiv.classList.add("visible");
                    this.completionDiv.classList.add("animate");
                }
                this.completionDiv.addEventListener("animationend", () => this.completionDiv.classList.remove("animate"), { once: true });
                this.updateCompletions(possibleCompletions.filter(e => !!e));



            }
        }


        if (!this.completionDiv.classList.contains("visible")) {
            this.completionDiv.classList.add("visible");
            this.completionDiv.classList.add("animate");
            const onComplete = (completion: Completion) => {
                const fullMatch = completion.completion;
                value = value.substring(0, cursorPosition) + "{" + fullMatch + "}" + value.substring(cursorPosition, value.length);
                cursorPosition += fullMatch.length + 1;
                this.setCaretAtPosition(this.elementEditable, cursorPosition);
                this.reparseValue(value, cursorPosition);
            };

            const possibleCompletions = [...SyntaxInputField.COMMANDS, ...this.additionalCommands]
                .map(e => ({ hoverInfo: e.hoverInfo, originalValue: (e.match ?? e.match), value: (e.match ?? e.match), description: (e.description ?? "") }))
                .filter(e => {
                    if (!e.value) return false;
                    return true;
                })
                .map(e => {
                    return {
                        display: e?.value,
                        hoverInfo: e?.hoverInfo,
                        completion: e?.originalValue,
                        description: e?.description,
                        completionPosition: "match",
                        callback: onComplete
                    } as Completion;
                });

            if (!this.completionDiv.classList.contains("visible")) {
                this.completionDiv.classList.add("visible");
                this.completionDiv.classList.add("animate");
            }
            this.completionDiv.addEventListener("animationend", () => this.completionDiv.classList.remove("animate"), { once: true });
            this.updateCompletions(possibleCompletions.filter(e => !!e));

        }

    }

    private openSuggestions() {
        this.updateSuggestionsList();

        const rectElement = this.elementEditable.getBoundingClientRect();
        const parentRectElement = this.elementEditable.parentElement?.getBoundingClientRect();

        const yOffset = parentRectElement ? parentRectElement.y - rectElement.y : rectElement.y;

        this.completionDiv.style.setProperty("--top", yOffset + "px");
    }

    private closeSuggestions() {
        if (!this.completionDiv.classList.contains("visible")) return;
        this.completionDiv.classList.remove("visible");
        this.completionDiv.classList.add("animate");
        this.completionDiv.addEventListener("animationend", () => this.completionDiv.classList.remove("animate"), { once: true });
    }

    private toggleSuggestions() {
        this.isSuggestionOpen = !this.isSuggestionOpen;
        if (this.isSuggestionOpen) {
            this.openSuggestions();
        } else {
            this.closeSuggestions();
        }
    }

    private keypress(e: KeyboardEvent) {

        let cursorPosition = this.getCaretCharacterOffsetWithin(this.elementEditable);
        let value = this.elementEditable.innerText;
        const insertTextAtPosition = (text: string, position: number) => {
            value = value.substring(0, position) + text + value.substring(position, value.length);
        };

        console.log(e.key);
        switch (e.key) {
            case " ":
                if (e.ctrlKey) {
                    console.log("Control + Space pressed");
                    this.toggleSuggestions();
                }
                break;
            case "Enter":
                insertTextAtPosition("\\n", cursorPosition);
                this.reparseValue(value, cursorPosition);
                this.setCaretAtPosition(this.elementEditable, cursorPosition + 2);
                e.preventDefault();
                break;
            case "Tab":
                insertTextAtPosition("\\t", cursorPosition);
                this.reparseValue(value, cursorPosition);
                this.setCaretAtPosition(this.elementEditable, cursorPosition + 2);
                e.preventDefault();
                break;
        }

    }

    private inputChange(e: InputEvent) {
        let cursorPosition = this.getCaretCharacterOffsetWithin(this.elementEditable);
        let value = this.elementEditable.innerText;

        const insertTextAtPosition = (text: string, position: number) => {
            value = value.substring(0, position) + text + value.substring(position, value.length);
        };

        if (e.type == "input") {

            if (e.inputType == "insertText") {
                if (e.data == "{") {
                    insertTextAtPosition("}", cursorPosition);
                    this.setCaretAtPosition(this.elementEditable, cursorPosition);
                    this.openSuggestions();
                } else if (e.data == "\n") {
                    e.preventDefault();
                } else {
                    const startString = value.substring(0, cursorPosition);
                    const endString = value.substring(cursorPosition, value.length);

                    if (startString.match(/{[^ }]*$/g)) {
                        if (endString.match(/^[^ {]*}/g)) {
                            this.openSuggestions();
                        } else {
                            this.closeSuggestions();
                        }
                    } else {
                        this.closeSuggestions();
                    }

                }
            } else if (e.inputType == "deleteContentBackward") {

                const diffIndex = this.findDiffIndex(this.lastValue, value);
                if (diffIndex != -1) {
                    const char = this.lastValue[diffIndex];
                    if (char == "{") {
                        const nextIndex = diffIndex + 1;
                        if (this.lastValue.length > nextIndex) {
                            const nextChar = this.lastValue[nextIndex];
                            if (nextChar == "}") {
                                value = value.substring(0, diffIndex) + value.substring(diffIndex + 1, value.length);
                                console.log(value);
                            }
                        }
                    } else if (char == "}") {
                        const lastIndex = diffIndex - 1;
                        if (lastIndex >= 0) {
                            const lastChar = this.lastValue[lastIndex];
                            if (lastChar == "{") {
                                value = value.substring(0, lastIndex) + value.substring(lastIndex + 1, value.length);
                                cursorPosition = cursorPosition - 1;
                                if (cursorPosition < 0) cursorPosition = 0;
                            }
                        }
                    }
                }

            } else if (e.inputType == "insertParagraph" || e.inputType == "insertLineBreak") {
            }
        }

        this.lastValue = value;
        this.reparseValue(value, cursorPosition);
    }

    private findDiffIndex(a: string, b: string): number {
        if (a.length == 0 || b.length == 0) return -1;
        let i = 0;
        for (; i < a.length && i < b.length; i++) {
            if (a[i] !== b[i]) break;
        }
        return i;
    }

    private reparseValue(value: string, cursorPosition: number, silent: boolean = false) {
        let htmlValue = value.replaceAll("\n", "\\n");;

        htmlValue = this.compileRegexes(htmlValue, "beforeVariableResolution");

        const matches = new Set(value.match(/{([^ }{,]*)}/g));
        for (const match of matches) {
            htmlValue = htmlValue.replaceAll(match, this.getHtmlFor(match))
        }

        htmlValue = this.compileRegexes(htmlValue, undefined);

        this.elementEditable.innerHTML = htmlValue;

        (this.elementEditable.querySelectorAll("color[data-match-hover]") as NodeListOf<HTMLElement>).forEach(element => {
            element.addEventListener("mouseover", () => {
                element.classList.add("animate");
                element.classList.add("hover");
            });
            element.addEventListener("mouseleave", () => {
                element.classList.add("animate");
                element.classList.remove("hover");
            });
            element.addEventListener("animationend", () => {
                element.classList.remove("animate");
            });
        })

        this.setCaretAtPosition(this.elementEditable, cursorPosition);
        if (!silent) this.onchange(value);
    }


    private compileRegexes(htmlValue: string, priotity?: "beforeVariableResolution"): string {
        for (const command of [...SyntaxInputField.COMMANDS, ...this.additionalCommands].filter(e => e.priority == priotity).filter(e => e.regex != undefined)) {
            if (!command) continue;
            const matches = new Set(htmlValue.match(command.regex!));
            for (const matchString of matches) {

                if (command.matches && command.matches.length > 0) {
                    let modifiedMatch = matchString;
                    for (const match of command.matches) {
                        if (match.match) {
                            modifiedMatch = modifiedMatch.replace(match.match, `\u9999 data-match-hover='${match.hoverInfo ?? ""}' ${match.color}\u9998${match.match}\u9997`);
                            continue;
                        }
                        if (!match.regex || !match.replacement) continue;
                        modifiedMatch = modifiedMatch.replace(match.regex, match.replacement);
                        // if (priotity) console.log(match.regex, "\n\n", match.replacement, "\n\n", matchString, "\n\n", modifiedMatch);
                    }
                    modifiedMatch = modifiedMatch.replaceAll("\u9999", "<color style='color: ").replaceAll("\u9998", "'>").replaceAll("\u9997", "</color>");
                    if (command.color) htmlValue = htmlValue.replaceAll(matchString, `<color style='color: ${command.color}'>${modifiedMatch}</color>`)
                    else htmlValue = htmlValue.replaceAll(matchString, modifiedMatch)
                } else {
                    if (command.color) htmlValue.replaceAll(matchString, `<color style='color: ${command.color}' data-match-hover='${command.hoverInfo ?? ""}'>${matchString}</color>`)
                }

            }
        }
        return htmlValue;
    }

    private getHtmlFor(match: string): string {
        for (const command of [...SyntaxInputField.COMMANDS, ...this.additionalCommands]) {
            if (command.match && command.match == match.replace(/[{}]/g, "")) {
                return `<color style='color: ${command.color}' data-match-hover='${command.hoverInfo ?? ""}' >${match}</color>`;
            }
        }
        return `<color style='color: ${SyntaxInputField.UNKNOWN_COLOR}'>${match}</color>`;
    }

    private getCaretCharacterOffsetWithin(element: HTMLElement) {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return 0;

        const range = selection.getRangeAt(0).cloneRange();
        // Range von Anfang des Elements bis zur Cursor-Position
        const preRange = document.createRange();
        preRange.selectNodeContents(element);
        preRange.setEnd(range.endContainer, range.endOffset);

        return preRange.toString().length;
    }

    private setCaretAtPosition(el: HTMLElement, charIndex: number) {
        const range = document.createRange();
        const sel = window.getSelection();

        let nodeStack: HTMLElement[] = [el];
        let foundStart = false;
        let charCount = 0;
        let node;

        while (!foundStart && (node = nodeStack.pop())) {
            if (node.nodeType === 3) { // Text node
                // @ts-ignore
                const nextCount = charCount + node.length;
                if (charIndex >= charCount && charIndex <= nextCount) {
                    range.setStart(node, charIndex - charCount);
                    range.collapse(true);
                    foundStart = true;
                    break;
                }
                charCount = nextCount;
            } else {
                let i = node.childNodes.length;
                while (i--) nodeStack.push(node.childNodes[i] as HTMLElement);
            }
        }

        if (!foundStart) range.selectNodeContents(el); // fallback
        sel?.removeAllRanges();
        sel?.addRange(range);
    }

    private insertTextAtPosition(el: HTMLElement, text: string, charIndex: number) {
        const selection = window.getSelection();
        if (!selection) return;

        // First, make sure the element is focused / selected
        const active = document.activeElement;
        if (active !== el && !el.contains(active)) return; // caret not inside element

        // Create a range at the desired character index
        const range = document.createRange();

        let nodeStack: Node[] = [el];
        let charCount = 0;
        let node: Node | undefined;
        let found = false;

        while (!found && (node = nodeStack.pop())) {
            if (node.nodeType === 3) { // text node
                const nextCount = charCount + node.textContent!.length;
                if (charIndex >= charCount && charIndex <= nextCount) {
                    range.setStart(node, charIndex - charCount);
                    range.collapse(true);
                    found = true;
                    break;
                }
                charCount = nextCount;
            } else {
                let i = node.childNodes.length;
                while (i--) nodeStack.push(node.childNodes[i]);
            }
        }

        if (!found) {
            // fallback: append at end
            range.selectNodeContents(el);
            range.collapse(false);
        }

        // Insert the text
        const textNode = document.createTextNode(text);
        range.insertNode(textNode);

        // Move caret after inserted text
        range.setStartAfter(textNode);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
    }




}