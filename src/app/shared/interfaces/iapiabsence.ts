

export interface IApiAbsence{
    id?:number,
    message:string|null,
    motif:string|null,
    validate:boolean|null,
    submissionDate: string,
    personnel:any,
    start:string,
    end:string
}