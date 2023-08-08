import { IApiDirection } from './iapidirection';
import { IApiPersonnel } from './iapipersonnel';

export interface IApiDepartement {
  id: number | null;
  level: number | null;
  type_: string | null;
  treepath: string | null;
  parentorganizationId: number | null;
  organizationId: number | null;
  name: string | null;
  direction?: IApiDirection | null;
  personnels?: IApiPersonnel[] | null;
  userId:number|null;
}
