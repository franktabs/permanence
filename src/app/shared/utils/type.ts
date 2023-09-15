import { IModel } from "../interfaces/imodel";

export type OptionalKey<T> = { [key in keyof T]?: T[key] };

export type KeyString<T, K extends keyof T> = T[K] extends Array<any>
  ? never
  : K;

export type OptionalKeyString<T> = {
  [key in (T extends IModel? keyof T:never ) as T[key] extends Array<any> ? never : key]?: T[key];
};


export type FusionKey<T> = {
  [key in  (T extends IModel ? keyof T:never)  ]: T[key]
}