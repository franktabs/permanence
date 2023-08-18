import { IApiPersonnel } from "./iapipersonnel";

export interface INotification{
    id?:number;
    type:'VALIDATION PLANNING'|"DEMANDE ABSENCE"|"NOUVEAU PLANNING",
    message:string;
    submissionDate:string;
    emetteur:IApiPersonnel;
}

export type NotificationType = INotification["type"];