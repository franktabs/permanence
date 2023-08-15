import { Component, OnInit } from '@angular/core';
import { DataPlanning } from 'src/app/shared/components/modal-planification/modal-planification.component';
import { IApiPersonnel } from 'src/app/shared/interfaces/iapipersonnel';
import { IMonth } from 'src/app/shared/interfaces/imonth';
import { IPermanence } from 'src/app/shared/interfaces/ipermanence';
import { IPersonnel } from 'src/app/shared/interfaces/ipersonnel';
import { IPersonnelNuit } from 'src/app/shared/interfaces/ipersonnelNuit';
import { IPersonnelJour } from 'src/app/shared/interfaces/ipersonneljour';
import { IPlanning } from 'src/app/shared/interfaces/iplanning';
import { ApiService } from 'src/app/shared/services/api.service';
import {
  checkPointDate,
  countDate,
  formatJSON,
  isEqualDate,
  mapJSON,
  shuffleArray,
  stringDate,
  stringMonth,
} from 'src/app/shared/utils/function';
import {
  mapPersonnel,
  mapReversePersonnel,
} from 'src/app/shared/utils/tables-map';
import { TypePersonnel } from 'src/app/shared/utils/types-map';

type Remplissage = {
  month: number;
  superviseur: number;
  pointDate: number[];
};

@Component({
  selector: 'app-page-plannification',
  templateUrl: './page-plannification.component.html',
  styleUrls: [
    './page-plannification.component.scss',
    '../shared/styles/styles.scss',
  ],
})
export class PagePlannificationComponent implements OnInit {
  public openModalPlanification: boolean = false;

  public start: Date = new Date('2023-08-13');
  public tabDays: number[] = [];
  private _dataPlanning: DataPlanning | null = null;

  public visiblePlanning: boolean = false;

  public visibleModalPermanence: boolean = false;

  public months: IMonth[] = [];
  // public action:"CONSULTATE"|"CREATE" = "CONSULTATE"

  public remplissage: Remplissage = {
    month: -1,
    superviseur: 0,
    pointDate: [],
  };

  public group1: IApiPersonnel[] = [];
  public group2: IApiPersonnel[] = [];
  public group3: IApiPersonnel[] = [];

  public plannings: IPlanning[] = [];

  public planningVisible: IPlanning | null = null;

  public permanences: IPermanence[] = [];

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api
      .getAllData<IPlanning[] | undefined>({ for: 'plannings' })
      .subscribe((subs) => {
        if (subs) this.plannings = subs;
      });

    this.api
      .getAllData<IApiPersonnel[]>({ for: 'personnels' })
      .subscribe((subs) => {
        subs.forEach((person, ind) => {
          if (person.fonction.toLowerCase().includes('responsable du tfj')) {
            this.group1.push(person);
          } else if (
            person.departement?.name?.toLowerCase().includes('production') ||
            person.departement?.name?.toLowerCase().includes('collaborative')
          ) {
            this.group2.push(person);
          } else if (
            person.departement?.name?.toLowerCase().includes('logiciels') ||
            person.departement?.name?.toLowerCase().includes('réseau') ||
            person.departement?.name?.toLowerCase().includes('sécurité')
          ) {
            this.group3.push(person);
          }
        });
      });
  }

  handleModalPlanification() {
    this.openModalPlanification = true;
    console.log('permanences', this.permanences);
  }

  set dataPlanning(value: DataPlanning | null) {
    this._dataPlanning = value;
    if (value) {
      this.generatePlanning(+value.periode);
    }
  }

  get dataPlanning() {
    return this._dataPlanning;
  }

  voirPlanning(planning: IPlanning) {
    this.visiblePlanning = false;
    let thePermanences: IPermanence[] = [];
    this.planningVisible = planning;
    if (planning.months)
      for (let theMonth of planning.months) {
        if (theMonth.permanences) {
          for (let permanence of theMonth.permanences) {
            thePermanences.push(permanence);
          }
        }
      }
    thePermanences.sort((permanence1, permanence2) => {
      return permanence1.date.localeCompare(permanence2.date);
    });
    this.permanences = thePermanences;

    this.remplissage = { month: -1, superviseur: 0, pointDate: [] };
    this.buildPointDate(new Date(planning.start), planning.periode);
    this.visiblePlanning = true;
  }

  buildPointDate(start: Date, m: number) {
    this.start = start;
    let end = new Date(start.getFullYear(), start.getMonth(), 1);
    for (let i = 1; i <= m; i++) {
      let newDate = new Date(end.getTime());
      newDate.setMonth(newDate.getMonth() + i);
      let datePoint = checkPointDate(newDate);
      let coutDay = countDate(start, datePoint);
      this.remplissage.pointDate.push(coutDay);
    }
  }

  generatePlanning(m: number) {
    this.visiblePlanning = false;
    this.permanences = [];
    this.remplissage = { month: -1, superviseur: 0, pointDate: [] };
    this.months = [];
    let fistDate = new Date();
    let thatDate = new Date(fistDate.getFullYear(), fistDate.getMonth(), 1);
    thatDate.setMonth(thatDate.getMonth() + 1);
    let end = new Date(thatDate.getTime());
    let start = new Date(thatDate.getTime());

    while (start.getDay() != 1) {
      start.setDate(start.getDate() + 1);
    }

    let newPlanning: IPlanning = {
      start: stringDate(start),
      periode: m,
      isValid: null,
      submissionDate: stringDate(new Date()),
      months: [],
    };

    let month: IMonth = {
      name: stringMonth(start.getMonth()),
      numero: start.getMonth(),
      start: stringDate(start),
      permanences: [],
      superviseur: null,
      planning: null,
    };

    let month_planning: IPlanning = { ...newPlanning };
    month_planning.months = [];
    month.planning = month_planning;

    if (newPlanning.months) newPlanning.months.push(month);

    if (newPlanning.months)
      for (let i = 1; i <= m; i++) {
        let newMonth = newPlanning.months[i - 1];
        let newDate = new Date(end.getTime());
        newDate.setMonth(newDate.getMonth() + i);
        let datePoint = checkPointDate(newDate);
        newMonth.end = stringDate(datePoint);
        if (i + 1 <= m) {
          let newStartDay = new Date(datePoint.getTime());
          newStartDay.setDate(datePoint.getDate() + 1);
          let nextMonth: IMonth = {
            name: stringMonth(newStartDay.getMonth()),
            numero: newStartDay.getMonth(),
            start: stringDate(newStartDay),
            permanences: [],
            planning: null,
            superviseur: null,
          };
          newPlanning.months.push(newMonth);
          let month_planning: IPlanning = { ...newPlanning };
          month_planning.months = [];
          nextMonth.planning = month_planning;
        }
        let newSuperviseur = this.dataPlanning?.superviseur[i - 1];
        if (newSuperviseur && !(typeof newSuperviseur == 'string')) {
          let formatSuperviseur = formatJSON<TypePersonnel, IApiPersonnel>({
            obj: newSuperviseur,
            correspondance: mapReversePersonnel,
          });
          newMonth.superviseur = formatSuperviseur;
        }
        let coutDay = countDate(start, datePoint);
        this.remplissage.pointDate.push(coutDay);
      }

    end.setMonth(end.getMonth() + m);
    if (end.getDay() == 1 && end.getDate() == 1) {
      end.setDate(end.getDate() - 1);
    } else {
      while (end.getDay() != 0) {
        end.setDate(end.getDate() + 1);
      }
    }

    newPlanning.end = stringDate(end);

    let nbrDays = countDate(start, end);

    let oneDay = new Date(start.getTime());
    oneDay.setDate(oneDay.getDate() + nbrDays);

    let dayMinus = 0;
    if (end.getDate() < oneDay.getDate()) {
      dayMinus = -1;
    }

    this.start = start;

    for (let j = 0; j < nbrDays + 1 + dayMinus; j++) {
      let datePermanence = this.addDay(j);
      let ferierPermanence = this.dataPlanning?.feriers;
      let permanence: IPermanence = {
        date: stringDate(datePermanence) || '',
        type: datePermanence.getDay() == 6 ? 'ouvrable' : 'simple',
        personnels_jour: [],
        personnels_nuit: [],
        month: null,
      };
      this.permanences.push(permanence);
      if (ferierPermanence && ferierPermanence.length) {
        for (let ferier of ferierPermanence) {
          let thisDate = new Date(ferier.jour);
          if (
            isEqualDate(datePermanence, thisDate) &&
            (ferier.type == 'ouvrable' || ferier.type == 'non_ouvrable')
          ) {
            permanence.type = ferier.type;
            break;
          }
        }
      }

      if (newPlanning.months)
        for (let theMonth of newPlanning.months) {
          if (theMonth.end) {
            if (
              theMonth.start <= permanence.date &&
              permanence.date <= theMonth.end
            ) {
              let permanence_month: IMonth = JSON.parse(
                JSON.stringify(theMonth)
              );
              delete permanence_month.permanences;
              permanence.month = permanence_month;
              theMonth.permanences?.push(permanence);
            }
          }
        }
    }
    // newPlanning.permanences = this.permanences;
    this.planningVisible = newPlanning;
    this.fillPlanning();
    this.plannings.unshift(newPlanning);
    this.visiblePlanning = true;
    console.log('le plannings visible', this.planningVisible);
    this.tabDays = Array.from(
      { length: nbrDays + 1 + dayMinus },
      (_, ind) => ind
    );
  }

  addDay(d: number) {
    let startDay = new Date(this.start.getTime());
    startDay.setDate(startDay.getDate() + d);
    return startDay;
  }

  receiveData(data: any) {
    this.dataPlanning = data;
  }

  isSuperviseur(d: number): boolean {
    let startDay = new Date(this.start.getTime());
    startDay.setDate(startDay.getDate() + d);
    if (startDay.getMonth() != this.remplissage.month) {
      this.remplissage.month = startDay.getMonth();
      return true;
    }
    return false;
  }

  displaySuperviseur(n: number): string {
    if (this.planningVisible?.months) {
      let dataSuperviseur = this.planningVisible.months[n].superviseur;
      if (typeof dataSuperviseur === 'string') {
        return dataSuperviseur;
      } else if (dataSuperviseur) {
        return dataSuperviseur.firstname as string;
      }
    }
    return '';
  }

  genTabNum(n: number, i: number): number[] {
    if (i < 0) {
      return Array.from({ length: n + 1 }, (_, ind) => ind);
    }
    let lastPoint = this.remplissage.pointDate[i];
    let diffPoint = n - lastPoint;
    let dayMinus = 0;
    let date = new Date(this.start.getTime());
    date.setDate(date.getDate() + lastPoint);
    if (date.getDay() == 1 || date.getDay() == 0) {
      dayMinus = -1;
    }
    let indiceMinus = 0;
    if (i > 0) {
      indiceMinus = -1;
      dayMinus = 0;
    }
    return Array.from(
      { length: diffPoint + dayMinus },
      (_, ind) => ind + 1 + indiceMinus
    );
  }

  findMan(
    person: IApiPersonnel,
    group: IApiPersonnel[],
    index: number,
    date?: Date
  ) {
    if (person.sexe == 'F') {
      let lastPosition = index;
      let i = lastPosition;
      while (person.sexe == 'F') {
        i = (i + 1) % group.length;
        person = group[i];
      }
      let temps = group[lastPosition];
      group[lastPosition] = person;
      group[i] = temps;
    }

    return person;
  }

  fillPlanning() {
    let decalage = 0;
    let group1 = shuffleArray([...this.group1]);
    let group2 = shuffleArray([...this.group2]);
    let group3 = shuffleArray([...this.group3]);

    let nbrGroup1 = group1.length;
    let nbrGroup2 = group2.length;
    let nbrGroup3 = group3.length;

    console.log('groupe formé', group1, group2, group3);

    let repartiGroup2 = 0;
    let repartiGroup3 = 0;

    this.permanences.forEach((permanence, index) => {
      let date = new Date(permanence.date);
      let personnel_permanence: IPermanence = JSON.parse(
        JSON.stringify(permanence)
      );
      delete personnel_permanence.personnels_jour;
      delete personnel_permanence.personnels_nuit;
      if (date.getDay() != 0 && date.getDay() != 6) {
        if (permanence.type == 'simple') {
          let person1 = group1[(index - decalage) % nbrGroup1];
          let lastPosition = (index - decalage) % nbrGroup1;
          person1 = this.findMan(person1, group1, lastPosition);

          let person2 = group3[repartiGroup3++ % nbrGroup3];
          lastPosition = (repartiGroup3 - 1 + nbrGroup3) % nbrGroup3;
          person2 = this.findMan(person2, group3, lastPosition, date);
          // if (person1.sexe == 'F') {
          //   let i = lastPosition;
          //   while (person1.sexe == 'F') {
          //     i = (i + 1) % nbrGroup1;
          //     person1 = group1[i];
          //   }
          //   let temps = group1[lastPosition];
          //   group1[lastPosition] = person1;
          //   group1[i] = temps;
          // }

          if (person1.sexe == 'M' && person2.sexe == 'M') {
            let person1Nuit: IPersonnelNuit = {
              permanence: personnel_permanence,
              personnel: person1,
              responsable: true,
            };
            let person2Nuit: IPersonnelNuit = {
              permanence: personnel_permanence,
              personnel: person2,
              responsable: false,
            };
            permanence.personnels_nuit?.push(person1Nuit, person2Nuit);
          }
        }
      } else if (date.getDay() == 6) {
        if (permanence.type == 'ouvrable') {
          let permanenceLundi = this.permanences[index - 5];
          if (
            permanence.personnels_jour != null &&
            permanenceLundi.personnels_nuit != null
          ) {
            permanence.personnels_jour[0] = permanenceLundi.personnels_nuit[0];

            let person1 = group2[repartiGroup2++ % nbrGroup2];
            let person2 = group2[repartiGroup2++ % nbrGroup2];
            let person3 = group2[repartiGroup2++ % nbrGroup2];
            let person4 = group3[repartiGroup3++ % nbrGroup3];
            let person5 = group3[repartiGroup3++ % nbrGroup3];

            let person1Jour: IPersonnelJour = {
              permanence: personnel_permanence,
              personnel: person1,
              responsable: true,
            };
            let person2Jour: IPersonnelJour = {
              personnel: person2,
              responsable: false,
              permanence: personnel_permanence,
            };
            let person4Jour: IPersonnelJour = {
              personnel: person4,
              responsable: false,
              permanence: personnel_permanence,
            };
            permanence.personnels_jour?.push(
              person1Jour,
              person2Jour,
              person4Jour
            );

            let lastPosition = (repartiGroup2 - 1 + nbrGroup2) % nbrGroup2;
            person3 = this.findMan(person3, group2, lastPosition);

            lastPosition = (repartiGroup3 - 1 + nbrGroup3) % nbrGroup3;
            person5 = this.findMan(person5, group3, lastPosition);

            let person5Nuit: IPersonnelNuit = {
              personnel: person5,
              responsable: true,
              permanence: personnel_permanence,
            };
            let person3Nuit: IPersonnelNuit = {
              personnel: person3,
              responsable: false,
              permanence: personnel_permanence,
            };

            permanence.personnels_nuit?.push(person5Nuit, person3Nuit);
          }
        }
      } else if (date.getDay() == 0) {
        decalage++;

        if (permanence.type == 'simple') {
          let person1 = group2[repartiGroup2++ % nbrGroup2];
          let person2 = group2[repartiGroup2++ % nbrGroup2];

          let person3 = group3[repartiGroup3++ % nbrGroup3];
          let person4 = group3[repartiGroup3++ % nbrGroup3];

          let person1Jour: IPersonnelJour = {
            personnel: person1,
            responsable: true,
            permanence: personnel_permanence,
          };
          permanence.personnels_jour?.push(person1Jour);

          let lastPosition = (repartiGroup2 - 1 + nbrGroup2) % nbrGroup2;
          person2 = this.findMan(person2, group2, lastPosition);

          let person2Nuit: IPersonnelNuit = {
            personnel: person2,
            responsable: true,
            permanence: personnel_permanence,
          };
          permanence.personnels_nuit?.push(person2Nuit);

          lastPosition = (repartiGroup3 - 1 + nbrGroup3) % nbrGroup3;
          person4 = this.findMan(person4, group3, lastPosition);

          let person3Jour: IPersonnelJour = {
            personnel: person3,
            responsable: false,
            permanence: personnel_permanence,
          };

          let person4Nuit: IPersonnelNuit = {
            personnel: person4,
            responsable: false,
            permanence: personnel_permanence,
          };
          permanence.personnels_jour?.push(person3Jour);
          permanence.personnels_nuit?.push(person4Nuit);
        }
      }
    });
  }
}
