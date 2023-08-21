import { IApiPersonnel } from "./iapipersonnel";

export interface IApiHoliday{
    id?:number,
    submissionDate: string,
    personnel?:IApiPersonnel,
    start:string,
    end:string,
    message?:string,
    // userId:number|null,
    type:"PERMISSION"|"MISSION"|"CONGE",

}