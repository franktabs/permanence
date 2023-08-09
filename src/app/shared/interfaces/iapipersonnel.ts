import { IApiRemplacement } from './iapiremplacement';
import { IApiDepartement } from './iapidepartement';
import { IApiHoliday } from './iapiholiday';

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
  permanence: string | null;
  isAbsent: boolean | null;
  isVacancy: boolean | null;
  isEligible: boolean | null;
  absentList?: IApiRemplacement[] | null;
  vacancies?: IApiHoliday[] | null;
  departement?: IApiDepartement | null;
  screenname?:string|null;
}
