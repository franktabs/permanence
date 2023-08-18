import { IApiRemplacement } from './iapiremplacement';
import { IApiDepartement } from './iapidepartement';
import { IApiHoliday } from './iapiholiday';
import { IPersonnelJour } from './ipersonneljour';
import { IPersonnelNuit } from './ipersonnelNuit';
import { IRole } from './irole';
import { INotification } from './inotification';
import { IAnnonce } from './iannonce';

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
  screenname?:string|null;
  departement?: IApiDepartement ;
  vacancies?: IApiHoliday[] | null;
  absentList?: IApiRemplacement[] | null;
  personnels_jour?:IPersonnelJour[];
  personnels_nuit?:IPersonnelNuit[];
  roles?:IRole[]|null
  notifications?:INotification[];
  annonces?:IAnnonce[];
}
