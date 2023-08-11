import { IPermanence } from "./ipermanence";

export interface IPlanning{
    id?:number;
    start:string;
    end:string;
    periode:number;
    isValid:boolean|null;
    submissionDate:string;
    permanences:IPermanence[]
}