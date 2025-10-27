import type { School } from "./School";


export type UntisAccess = {
    school: School;
    schoolId: string;
    username: string;
    password: string;
    host: string;
    classNames: string[];
    uuid: string;
}