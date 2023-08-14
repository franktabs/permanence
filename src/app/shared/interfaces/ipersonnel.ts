import { IAbsence } from "./iabsence";
import { IDirection } from "./idirection";
import { IHolidays } from "./iholidays";

export interface IPersonnel {
    id?: number;
    matricule: string;
    nom: string;
    prenom?: string;
    sexe: "M" | "F";
    isholiday?: boolean,
    willPassed?: boolean;
    admin?: boolean;
    superviseur?: boolean;
    holiday_id?: number | null;
    holidays?: IHolidays[];
    absences?: IAbsence[];
    email:string|null;
    contact1:string|null;
    contact2:string|null;
    
}


