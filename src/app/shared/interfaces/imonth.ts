import { IApiPersonnel } from "./iapipersonnel";
import { IPermanence } from "./ipermanence";
import { IPlanning } from "./iplanning";

export interface IMonth {
    id?:number;
    name?:string;
    numero:number;
    start:string;
    end?:string;
    superviseur?:IApiPersonnel|null;
    planning?:IPlanning;
    permanences?:IPermanence[];
}