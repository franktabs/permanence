import { IApiDirection } from "./iapidirection";

export interface IParameter {
  id?: number;
  code: "api1_DSI"|"api2_DSI"|"urlBackend";
  libelle: string;
  valeur: string | null;
  direction?: IApiDirection;
}


