import { IApiPersonnel } from "./iapipersonnel";


export interface IApiRemplacement{
    id?:number,
    message:string|null,
    motif:string|null,
    validate:boolean|null,
    submissionDate: string,
    userId:number|null,
    personnel?:IApiPersonnel,
    start:string,
    end:string,
    nom:string|null,
}