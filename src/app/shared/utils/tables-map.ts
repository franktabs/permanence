import { IApiPersonnel } from '../interfaces/iapipersonnel';
import { IPersonnel } from '../interfaces/ipersonnel';
import { IApiDirection } from '../interfaces/iapidirection';
import { IDirection } from '../interfaces/idirection';
import { IApiRemplacement } from '../interfaces/iapiremplacement';
import { IAbsence } from '../interfaces/iabsence';
import { IApiHoliday } from '../interfaces/iapiholiday';
import { IHolidays } from '../interfaces/iholidays';
import { IApiDepartement } from '../interfaces/iapidepartement';
import { TypeFormatJSON } from './function';
import { TypePersonnel } from './types-map';

// export const mapDirection:TypeFormatJSON<IApiDirection, IDirection>["correspondance"]
export const mapDirection: TypeFormatJSON<
  IApiDirection,
  IDirection
>['correspondance'] = {};

// export const mapPersonnel: TypeFormatJSON<
//   IApiPersonnel,
//   IPersonnel
// >['correspondance'] = {firstname:"nom", emailaddress:"email", telephoneCisco:"contact1", telephoneMobile:"contact2", absentList:"absences", vacancies:"holidays"}

export const mapPersonnel: TypeFormatJSON<
  IApiPersonnel,
  IApiPersonnel
>['correspondance'] = {firstname:"firstname", emailaddress:"emailaddress", telephoneCisco:"telephoneCisco", telephoneMobile:"telephoneMobile", absentList:"absentList", vacancies:"vacancies"}

export const mapReversePersonnel:TypeFormatJSON<
  TypePersonnel,
  IApiPersonnel
>["correspondance"] = {firstname:"firstname", emailaddress:"emailaddress", telephoneCisco:"telephoneCisco",telephoneMobile:"telephoneMobile", absentList:"absentList", vacancies:"vacancies" }

export const mapAbsence: TypeFormatJSON<
  IApiRemplacement,
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
