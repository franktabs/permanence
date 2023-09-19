import { IModel } from "./imodel";



export default interface ICritere extends IModel{
    nom:"RESPONSABLE TFG" | "APPARAIT WEEKEND" | "SUPERVISEUR" | "APPARAIT LUNDI - VENDREDI " | "REPARTI NORMALEMENT" | "APPARAIT SAMEDI" | "APPARAIT DIMANCHE"
}