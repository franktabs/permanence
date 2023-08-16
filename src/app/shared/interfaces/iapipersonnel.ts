import { IApiRemplacement } from './iapiremplacement';
import { IApiDepartement } from './iapidepartement';
import { IApiHoliday } from './iapiholiday';
import { IPersonnelJour } from './ipersonneljour';
import { IPersonnelNuit } from './ipersonnelNuit';

export interface IApiPersonnel {
  id: number | null;
  userId: number;
  firstname: string;
  emailaddress: string | null;
  telephoneCisco: string | null;
  telephoneMobile: string | null;
  organizationId: number;
  sexe: 'M' | 'F';
  fonction: string;
  agent: boolean | null;
  service: string;
  libAge: string;
  isAbsent: boolean | null;
  isVacancy: boolean | null;
  isEligible: boolean | null;
  absentList?: IApiRemplacement[] | null;
  vacancies?: IApiHoliday[] | null;
  departement?: IApiDepartement ;
  screenname?:string|null;
  personnels_jour?:IPersonnelJour[];
  personnels_nuit?:IPersonnelNuit[]
}
