import { IApiPersonnel } from "./iapipersonnel";
import { IPermanence } from "./ipermanence";

export interface IPersonnelJour {
    id?:number;
    personnel:IApiPersonnel;
    permanence?:IPermanence;
    responsable:boolean;
    isSubstitute?:boolean;
}