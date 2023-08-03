
export interface IApiPersonnel{
    idPersonne:number|null,
    userId:number,
    firstname:string,
    emailaddress:string|null,
    telephoneCisco:string|null,
    telephoneMobile:string|null,
    organizationId:number,
    sexe:"M"|"F",
    fonction:string,
    agent:boolean|null,
    service:string,
    libAge:string,
    permanence:string|null,
    departement:unknown,
    absent:boolean|null,
    vacancy:boolean|null,
    eligible:boolean|null,
    absentList:any[]|null,
    vacancies:any[]|null
}