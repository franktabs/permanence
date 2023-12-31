import { ReturnFormatJSON, formatJSON } from "src/app/shared/utils/function";
import { IApiPersonnel } from "../interfaces/iapipersonnel";
import { IPersonnel } from "../interfaces/ipersonnel";
import { IApiDirection } from "../interfaces/iapidirection";
import { IDirection } from "../interfaces/idirection";
import { IApiRemplacement } from "../interfaces/iapiremplacement";
import { IAbsence } from "../interfaces/iabsence";
import { IApiHoliday } from "../interfaces/iapiholiday";
import { IHolidays } from "../interfaces/iholidays";
import { IApiDepartement } from "../interfaces/iapidepartement";

export type TypePersonnel = IApiPersonnel;
// export type TypePersonnel = ReturnFormatJSON<IApiPersonnel, IPersonnel>
// export type TypeDirection = ReturnFormatJSON<IApiDirection, IDirection>
export type TypeDirection = IApiDirection;
export type TypeAbsence = ReturnFormatJSON<IApiRemplacement, IAbsence>
export type TypeHoliday = ReturnFormatJSON<IApiHoliday, IHolidays>
export type TypeDepartement = IApiDepartement

export type KeyOfAllType = keyof TypeAbsence | keyof TypeHoliday | keyof TypeDepartement | keyof TypeDirection | keyof TypePersonnel