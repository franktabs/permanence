import { IApiDirection } from "./iapidirection";

export interface IParameter {
  id?: number;
  code: string;
  libelle: string;
  valeur: string | null;
  direction: IApiDirection;
}

