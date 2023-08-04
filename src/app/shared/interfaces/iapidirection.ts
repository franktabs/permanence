import { IApiDepartement } from "./iapidepartement";

export interface IApiDirection{
    id:number|null;
    level:number|null;
    type_:string|null;
    treepath:string|null;
    parentorganizationId:number|null;
    organizationId:number|null;
    name:string|null;
    departements?:IApiDepartement[]|null;
}


