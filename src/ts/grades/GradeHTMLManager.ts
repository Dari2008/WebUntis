import { UserManagement } from "../userManagement/UserManagement";
import Utils from "../Utils";
import type { GradeInfluences, GradeValue, Points, Subject } from "../@types/Grades.ts";
import Grade from "./Grade";
import { Images } from "../customSettings/Images.ts";

export class GradeHTMLManager {
    private grades: Grade[] = [];
    private sortedGrades: SortedGrade = {};

    private gradeTableElement: HTMLTableElement = document.createElement("table");
    private gradeTableBody: HTMLTableSectionElement = document.createElement("tbody");
    private addGradeBtn: HTMLButtonElement = document.createElement("button");
    private convertGrades: HTMLButtonElement = document.createElement("button");

    private currentFinalGradeWrapper: HTMLDivElement = document.createElement("div");
    private currentGrade: HTMLDivElement = document.createElement("div");
    private averageWW: HTMLDivElement = document.createElement("div");
    private percentGood: HTMLDivElement = document.createElement("div");
    private totalPoints: HTMLDivElement = document.createElement("div");
    private gradeDeviation: HTMLDivElement = document.createElement("div");
    private currentStats: HTMLDivElement = document.createElement("div");

    private finalGrade: Grade = new Grade("sss", "final", 100, 15);
    private gradeInfluence: GradeInfluences = {};

    private gradeDiv: HTMLDivElement | null;

    constructor() {
        this.grades = UserManagement.ALL_DATA!.grades.map(data => new Grade(data.uuid, data.subject, data.weight, data.points));
        // this.grades = [
        //     new Grade("asd", "Math", 40, 10),
        //     new Grade("assd", "Math", 60, 5),
        //     new Grade("asdd", "Math", 60, 11),
        //     new Grade("asfd", "English", 50, 10),
        //     new Grade("asgd", "English", 40, 3)
        // ];

        this.addGradeBtn.innerHTML = "Add Grade";
        this.addGradeBtn.classList.add("add-grade-btn");

        this.addGradeBtn.addEventListener("click", () => {
            this.addGrade((newGrade: Grade) => {
                this.grades.push(newGrade);
                const typeDef = {
                    points: newGrade.getPoints(),
                    subject: newGrade.getSubject(),
                    weight: newGrade.getWeight(),
                    uuid: newGrade.uuid
                };
                UserManagement.ALL_DATA!.grades.push(typeDef);
                UserManagement.updateGrades("add", [typeDef]);
                this.sortGrades();
                this.updateTable();
            });
        });

        this.convertGrades.innerHTML = "Convert Grades";
        this.convertGrades.classList.add("convertGrades");
        this.convertGrades.addEventListener("click", () => {
            this.openGradeConverter();
        });

        this.gradeDiv = document.querySelector("#grades");


        const thead = document.createElement("thead");

        const headerRow = thead.insertRow();
        for (const header of ["", "Subject", "Grade Count", "Final Grade", "Final Points", ""]) {
            const hr = headerRow.insertCell();
            if (header != "") {
                hr.innerHTML = header;
            }
        }

        this.gradeTableElement.appendChild(thead);
        this.gradeTableElement.appendChild(this.gradeTableBody);


        this.currentFinalGradeWrapper.classList.add("currentFinalGradeWrapper");

        const [currentGradeWrapper, currentGrade] = this.createGradeCircle("Final Grade");
        currentGradeWrapper.classList.add("currentGrade");
        this.currentGrade = currentGrade;


        const [averageWWWrapper, averageWW] = this.createGradeCircle("Average Grade");
        averageWWWrapper.classList.add("averageGrade");
        this.averageWW = averageWW;


        const [percentGoodWrapper, percentGood] = this.createGradeCircle("15 - 7 pts");
        percentGoodWrapper.classList.add("percentGood");
        this.percentGood = percentGood;


        const [totalPointsWrapper, totalPoints] = this.createGradeCircle("Total Points");
        totalPointsWrapper.classList.add("totalPoints");
        this.totalPoints = totalPoints;

        const [gradeDeviationWrapper, gradeDeviation] = this.createGradeCircle("Grade Deviation");
        gradeDeviationWrapper.classList.add("gradeDeviation");
        this.gradeDeviation = gradeDeviation;

        const buttonWrapper = document.createElement("div");
        buttonWrapper.classList.add("gradeButtonWrapper");

        // this.currentGrade.classList.add("currentGrade");
        // this.currentGrade.classList.add("gradeDisplay");
        // this.currentGrade.setAttribute("data-label", "Final Grade");

        // this.averageWW.classList.add("averageGrade");
        // this.averageWW.classList.add("gradeDisplay");
        // this.averageWW.setAttribute("data-label", "Average Grade");

        // this.percentGood.classList.add("percentGood");
        // this.percentGood.classList.add("gradeDisplay");
        // this.percentGood.setAttribute("data-label", "15 - 7 pts");


        // this.totalPoints.classList.add("totalPoints");
        // this.totalPoints.classList.add("gradeDisplay");
        // this.totalPoints.setAttribute("data-label", "Total Points");

        // this.gradeDeviation.classList.add("gradeDeviation");
        // this.gradeDeviation.classList.add("gradeDisplay");
        // this.gradeDeviation.setAttribute("data-label", "Grade Deviation");

        this.currentStats.classList.add("currentStats");

        this.currentFinalGradeWrapper.appendChild(averageWWWrapper);
        this.currentFinalGradeWrapper.appendChild(totalPointsWrapper);
        this.currentFinalGradeWrapper.appendChild(currentGradeWrapper);
        this.currentFinalGradeWrapper.appendChild(gradeDeviationWrapper);
        this.currentFinalGradeWrapper.appendChild(percentGoodWrapper);



        this.currentFinalGradeWrapper.appendChild(this.currentStats);

        buttonWrapper.appendChild(this.addGradeBtn);
        buttonWrapper.appendChild(this.convertGrades);


        this.gradeDiv?.appendChild(this.currentFinalGradeWrapper);
        this.gradeDiv?.appendChild(this.gradeTableElement);
        this.gradeDiv?.appendChild(buttonWrapper);
        console.log(this.gradeDiv);

        this.sortGrades();
        this.updateTable();
    }

    private createGradeCircle(label: string): [HTMLDivElement, HTMLDivElement] {
        const wrapper = document.createElement("div");
        wrapper.classList.add("gradeCircleWrapper");

        const subtitle = document.createElement("span");
        subtitle.classList.add("subtitle");
        subtitle.innerHTML = label;

        const circle = document.createElement("div");
        circle.classList.add("gradeDisplay");

        wrapper.appendChild(circle);
        wrapper.appendChild(subtitle);
        return [wrapper, circle];
    }

    private calcWeightedStdDev(): number {
        let totalWeight = 0;
        let weightedSum = 0;

        for (const g of this.grades) {
            const w = g.getWeight();
            totalWeight += w;
            weightedSum += g.getPoints() * w;
        }

        if (totalWeight === 0) return 0;

        const mean = weightedSum / totalWeight;

        let varianceSum = 0;

        for (const g of this.grades) {
            const w = g.getWeight();
            const diff = g.getPoints() - mean;
            varianceSum += w * diff * diff;
        }

        return Math.sqrt(varianceSum / totalWeight);
    }


    private calculateTotalPoints(): number {
        return this.grades.reduce((prev, current) => prev + current.getPoints(), 0);
    }

    private calculateInfluenceOfGrades(): GradeInfluences | "unknown" {
        let totalWeight = 0;

        for (const grade of this.grades) {
            totalWeight += grade.getWeight();
        }

        if (totalWeight === 0) return "unknown";

        const influences: GradeInfluences = {};

        for (const grade of this.grades) {
            const influencePercent = Math.round((grade.getWeight() / totalWeight * 100) * 100) / 100;
            const marginalInfluence = grade.getWeight() / totalWeight;
            influences[grade.uuid] = {
                grade: grade,
                influence: {
                    percentage: influencePercent,
                    whenPlusOne: Math.round(marginalInfluence * 100) / 100,
                    sensitivity: this.getInfluenceLabel(marginalInfluence)
                }
            };
        }

        return influences;
    }

    private getInfluenceLabel(sensitivity: number): string {
        if (sensitivity >= 0.60) return "very strong";
        if (sensitivity >= 0.40) return "strong";
        if (sensitivity >= 0.20) return "medium";
        if (sensitivity >= 0.05) return "low";
        return "very low";
    }


    private calculatePercentageOfGoodGrades(): number | "unknown" {
        let weightCount = 0;
        let gradeCountGood = 0;

        for (const grades of Object.values(this.sortedGrades)) {
            for (const grade of grades) {
                weightCount++;

                if (grade.getPoints() < 7) continue;
                gradeCountGood++;
            }
        }

        if (gradeCountGood == 0) return "unknown";

        return Math.round(((gradeCountGood / weightCount) * 100)) as Points;

    }

    private calculateAverageGradeWithoutWeights(): Points | "unknown" {
        let weightCount = 0;
        let gradeCount = 0;

        for (const grades of Object.values(this.sortedGrades)) {
            for (const grade of grades) {
                gradeCount += grade.getPoints();
                weightCount++;
            }
        }

        if (gradeCount == 0) return "unknown";

        return Math.round((gradeCount / weightCount) * 100) / 100 as Points;

    }

    private calculateFinalGrade(): Points | "unknown" {
        let weightCount = 0;
        let gradeCount = 0;

        for (const grades of Object.values(this.sortedGrades)) {
            const grade = this.calculateGradeOfSubject(grades);
            if (typeof grade == "string") continue;
            if (!grade) continue;
            if (grade < 0 || grade > 15) {
                console.error("Grade cant be bigger than 15 or smaller than 0");
                continue;
            }

            gradeCount += grade;
            weightCount++;
        }

        if (gradeCount == 0) return "unknown";

        return Math.round((gradeCount / weightCount) * 100) / 100 as Points;
    }

    private calculateGradeOfSubject(grades: Grade[]): Points | "unknown" {
        let weightCount = 0;
        let gradeCount = 0;

        for (const grade of grades) {
            weightCount += grade.getWeight();
            gradeCount += grade.getPoints() * grade.getWeight();
        }

        if (weightCount == 0) return "unknown";

        return Math.round((gradeCount / weightCount) * 100) / 100 as Points;
    }


    private sortGrades() {
        this.sortedGrades = {};
        for (const grade of this.grades) {
            const subject = grade.getSubject();
            if (!this.sortedGrades[subject]) this.sortedGrades[subject] = [];
            this.sortedGrades[subject].push(grade);
        }
    }

    private updateTable() {

        let removedSince: string[] = [];
        let timeoutId = -1;

        const calculatedPoints = this.calculateFinalGrade();
        if (calculatedPoints != "unknown") this.finalGrade.setPoints(calculatedPoints);

        const gi = this.calculateInfluenceOfGrades();
        if (gi != "unknown") this.gradeInfluence = gi;

        this.currentGrade.setAttribute("data-grade-css", this.getCssGradeFromPoints(this.finalGrade.getPoints()));
        this.currentGrade.setAttribute("data-points", this.finalGrade.getPoints() + "");
        this.currentGrade.setAttribute("data-grade", this.finalGrade.getGrade());
        if (calculatedPoints == "unknown") this.currentGrade.setAttribute("data-couldNotCalc", "");

        const aww = this.calculateAverageGradeWithoutWeights();
        if (aww != "unknown") this.averageWW.setAttribute("data-grade-css", this.getCssGradeFromPoints(aww));
        if (aww != "unknown") this.averageWW.setAttribute("data-value", aww + "");
        this.averageWW.setAttribute("data-onlyValue", "");
        if (aww == "unknown") this.averageWW.setAttribute("data-couldNotCalc", "");

        const pg = this.calculatePercentageOfGoodGrades();
        if (pg != "unknown") this.percentGood.setAttribute("data-value", pg + "%");
        this.percentGood.setAttribute("data-onlyValue", "");
        if (pg != "unknown") this.percentGood.setAttribute("data-grade-css", this.getCssGradeFromPoints(Math.round((pg / 100) * 15) as Points));
        if (pg == "unknown") this.percentGood.setAttribute("data-couldNotCalc", "");

        const totalPoints = this.calculateTotalPoints();
        this.totalPoints.setAttribute("data-value", totalPoints + "");
        this.totalPoints.setAttribute("data-onlyValue", "");
        this.totalPoints.setAttribute("data-grade-css", this.getCssGradeFromPoints(Math.round(totalPoints / this.grades.length) as Points));

        const gradeDev = this.calcWeightedStdDev();
        this.gradeDeviation.setAttribute("data-value", Math.round(gradeDev * 100) / 100 + "");
        this.gradeDeviation.setAttribute("data-onlyValue", "");
        this.gradeDeviation.setAttribute("data-grade-css", this.getCssGradeFromPoints(Math.round(15 - gradeDev) as Points));

        this.gradeTableBody.innerHTML = "";
        for (const subject of Object.keys(this.sortedGrades)) {

            const mainStatsRow = this.gradeTableBody.insertRow();
            const dropDownDivLeft = mainStatsRow.insertCell();
            const subjectCell = mainStatsRow.insertCell();
            const gradeCountCell = mainStatsRow.insertCell();
            const currentGradeCell = mainStatsRow.insertCell();
            const currentPointsCell = mainStatsRow.insertCell();
            const dropDownDivRight = mainStatsRow.insertCell();

            dropDownDivLeft.classList.add("dropDownDivLeft");
            dropDownDivRight.classList.add("dropDownDivRight");

            subjectCell.innerHTML = subject;
            gradeCountCell.innerHTML = this.sortedGrades[subject].length + "";
            const currentPoints = this.calculateGradeOfSubject(this.sortedGrades[subject]) as Points;
            currentGradeCell.innerHTML = Grade.convertPointsToGrade(Math.round(currentPoints) as Points);
            currentPointsCell.innerHTML = currentPoints + "";

            mainStatsRow.addEventListener("click", () => {
                mainStatsRow.classList.toggle("open");
            });
            const detailsRow = this.gradeTableBody.insertRow();
            detailsRow.classList.add("detailsForSubject");
            const detailsCell = detailsRow.insertCell();

            const detailTable = document.createElement("table");
            const detailTableHead = document.createElement("thead");
            const detailTableBody = document.createElement("tbody");

            const headerRow = detailTableHead.insertRow();
            for (const header of ["Grade", "Points", "Weight", "Influence", "Final Grade when +1pt", "Sensitivity", ""]) {
                const hr = headerRow.insertCell();
                hr.innerHTML = header;
            }

            detailTable.appendChild(detailTableHead);
            detailTable.appendChild(detailTableBody);

            for (const grade of this.sortedGrades[subject]) {
                const row = detailTableBody.insertRow();

                const gradeCell = row.insertCell();
                const pointsCell = row.insertCell();
                const weightCell = row.insertCell();
                const influenceWeightedCell = row.insertCell();
                const influenceWhenPlusOneCell = row.insertCell();
                const sensitivityCell = row.insertCell();
                const trash = row.insertCell();
                trash.classList.add("trash");

                gradeCell.innerHTML = grade.getGrade();
                pointsCell.innerHTML = grade.getPoints() + "";
                weightCell.innerHTML = grade.getWeight() + "%";
                influenceWeightedCell.innerHTML = this.gradeInfluence[grade.uuid].influence.percentage + "%";
                influenceWhenPlusOneCell.innerHTML = "+" + this.gradeInfluence[grade.uuid].influence.whenPlusOne + "pt";
                sensitivityCell.innerHTML = this.gradeInfluence[grade.uuid].influence.sensitivity;
                sensitivityCell.classList.add(this.gradeInfluence[grade.uuid].influence.sensitivity.replaceAll(" ", "-"));


                const trashDiv = document.createElement("div");
                trashDiv.innerHTML = Images.TRASH;
                trashDiv.classList.add("trash");
                trashDiv.onclick = () => {
                    UserManagement.ALL_DATA!.grades = UserManagement.ALL_DATA!.grades.filter(e => e.uuid != grade.uuid);
                    this.grades = this.grades.filter(e => e.uuid != grade.uuid);
                    this.sortGrades();

                    if (!this.sortedGrades[subject]) {
                        mainStatsRow.remove();
                    }

                    removedSince.push(grade.uuid);
                    detailTableBody.removeChild(row);
                    Utils.success(removedSince.length == 1 ? "Deleted Grade Successfully" : "Deleted " + removedSince.length + " Grades Successfully", "teacherDeleteToast");

                    if (timeoutId != -1) {
                        clearTimeout(timeoutId);
                    }

                    timeoutId = setTimeout(() => {
                        UserManagement.updateGrades("remove", removedSince);
                        removedSince = [];
                    }, 500);

                };
                trash.appendChild(trashDiv);

            }

            detailsCell.colSpan = mainStatsRow.childNodes.length;
            detailsCell.appendChild(detailTable);
        }


    }

    private getCssGradeFromPoints(points: Points): string {
        switch (Math.round(points)) {
            case 0:
                return "failing";
            case 1:
            case 2:
            case 3:
                return "poor";
            case 4:
            case 5:
            case 6:
                return "passing";
            case 7:
            case 8:
            case 9:
                return "satisfactory";
            case 10:
            case 11:
            case 12:
                return "good";
            case 13:
            case 14:
            case 15:
                return "veryGood";
        }
        return "";
    }

    private addGrade(callback: (newGrade: Grade) => void) {

        const addGradeDialogWrapper = document.createElement("div");
        addGradeDialogWrapper.classList.add("addGradeDialogWrapper");
        addGradeDialogWrapper.classList.add("dialogWrapper");

        const addGradeDialog = document.createElement("div");
        addGradeDialog.classList.add("addGradeDialog");
        addGradeDialog.classList.add("dialog");

        const title = document.createElement("h1");
        title.innerHTML = "Add Grade";
        title.classList.add("title");

        const subjectInput = document.createElement("select");
        subjectInput.classList.add("subject");
        const subjects = new Set(Object.values(UserManagement.ALL_DATA!.schedule).map(e => Object.values(e)).flat().filter(e => !!e).map(lesson => lesson.sign));
        subjects.forEach(subject => {
            const option = document.createElement("option");
            option.classList.add("subjectOption");
            option.value = subject;
            option.innerHTML = subject;
            subjectInput.appendChild(option);
        });

        const [weightInputWrapper, weightInput] = Utils.createInputWithLabel("weightInput", "Weight", /\d+/g, true);
        weightInputWrapper.classList.add("weightInputWrapper");
        weightInput.classList.add("weightInput");

        const gradeInputWrapper = document.createElement("div");
        gradeInputWrapper.classList.add("gradeInputWrapper");

        const [gradeValueInputWrapper, gradeInput] = Utils.createInputWithLabel("gradeInput", "Grade", /^((1|2|3|4|5)(\+|-)?|6)$/g, true);
        gradeValueInputWrapper.classList.add("gradeValueInputWrapper");
        gradeInput.classList.add("gradeInput");

        const [pointsInputWrapper, pointsInput] = Utils.createInputWithLabel("pointsInput", "Points", /^(([1-9][0-5])|([0-9]))$/g, true);
        pointsInputWrapper.classList.add("pointsInputWrapper");
        pointsInput.classList.add("pointsInput");

        gradeInputWrapper.appendChild(gradeValueInputWrapper);
        gradeInputWrapper.appendChild(pointsInputWrapper);

        gradeInput.addEventListener("input", () => {
            const value = gradeInput.value;
            if (!value || value.length <= 0) return;
            if (!Grade.isValidGrade(value as GradeValue)) return;

            const grade = value as GradeValue;
            const points = Grade.convertGradeToPoints(grade);
            pointsInput.value = points + "";
        });


        pointsInput.addEventListener("input", () => {
            const value = pointsInput.value;
            if (!value || value.length <= 0) return;
            try {

                const parsedPoints = parseInt(value);
                if (!Grade.isValidPoints(parsedPoints as Points)) return;

                const points = parsedPoints as Points;
                const grade = Grade.convertPointsToGrade(points);
                gradeInput.value = grade + "";
            } catch (ex) {

            }
        });

        const cancelBtn = document.createElement("button");
        cancelBtn.classList.add("cancelBtn");
        cancelBtn.innerHTML = "Cancel";
        cancelBtn.addEventListener("click", () => {
            document.body.removeChild(addGradeDialogWrapper);
        });

        const addBtn = document.createElement("button");
        addBtn.classList.add("addBtn");
        addBtn.innerHTML = "Add";
        addBtn.addEventListener("click", () => {
            try {

                const weightParsed = parseInt(weightInput.value);

                const inputGrade = gradeInput.value as GradeValue;
                let inputPoints = -1 as Points;

                try {
                    inputPoints = parseInt(pointsInput.value) as Points
                } catch (e) {

                }

                let inputValue = null;

                if (Grade.isValidGrade(inputGrade)) {
                    inputValue = inputGrade;
                } else if ((inputPoints as number) != -1 && Grade.isValidPoints(inputPoints)) {
                    inputValue = inputPoints;
                } else {
                    Utils.error("You have to set a valid Grade");
                    return;
                }

                const newGrade = new Grade(Utils.uuidv4Exclude(UserManagement.ALL_DATA!.grades.map(e => e.uuid)), subjectInput.value, weightParsed, inputValue);
                document.body.removeChild(addGradeDialogWrapper);
                callback(newGrade);
            } catch (ex) {
                Utils.error("The Weight is not a valid number!");
            }
        });

        addGradeDialog.appendChild(title);
        addGradeDialog.appendChild(subjectInput);
        addGradeDialog.appendChild(weightInputWrapper);
        addGradeDialog.appendChild(gradeInputWrapper);
        addGradeDialog.appendChild(cancelBtn);
        addGradeDialog.appendChild(addBtn);

        addGradeDialogWrapper.appendChild(addGradeDialog);

        document.body.appendChild(addGradeDialogWrapper);

    }

    private openGradeConverter() {

        const converterDialogWrapper = document.createElement("div");
        converterDialogWrapper.classList.add("converterWrapper");
        converterDialogWrapper.classList.add("dialogWrapper");

        const converterDialog = document.createElement("div");
        converterDialog.classList.add("converterDialog");
        converterDialog.classList.add("dialog");

        const title = document.createElement("h1");
        title.innerHTML = "Convert Grades";
        title.classList.add("title");


        const gradeInputWrapper = document.createElement("div");
        gradeInputWrapper.classList.add("gradeInputWrapper");

        const [gradeValueInputWrapper, gradeInput] = Utils.createInputWithLabel("gradeInput", "Grade", /^((1|2|3|4|5)(\+|-)?|6)$/g, true);
        gradeValueInputWrapper.classList.add("gradeValueInputWrapper");
        gradeInput.classList.add("gradeInput");

        const [pointsInputWrapper, pointsInput] = Utils.createInputWithLabel("pointsInput", "Points", /^(([1-9][0-5])|([0-9]))$/g, true);
        pointsInputWrapper.classList.add("pointsInputWrapper");
        pointsInput.classList.add("pointsInput");

        gradeInputWrapper.appendChild(gradeValueInputWrapper);
        gradeInputWrapper.appendChild(pointsInputWrapper);

        gradeInput.addEventListener("input", () => {
            const value = gradeInput.value;
            if (!value || value.length <= 0) return;
            if (!Grade.isValidGrade(value as GradeValue)) return;

            const grade = value as GradeValue;
            const points = Grade.convertGradeToPoints(grade);
            pointsInput.value = points + "";
        });

        pointsInput.addEventListener("input", () => {
            const value = pointsInput.value;
            if (!value || value.length <= 0) return;
            try {

                const parsedPoints = parseInt(value);
                if (!Grade.isValidPoints(parsedPoints as Points)) return;

                const points = parsedPoints as Points;
                const grade = Grade.convertPointsToGrade(points);
                gradeInput.value = grade + "";
            } catch (ex) {
            }
        });

        const closeBtn = document.createElement("button");
        closeBtn.classList.add("closeBtn");
        closeBtn.innerHTML = "Close";
        closeBtn.addEventListener("click", () => {
            document.body.removeChild(converterDialogWrapper);
        });


        converterDialog.appendChild(title);
        converterDialog.appendChild(gradeInputWrapper);
        converterDialog.appendChild(closeBtn);

        converterDialogWrapper.appendChild(converterDialog);
        document.body.appendChild(converterDialogWrapper);
    }

    getGrades(): Grade[] {
        return this.grades;
    }

    setGrades(grades: Grade[]): void {
        this.grades = grades;
    }

}

type SortedGrade = {
    [key: Subject]: Grade[];
};