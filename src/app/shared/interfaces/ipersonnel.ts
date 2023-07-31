import { IAbsence } from "./iabsence";
import { IDirection } from "./idirection";
import { IHolidays } from "./iholidays";

export interface IPersonnel {
    id?: number;
    matricule: string;
    nom: string;
    prenom?: string;
    date_naissance: Date,
    sexe: "M" | "F";
    isholiday?: boolean,
    willPassed?: boolean;
    admin?: boolean;
    superviseur?: boolean;
    direction_id: number;
    direction: IDirection | null;
    holiday_id?: number | null;
    holiday?: IHolidays;
    absences?: IAbsence[];
}


