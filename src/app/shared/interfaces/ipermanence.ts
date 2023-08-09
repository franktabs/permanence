import { IApiPersonnel } from './iapipersonnel';
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
  personnels?: IApiPersonnel[] | null;
  superviseur?: IApiPersonnel | null;
  planning: IPlanning;
}
