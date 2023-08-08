export type TypeFormatJSON<T, J> = {
  obj: { [key in keyof T]?: any };
  correspondance: { [key in keyof T]?: keyof J };
};

export type ReturnFormatJSON<T, J> = {
  [key in keyof J | keyof T]: key extends keyof T ? T[key] : unknown;
};

export function formatJSON<T, J>({
  obj,
  correspondance,
}: TypeFormatJSON<T, J>): ReturnFormatJSON<T, J> {
  let objEmpty: ReturnFormatJSON<T, J> = {} as any;

  Object.keys(obj as any).forEach((key) => {
    let key1: keyof T = key as any;
    let newKey = correspondance[key1];
    if (newKey != undefined) {
      objEmpty[newKey as keyof J] = obj[key1];
    } else {
      objEmpty[key1] = obj[key1];
    }
  });

  return objEmpty;
}

type TriJSON<T> = {
  obj: any;
  key: Array<keyof T>;
};

export function mapJSON<T, J>(
  tab: T[],
  correspondance: TypeFormatJSON<T, J>['correspondance']
) {
  let tableTransform: ReturnFormatJSON<T, J>[] = [];
  for (let ob of tab) {
    let objTransform = formatJSON<T, J>({
      obj: ob,
      correspondance: correspondance,
    });
    tableTransform.push(objTransform);
  }
  return tableTransform;
}

//retourne un objet qui contient les attribut de key qui sont des attributs de obj
export function triJSON<T>({ obj, key }: TriJSON<T>): {
  [key in keyof T]: any;
} {
  let objEmpty: { [key in keyof T]: any } = {} as any;
  key.forEach((val) => {
    objEmpty[val] = obj[val];
  });
  return objEmpty;
}

export function formater(
  n: number,
  espace: ' ' | '.' | '' = ' ',
  virgule: ',' | '.' = '.'
) {
  const nombre = n.toString();
  const float = parseFloat(nombre).toString();
  let [nombreString, nombreVirgule] = ['', ''];
  if (float.split('.').length === 2) {
    [nombreString, nombreVirgule] = float.split('.');
  } else {
    nombreString = float;
  }
  const longueur = nombreString.length;

  if (longueur <= 3) {
    return nombreString;
  }

  let resultat = '';
  let i = 0;

  for (i = longueur - 3; i >= 0; i -= 3) {
    resultat = espace + nombreString.substring(i, i + 3) + resultat;
  }

  if (i < 0) {
    resultat = nombreString.substring(0, i + 3) + resultat;
  }

  if (nombreVirgule !== '') {
    let nombreFormat = resultat.trim() + virgule + nombreVirgule;
    console.log(nombreFormat);
    return nombreFormat;
  }
  let nombreFormat = resultat.trim();
  console.log(nombreFormat);
  return nombreFormat;
}

export function countDate(date1:Date, date2:Date) {

  const timestamp1 = date1.getTime();
  const timestamp2 = date2.getTime();

  const differenceMs = Math.abs(timestamp2 - timestamp1);

  const differenceDays = Math.ceil(differenceMs / (1000 * 60 * 60 * 24));
  console.log("il y a ", differenceDays, "de difference")
  return differenceDays;
}

export function isEqualDate(date1:Date, date2:Date):boolean{
  return date1.getDate()==date2.getDate()&&date1.getMonth()==date2.getMonth()&&date1.getFullYear()==date2.getFullYear();
}