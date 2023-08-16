import { IApiPersonnel } from "./iapipersonnel";


export interface IApiRemplacement{
    id?:number,
    message:string|null,
    motif:string|null,
    validate:boolean|null,
    submissionDate: string,
    userId?:number|null,
    personnel:IApiPersonnel|null,
    start:string,
    end?:string,
    remplaceur:IApiPersonnel|null,
}