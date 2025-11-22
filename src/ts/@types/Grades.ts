import type Grade from "../grades/Grade";

export type GradeWeight = number;

export type Subject = string;

export type Points = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15;

export type GradeValue =
    "1+" |
    "1" |
    "1-" |
    "2+" |
    "2" |
    "2-" |
    "3+" |
    "3" |
    "3-" |
    "4+" |
    "4" |
    "4-" |
    "5+" |
    "5" |
    "5-" |
    "6";

export type GradeInfluences = {
    [key: string]: GradeInfluence;
}

export type GradeInfluence = {
    grade: Grade;
    influence: {
        percentage: number;
        whenPlusOne: number;
        sensitivity: string;
    }
}