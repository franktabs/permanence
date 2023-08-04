import { IApiPersonnel } from "./iapipersonnel";


export interface IApiAbsence{
    id?:number,
    message:string|null,
    motif:string|null,
    validate:boolean|null,
    submissionDate: string,
    personnel?:IApiPersonnel,
    start:string,
    end:string
}