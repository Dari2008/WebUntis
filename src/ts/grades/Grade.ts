import type { GradeValue, GradeWeight, Points, Subject } from "../@types/Grades";

export default class Grade {

    private points: Points = 0;
    private grade: GradeValue = "6";
    private subject: Subject;
    private weight: GradeWeight = 50;

    constructor(public uuid: string, subject: Subject, weight: GradeWeight, inputValue: GradeValue | Points) {
        this.subject = subject;
        this.weight = weight;
        if (typeof inputValue == "string") {
            this.points = Grade.convertGradeToPoints(inputValue);
            this.grade = inputValue;
        } else {
            this.points = inputValue;
            this.grade = Grade.convertPointsToGrade(inputValue);
        }
    }

    public getWeight(): GradeWeight {
        return this.weight;
    }

    public setWeight(weight: GradeWeight) {
        this.weight = weight;
    }

    public getSubject(): Subject {
        return this.subject;
    }

    public setSubject(subject: Subject) {
        this.subject = subject;
    }

    public getGrade(): GradeValue {
        return this.grade;
    }

    public getPoints(): Points {
        return this.points;
    }

    public setGrade(grade: GradeValue) {
        this.grade = grade;
        this.points = Grade.convertGradeToPoints(grade);
    }

    public setPoints(points: Points) {
        this.grade = Grade.convertPointsToGrade(Math.round(points) as Points);
        this.points = points;
    }

    public static isValidGrade(grade: GradeValue): boolean {
        return !!grade.match(/^((1|2|3|4|5)(\+|-)?|6)$/g);
    }


    public static isValidPoints(points: Points | string): boolean {
        return !!(points + "").match(/^(([1-9][0-5])|([0-9]))$/g);
    }


    public static convertGradeToPoints(grade: GradeValue): Points {
        switch (grade) {
            case "1+": return 15;
            case "1": return 14;
            case "1-": return 13;
            case "2+": return 12;
            case "2": return 11;
            case "2-": return 10;
            case "3+": return 9;
            case "3": return 8;
            case "3-": return 7;
            case "4+": return 6;
            case "4": return 5;
            case "4-": return 4;
            case "5+": return 3;
            case "5": return 2;
            case "5-": return 1;
            case "6": return 0;
        }
        return 0;
    }

    public static convertPointsToGrade(points: Points): GradeValue {
        switch (points) {
            case 0:
                return "6";
            case 1:
                return "5-";
            case 2:
                return "5";
            case 3:
                return "5+";
            case 4:
                return "4-";
            case 5:
                return "4";
            case 6:
                return "4+";
            case 7:
                return "3-";
            case 8:
                return "3";
            case 9:
                return "3+";
            case 10:
                return "2-";
            case 11:
                return "2";
            case 12:
                return "2+";
            case 13:
                return "1-";
            case 14:
                return "1";
            case 15:
                return "1+";
        }
        return "1+";
    }

}
