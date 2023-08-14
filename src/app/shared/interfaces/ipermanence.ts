import { IApiPersonnel } from './iapipersonnel';
import { IMonth } from './imonth';
import { IPersonnelNuit } from './ipersonnelNuit';
import { IPersonnelJour } from './ipersonneljour';
import { IPlanning } from './iplanning';

export interface IPermanence {
  id?: number;
  date: string;
  type:
    | 'ouvrable'
    | 'non_ouvrable'
    | 'simple'
    | 'saturday_jour'
    | 'saturday_night'
    | 'sunday_jour'
    | 'sunday_night';
  personnels_jour?: IPersonnelJour[] ;
  personnels_nuit?: IPersonnelNuit[] ; 
  month:IMonth|null; 
}
