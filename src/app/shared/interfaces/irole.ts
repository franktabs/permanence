import { IApiPersonnel } from './iapipersonnel';

export interface IRole {
  id?: number;
  name:
    | 'ATTRIBUER LES ROLES'
    | 'MODIFIER PLANNING'
    | 'SE CONNECTER'
    | 'VALIDER PLANNING'
    | 'VOIR PAGE ADMINISTRATEUR'
    | 'VALIDER REMPLACEMENT'
    | 'AJOUTER UNE ABSENCE';
  personnels?: IApiPersonnel[] | null;
}

export type RoleType = IRole['name'];
