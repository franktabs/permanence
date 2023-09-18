import { IApiPersonnel } from "./iapipersonnel";
import ICritere from "./icritere";


export default interface IGroupe {
    nom?:string;
    personnels:IApiPersonnel[]
    criteres:ICritere[]
}