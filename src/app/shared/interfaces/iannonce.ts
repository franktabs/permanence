import { OptionalKey } from "../utils/type";
import { IApiPersonnel } from "./iapipersonnel";
import { INotification } from "./inotification";

export interface IAnnonce{

    id?:number;
    type:'VALIDATION PLANNING'|"DEMANDE ABSENCE"|"NOUVEAU PLANNING",
    message:string;
    submissionDate?:string|null;
    emetteur:OptionalKey<IApiPersonnel>;
    notifications?:INotification[]
}

export type AnnonceType = IAnnonce["type"];