

export type TeacherDatabase = Teacher[];

export type Teacher = {
    short: string;
    duplicates?: boolean;
    isUnknownTeacher?: boolean;
    name: {
        firstName: string;
        surname?: string;
        fullName?: string;
    };
    subjects: Subject[];
    uuid: string;

}

export type Subject =
    "Mus" | "Deu" | "Spa" | "Spo" | "Ges" | "PGW" | "Ma" |
    "Bio" | "NuT" | "Phy" | "Mat" | "Kun" | "Eng" | "Wir" |
    "Frz" | "Geo" | "Phi" | "The" | "Inf" | "Rel" | "Che" |
    "Lat" | "Mu" | "Fra" | "Psy" | "NaWi" | "Italienisch" | "Journalismus" | "Film";
