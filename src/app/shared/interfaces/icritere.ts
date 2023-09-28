import { IModel } from './imodel';

export default interface ICritere extends IModel {
  nom:
    | 'RESPONSABLE TFG'
    | 'APPARAIT WEEKEND'
    | 'SUPERVISEUR'
    | 'APPARAIT LUNDI - VENDREDI '
    | 'REPARTI NORMALEMENT'
    | 'APPARAIT SAMEDI'
    | 'APPARAIT DIMANCHE'
    | 'PEUT APPARAITRE ENSEMBLE'
    | 'PRESENT JUSTE LA NUIT'
    | 'PRESENT JUSTE LE JOUR'
    // | 'JAMAIS RESPONSABLE'
    | 'SAMEDI JOUR'
    | 'SAMEDI NUIT'
    | 'DIMANCHE JOUR'
    | 'DIMANCHE NUIT'
    | 'RESPONSABILITE 1'
    | 'RESPONSABILITE 2'
}
