import { IApiDepartement } from "./iapidepartement";
import { IModel } from "./imodel";
import { IParameter } from "./iparameter";

export interface IApiDirection extends IModel{
    id:number|null;
    level:number|null;
    type_:string|null;
    treepath:string|null;
    parentorganizationId:number|null;
    organizationId:number|null;
    name:string|null;
    departements?:IApiDepartement[]|null;
    parameters?:IParameter[]|null
}


