import { IApiDirection } from './iapidirection';
import { IApiPersonnel } from './iapipersonnel';
import { IModel } from './imodel';

export interface IApiDepartement extends IModel{
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
