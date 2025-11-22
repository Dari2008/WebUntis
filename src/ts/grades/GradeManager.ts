import { GradeHTMLManager } from "./GradeHTMLManager";

export class GradeManager {

    public static gradeHTMLManager: GradeHTMLManager;

    public static init() {
        GradeManager.gradeHTMLManager = new GradeHTMLManager();
    }

}