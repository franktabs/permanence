import { OptionalKey } from '../utils/type';
import { IAnnonce } from './iannonce';
import { IApiPersonnel } from './iapipersonnel';

export interface INotification {
  id?: number;
  annonce: OptionalKey<IAnnonce>;
  recepteur: IApiPersonnel|{id:number};
  isViewed: boolean | null;
  isDeleted: boolean;
}
