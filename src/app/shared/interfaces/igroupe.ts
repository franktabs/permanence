import { IApiPersonnel } from "./iapipersonnel";
import ICritere from "./icritere";
import { IModel } from "./imodel";


export default interface IGroupe extends IModel {
    nom?:string;
    personnels:Set<IApiPersonnel>;
    criteres:ICritere[]
}