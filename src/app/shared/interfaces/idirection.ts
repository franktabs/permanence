import { IModel } from "./imodel";

export  interface IDirection extends IModel {
    id:number;
    nom:string;
    region?:string|null;
    lieu?:string;
}