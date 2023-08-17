import { IApiPersonnel } from "./iapipersonnel";

export interface IRole{
    id?:number;
    name:"ATTRIBUER LES ROLES"|"MODIFIER PLANNING"|"SE CONNECTER"|"VALIDER PLANNING"|"VOIR PAGE ADMINISTRATEUR";
    personnels?:IApiPersonnel[]|null;
}