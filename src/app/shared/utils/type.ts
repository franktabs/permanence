export type OptionalKey<T> = { [key in keyof T]?: T[key] };

export type KeyString<T, K extends keyof T> = T[K] extends Array<any>
  ? never
  : K;

export type OptionalKeyString<T> = {
  [key in keyof T as T[key] extends Array<any> ? never : key]?: T[key];
};


