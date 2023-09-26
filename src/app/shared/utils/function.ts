

import { IApiPersonnel } from '../interfaces/iapipersonnel';

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

export function countDate(date1: Date, date2: Date) {
  const timestamp1 = date1.getTime();
  const timestamp2 = date2.getTime();

  const differenceMs = Math.abs(timestamp2 - timestamp1);

  const differenceDays = Math.ceil(differenceMs / (1000 * 60 * 60 * 24));
  console.log('il y a ', differenceDays, 'de difference');
  return differenceDays;
}

export function isEqualDate(date1: Date, date2: Date): boolean {
  return (
    date1.getDate() == date2.getDate() &&
    date1.getMonth() == date2.getMonth() &&
    date1.getFullYear() == date2.getFullYear()
  );
}

export function checkPointDate(end: Date) {
  // end.setMonth(end.getMonth() + m);
  if (end.getDay() == 1 && end.getDate() == 1) {
    end.setDate(end.getDate() - 1);
  } else {
    while (end.getDay() != 0) {
      end.setDate(end.getDate() + 1);
    }
  }
  return end;
}

export function stringDate(date: Date) {
  return (
    date.getFullYear() +
    '-' +
    (date.getMonth() + 1).toString().padStart(2, '0') +
    '-' +
    date.getDate().toString().padStart(2, '0')
  );
}

export function shuffleArray<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export function stringMonth(i: number): string {
  if (i == 0) {
    return 'janvier';
  } else if (i == 1) {
    return 'fevrier';
  } else if (i == 2) {
    return 'mars';
  } else if (i == 3) {
    return 'avril';
  } else if (i == 4) {
    return 'mai';
  } else if (i == 5) {
    return 'juin';
  } else if (i == 6) {
    return 'juillet';
  } else if (i == 7) {
    return 'aout';
  } else if (i == 8) {
    return 'septembre';
  } else if (i == 9) {
    return 'octobre';
  } else if (i == 10) {
    return 'novembre';
  } else if (i == 11) {
    return 'decembre';
  } else {
    return 'aucun mois';
  }
}

export function scrollToDiv(elm: string) {
  const element = document.querySelector(elm);
  element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export function separatePersonnel(
  tab: IApiPersonnel[],
  optionsManager: IApiPersonnel[],
  optionsRessources: IApiPersonnel[] = []
) {
  tab.forEach((person) => {
    if (
      (person.fonction.toLowerCase().includes('manager') ||
        person.fonction.toLowerCase().includes('chef')) &&
      !(
        person.fonction.toLowerCase().includes('directeur') ||
        person.fonction.toLowerCase().includes('admin-0')
      )
    ) {
      optionsManager.push(person);
    } else if (
      !(
        person.fonction.toLowerCase().includes('directeur') ||
        person.fonction.toLowerCase().includes('admin-0')
      )
    ) {
      optionsRessources.push(person);
    }
  });
  console.log('Managers =>', optionsManager);
  console.log('Ressources =>', optionsRessources);
}

export function separatePersonnelTFJ(
  tab: IApiPersonnel[],
  optionsManager: IApiPersonnel[] = [],
  optionsTFJ: IApiPersonnel[] = [],
  optionsRessources: IApiPersonnel[] = []
) {
  tab.forEach((person) => {
    if (
      (person.fonction.toLowerCase().includes('manager') ||
        person.fonction.toLowerCase().includes('chef')) &&
      !(
        person.fonction.toLowerCase().includes('directeur') ||
        person.fonction.toLowerCase().includes('admin-0')
      )
    ) {
      optionsManager.push(person);
    } else if (
      !(
        person.fonction.toLowerCase().includes('directeur') ||
        person.fonction.toLowerCase().includes('admin-0')
      ) &&
      person.sexe == 'M'
    ) {
      optionsTFJ.push(person);
    } else if (
      !(
        person.fonction.toLowerCase().includes('directeur') ||
        person.fonction.toLowerCase().includes('admin-0')
      )
    ) {
      optionsRessources.push(person);
    }
  });

  console.log('Managers =>', optionsManager);
  console.log('Ressources =>', optionsRessources);
}

export function filterPersonnelRessource(
  tab: IApiPersonnel[],
  tabExclude: IApiPersonnel[] = [

  ],
  personnels: IApiPersonnel[] = []
) {
  let idExlude = tabExclude.map((person)=>{
    return person.id;
  })
  tab.forEach((person) => {
    if (
      !(
        person.fonction.toLowerCase().includes('manager') ||
        person.fonction.toLowerCase().includes('chef') ||
        person.fonction.toLowerCase().includes('directeur') ||
        person.fonction.toLowerCase().includes('admin-0') || 
        idExlude.includes(person.id)
      )
    
    ) {
      personnels.push(person)
    }
  });
  return personnels;
}

export function filterOffAdmin(tab:IApiPersonnel[], tabInclude:IApiPersonnel[]=[]){
  tab.forEach((person)=>{
    if(!person.fonction.toLowerCase().includes('admin-0')){
      tabInclude.push(person);
    }
  })
  return tabInclude;
}
