import { IApiPersonnel } from '../interfaces/iapipersonnel';
import { IPersonnel } from '../interfaces/ipersonnel';
import { IApiDirection } from '../interfaces/iapidirection';
import { IDirection } from '../interfaces/idirection';
import { IApiAbsence } from '../interfaces/iapiabsence';
import { IAbsence } from '../interfaces/iabsence';
import { IApiHoliday } from '../interfaces/iapiholiday';
import { IHolidays } from '../interfaces/iholidays';
import { IApiDepartement } from '../interfaces/iapidepartement';
import { TypeFormatJSON } from './function';

// export const mapDirection:TypeFormatJSON<IApiDirection, IDirection>["correspondance"]
export const mapDirection: TypeFormatJSON<
  IApiDirection,
  IDirection
>['correspondance'] = {};

export const mapPersonnel: TypeFormatJSON<
  IApiPersonnel,
  IPersonnel
>['correspondance'] = {firstname:"nom", emailaddress:"email", telephoneCisco:"contact1", telephoneMobile:"contact2", absentList:"absences", vacancies:"holidays"}


export const mapAbsence: TypeFormatJSON<
  IApiAbsence,
  IAbsence
>['correspondance'] = {
  validate: 'isValid',
  submissionDate: 'date',
  start: 'debut',
  end: 'fin',
};


export const mapHoliday: TypeFormatJSON<
  IApiHoliday,
  IHolidays
>['correspondance'] = {start:"debut", end:"fin"}


export const mapDepartement = {};
