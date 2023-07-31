import { IHolidays } from "./iholidays";
import { IPersonnel } from "./ipersonnel";

export interface IAbsence extends IHolidays{
    date:string;
    motif:string;
    isValid:boolean;
    commentaire?:string;
    autres?:string;
}