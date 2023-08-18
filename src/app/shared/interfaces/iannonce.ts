import { IApiPersonnel } from "./iapipersonnel";
import { INotification } from "./inotification";

export interface IAnnonce{
    id?:number;
    notification:INotification;
    recepteur:IApiPersonnel;
    isViewed:boolean|null;
    isDeleted:boolean|null;
}