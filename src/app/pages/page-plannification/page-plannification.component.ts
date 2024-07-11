import { LiveAnnouncer } from '@angular/cdk/a11y';
import {
    Component,
    ElementRef,
    OnDestroy,
    OnInit,
    ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import axios from 'axios';
import { Subject, takeUntil } from 'rxjs';
import {
    CRITERES,
    CRITERE_OBJECT,
} from 'src/app/shared/components/modal-input/modal-input.component';
import { DataPlanning } from 'src/app/shared/components/modal-planification/modal-planification.component';
import { IApiPersonnel } from 'src/app/shared/interfaces/iapipersonnel';
import { IMonth } from 'src/app/shared/interfaces/imonth';
import { IPermanence } from 'src/app/shared/interfaces/ipermanence';
import { IPersonnel } from 'src/app/shared/interfaces/ipersonnel';
import { IPersonnelNuit } from 'src/app/shared/interfaces/ipersonnelNuit';
import { IPersonnelJour } from 'src/app/shared/interfaces/ipersonneljour';
import { IPlanning } from 'src/app/shared/interfaces/iplanning';
import { RoleType } from 'src/app/shared/interfaces/irole';
import { AlertService } from 'src/app/shared/services/alert.service';
import { ApiService } from 'src/app/shared/services/api.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import {
    checkPointDate,
    cloner,
    countDate,
    filterPersonnelRessource,
    formatJSON,
    isEqualDate,
    mapJSON,
    scrollToDiv,
    shuffleArray,
    stringDate,
    stringMonth,
} from 'src/app/shared/utils/function';
import {
    mapPersonnel,
    mapReversePersonnel,
} from 'src/app/shared/utils/tables-map';
import { TypePersonnel } from 'src/app/shared/utils/types-map';
import { BacktrackPlanificateur } from 'src/app/utils/BacktrackPlanificateur';
import { UnitePermanence } from 'src/app/utils/UnitePermanence';

export type RepartitionSemaine = {
    semaine: number;
    samediJour: number;
    samediNuit: number;
    dimancheJour: number;
    dimancheNuit: number;
};

type Remplissage = {
    month: number;
    superviseur: number;
    pointDate: number[];
};

export type GroupsPeople = {
    data: {
        personnel: IApiPersonnel;
        criteres: (keyof typeof CRITERE_OBJECT)[];
        group: string[];
        date: Date | null;
    }[];
    parcours: number;
};

type ApparitionPerson = {
    [key in
    | keyof IApiPersonnel
    | keyof OtherKey]?: key extends keyof IApiPersonnel
    ? IApiPersonnel[key]
    : key extends keyof OtherKey
    ? OtherKey[key]
    : never;
};

type OtherKey = {
    departements: string;
    apparitions: number;
};

@Component({
    selector: 'app-page-plannification',
    templateUrl: './page-plannification.component.html',
    styleUrls: [
        './page-plannification.component.scss',
        '../shared/styles/styles.scss',
    ],
})
export class PagePlannificationComponent implements OnInit, OnDestroy {
    public openModalPlanification: boolean = false;
    public openModalAbsence: boolean = false;

    public start: Date = new Date('2023-08-13');
    public tabDays: number[] = [];
    private _dataPlanning: DataPlanning | null = null;

    public visiblePlanning: boolean = false;

    public _resetPlanning: boolean = false;
    public _resetPersonnel: boolean = false;

    public visibleModalPermanence: boolean = false;

    public months: IMonth[] = [];

    public nbrSemaineParcouru: number = 0;

    public destroy$: Subject<boolean> = new Subject();
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

    public authRoles: RoleType[] = [];

    public openModal: boolean = false;
    public row: ApparitionPerson | null = null;

    public displayedColumns: (keyof ApparitionPerson)[] = [
        // 'departements',
        'firstname',
        'sexe',
        'apparitions',
    ];

    public dataSource!: MatTableDataSource<ApparitionPerson>;

    private _paginator!: MatPaginator;

    @ViewChild(MatSort) sort!: MatSort;

    @ViewChild(MatPaginator, { static: false })
    set paginator(value: MatPaginator) {
        this._paginator = value;
        if (this.dataSource) {
            this.dataSource.paginator = value;
        }
    }

    get paginator() {
        return this._paginator;
    }

    constructor(
        private api: ApiService,
        private auth: AuthService,
        private alert: AlertService,
        private elementRef: ElementRef,
        private _liveAnnouncer: LiveAnnouncer
    ) { }

    ngOnInit(): void {
        this.authRoles = this.auth.rolesName;

        this.initDataPersonnels();
        this.initDataPlannings();

        // let dataPersonnel = this.api.data.personnels;
        // this.api.personnels$.pipe(takeUntil(this.destroy$)).subscribe((subs) => {});

        // this.api
        //   .getAllData<IPlanning[] | undefined>({ for: 'plannings' })
        //   .subscribe((subs) => {
        //     if (subs) this.plannings = subs;
        //   });

        // this.api
        //   .getAllData<IApiPersonnel[]>({ for: 'personnels' })
        //   .subscribe((subs) => {
        //     (subs || []).forEach((person, ind) => {
        //       if (person.fonction.toLowerCase().includes('responsable du tfj')) {
        //         this.group1.push(person);
        //       } else if (
        //         person.departement?.name?.toLowerCase().includes('production') ||
        //         person.departement?.name?.toLowerCase().includes('collaborative')
        //       ) {
        //         this.group2.push(person);
        //       } else if (
        //         person.departement?.name?.toLowerCase().includes('logiciels') ||
        //         person.departement?.name?.toLowerCase().includes('réseau') ||
        //         person.departement?.name?.toLowerCase().includes('sécurité')
        //       ) {
        //         this.group3.push(person);
        //       }
        //     });
        //   });
    }

    initDataPersonnels() {
        let dataPersonnel = this.api.data.personnels;

        this.api.personnels$
            .pipe(takeUntil(this.destroy$))
            .subscribe((subs) => {
                this.api.data.personnels = subs;
                // this.initOperationPersonnels(subs);
            });

        if (dataPersonnel && dataPersonnel.length) {
            // this.initOperationPersonnels(dataPersonnel);
        } else {
            this.api
                .getAllData<IApiPersonnel[]>({ for: 'personnels' })
                .subscribe((subs) => {
                    this.api.data.personnels = subs || [];
                    this.api.personnels$.next(subs || []);
                });
        }
    }

    initDataPlannings() {
        let dataPlanning = this.api.data.plannings;

        this.api.plannings$.pipe(takeUntil(this.destroy$)).subscribe((subs) => {
            console.log('changement du planning in page-plannifications');
            this.api.data.plannings = subs;
            this.plannings = subs;
            this.planningVisible = this.plannings[0];
            this.plannings.sort((planning1, planning2) => {
                if (
                    this.planningVisible &&
                    this.planningVisible.id &&
                    planning1.id &&
                    this.planningVisible.id == planning1.id
                ) {
                    this.planningVisible = planning1;
                } else if (
                    this.planningVisible &&
                    this.planningVisible.id &&
                    planning2.id &&
                    this.planningVisible.id == planning2.id
                ) {
                    this.planningVisible = planning2;
                }
                return planning2.submissionDate.localeCompare(
                    planning1.submissionDate
                );
            });
            if (this.visiblePlanning && this.planningVisible) {
                this.voirPlanning(this.planningVisible);
            }
        });

        if (dataPlanning && dataPlanning.length) {
            this.plannings = dataPlanning;
            this.plannings.sort((planning1, planning2) => {
                return planning2.submissionDate.localeCompare(
                    planning1.submissionDate
                );
            });
        } else {
            this.api
                .getAllData<IPlanning[] | undefined>({ for: 'plannings' })
                .subscribe((subs) => {
                    this.api.data.plannings = subs || [];
                    this.api.plannings$.next(subs || []);
                });
        }
    }

    initOperationPlannings(subs: IPlanning[]) {
        this.plannings = subs;
    }

    initOperationGroupPersonnels(subs: IApiPersonnel[]) {
        subs = filterPersonnelRessource(subs, this.group1);
        subs.forEach((person, ind) => {
            // if (person.fonction.toLowerCase().includes('responsable du tfj')) {
            //   this.group1.push(person);
            // } else
            if (
                person.departement?.name
                    ?.toLowerCase()
                    .includes('production') ||
                person.departement?.name
                    ?.toLowerCase()
                    .includes('collaborative')
            ) {
                this.group2.push(person);
            } else if (
                person.departement?.name?.toLowerCase().includes('logiciel') ||
                person.departement?.name?.toLowerCase().includes('réseau') ||
                person.departement?.name?.toLowerCase().includes('reseau') ||
                person.departement?.name?.toLowerCase().includes('sécurité') ||
                person.departement?.name?.toLowerCase().includes('securite') ||
                person.departement?.name?.toLowerCase().includes('support')
            ) {
                this.group3.push(person);
            }
        });
    }

    handleModalPlanification() {
        this.openModalPlanification = true;
        console.log('permanences', this.permanences);
    }

    set dataPlanning(value: DataPlanning | null) {
        this._dataPlanning = value;
        // this.group1 = value?.group1 as IApiPersonnel[];
        // this.initOperationGroupPersonnels(this.api.data.personnels);
        if (value) {
            this.generatePlanning(+value.periode);
        }
    }

    get dataPlanning() {
        return this._dataPlanning;
    }

    set resetPlanning(value: boolean) {
        this._resetPlanning = value;
        if (value) {
            this.api.data.plannings = [];
            this.initDataPlannings();
        }
    }
    get resetPlanning() {
        return this._resetPlanning;
    }

    set resetPersonnel(value: boolean) {
        this._resetPersonnel = value;
        if (value) {
            this.api.data.personnels = [];
            this.initDataPersonnels();
        }
    }

    get resetPersonnel() {
        return this._resetPlanning;
    }

    async voirPlanning(planning: IPlanning) {
        this.visiblePlanning = false;
        let thePermanences: IPermanence[] = [];
        this.planningVisible = planning;
        if (planning.months)
            for (let theMonth of planning.months) {
                if (theMonth.permanences) {
                    theMonth.permanences.sort((permanence1, permanence2) => {
                        return permanence1.date.localeCompare(permanence2.date);
                    });
                }
            }
        // thePermanences.sort((permanence1, permanence2) => {
        //   return permanence1.date.localeCompare(permanence2.date);
        // });
        // this.permanences = thePermanences;
        // if (planning.months)
        //   for (let theMonth of planning.months) {
        //     if (theMonth.permanences) {
        //       for (let permanence of theMonth.permanences) {
        //         thePermanences.push(permanence);
        //       }
        //     }
        //   }
        // thePermanences.sort((permanence1, permanence2) => {
        //   return permanence1.date.localeCompare(permanence2.date);
        // });
        // this.permanences = thePermanences;

        this.remplissage = { month: -1, superviseur: 0, pointDate: [] };
        this.buildPointDate(new Date(planning.start), planning.periode);
        this.visiblePlanning = true;
        if (this.planningVisible.id) {
            let dataPersonnel = this.api.data.personnels;
            let apparitions: ApparitionPerson[] = [];
            try {
                let response = await axios.get(
                    this.api.URL_PLANNINGS +
                    '/count-personnels/' +
                    this.planningVisible.id
                );
                let dataAppartion: { [key in number]: number } = response.data;
                for (let person of dataPersonnel) {
                    let idPerson = person.id as number;
                    let nbrAppartion = dataAppartion[idPerson];
                    apparitions.push({
                        ...person,
                        departements: person.departement?.name || 'non defini',
                        apparitions: nbrAppartion || 0,
                    });
                }
                this.dataSource = new MatTableDataSource(apparitions);
                this.dataSource.sort = this.sort;
                this.dataSource.paginator = this.paginator;
            } catch (e) {
                console.log("Voici l'erreur => ", e);
            }
        }
        setTimeout(() => {
            scrollToDiv('#planning');
        }, 500);
    }

    buildPointDate(start: Date, m: number) {
        this.start = start;
        let end = new Date(start.getFullYear(), start.getMonth(), 1);
        let decalage = 0;
        for (let i = 1; i <= m; i++) {
            let newDate = new Date(end.getTime());
            newDate.setMonth(newDate.getMonth() + i);
            let datePoint = checkPointDate(newDate);
            let coutDay = countDate(start, datePoint);
            newDate.setDate(coutDay);
            console.log('jour de fin', start.getDay());
            if (i > 1) {
                decalage = -1;
            }
            this.remplissage.pointDate.push(coutDay - decalage);
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
            submissionDate: new Date().toISOString(),
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

        let month_planning: IPlanning = JSON.parse(JSON.stringify(newPlanning));
        month_planning.months = [];
        month.planning = month_planning;

        if (newPlanning.months) newPlanning.months.push(month);
        // console.log('newPlanning ', newPlanning.months);
        // debugger;
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
                    console.log('datePoint', datePoint);
                    console.log('newStartDay', newStartDay);
                    // debugger;
                    let nextMonth: IMonth = {
                        name: stringMonth(newStartDay.getMonth()),
                        numero: newStartDay.getMonth(),
                        start: stringDate(newStartDay),
                        permanences: [],
                        planning: null,
                        superviseur: null,
                    };
                    newPlanning.months.push(nextMonth);
                    let month_planning: IPlanning = JSON.parse(
                        JSON.stringify(newPlanning)
                    );
                    month_planning.months = [];
                    nextMonth.planning = month_planning;
                }
                let newSuperviseur = this.dataPlanning?.superviseur[i - 1];
                if (newSuperviseur && typeof newSuperviseur != 'string') {
                    let formatSuperviseur = formatJSON<
                        TypePersonnel,
                        IApiPersonnel
                    >({
                        obj: newSuperviseur,
                        correspondance: mapReversePersonnel,
                    });
                    newMonth.superviseur = formatSuperviseur;
                }

                let coutDay = countDate(start, datePoint);
                this.remplissage.pointDate.push(coutDay);
                // console.log('newPlanning passage', newPlanning.months);
                // debugger;
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

            if (ferierPermanence?.length) {
                for (let ferier of ferierPermanence) {
                    let thisDate = new Date(ferier.jour);
                    if (
                        isEqualDate(datePermanence, thisDate) &&
                        (ferier.type == 'ouvrable' ||
                            ferier.type == 'non_ouvrable')
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
        try {
            this.fillPlanning();
        } catch (e) {
            this.alert.alertMaterial({
                title: 'error',
                message: 'Une erreur produite',
            });
            console.error('Une erreur produite =>', e);
        }
        this.plannings.unshift(newPlanning);
        this.visiblePlanning = true;
        console.log('le plannings visible', this.planningVisible);
        console.log('le permanence visible', this.permanences);
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
        dataPerson: GroupsPeople['data'][number],
        group: GroupsPeople['data'],
        index: number,
        date: Date,
        nbrParcours: number = 0,
        initialIndex: number,
        groupExist: Array<GroupsPeople['data'][number] | null>,
        criteres?: typeof CRITERES
    ): GroupsPeople['data'][number] | null {
        if (nbrParcours > group.length) return dataPerson;
        let lastDataPerson = JSON.parse(JSON.stringify(dataPerson));
        let i = index;

        if (dataPerson.personnel.sexe == 'F') {
            let initParcours = nbrParcours;
            let lastPosition = index;
            i = lastPosition;

            while (
                dataPerson.personnel.sexe == 'F' &&
                nbrParcours <= group.length
            ) {
                i = (i + 1) % group.length;
                dataPerson = group[i];
                nbrParcours++;
            }
            // if (i != lastPosition) {
            //   console.log(
            //     'changement de position de group avant =>',
            //     [...group],
            //     '\nde la dataPersonne =>',
            //     dataPerson,
            //     '\net la dataPersonne =>',
            //     group[(i - nbrParcours + group.length) % group.length],
            //     'date =>',
            //     date
            //   );
            //   let temps = group[(i - nbrParcours + group.length) % group.length];
            //   group[(i - nbrParcours + group.length) % group.length] = dataPerson;
            //   lastPerson = JSON.parse(JSON.stringify(dataPerson));
            //   group[i] = temps;
            //   console.log('changement de position de group après =>', [...group]);
            // }
            lastDataPerson = JSON.parse(JSON.stringify(dataPerson));
            console.log('finMan dataPerson before =>', lastDataPerson);

            if (initParcours == nbrParcours) {
                console.log(
                    '___enf-Find-Man 1 dataPerson before =>',
                    lastDataPerson
                );
                if (nbrParcours > group.length) return null;
                return dataPerson;
            } else {
                if (i != lastPosition) {
                    console.log(
                        '___In Find-Man envoie findPerson =>',
                        lastDataPerson
                    );

                    return this.findPerson(
                        lastDataPerson,
                        group,
                        i,
                        date,
                        nbrParcours,
                        'nuit',
                        initialIndex,
                        groupExist,
                        criteres
                    );
                } else {
                    this.decalage(initialIndex, i, group);
                    if (nbrParcours > group.length) return null;
                    return group[initialIndex];
                }
            }
        }

        console.log('___enf-Find-Man 2 dataPerson before =>', lastDataPerson);

        this.decalage(initialIndex, index, group);

        return group[initialIndex];
    }

    findCompatibleDay(
        dataPerson: GroupsPeople['data'][number],
        group: GroupsPeople['data'],
        index: number,
        date: Date,
        nbrParcours: number,
        type: 'jour' | 'nuit' = 'nuit',
        initialIndex: number,
        groupExist: Array<GroupsPeople['data'][number] | null>,
        criteres?: typeof CRITERES
    ): [GroupsPeople['data'][number], number, number] {
        if (nbrParcours > group.length) return [dataPerson, index, nbrParcours];
        let lastDataPerson = JSON.parse(JSON.stringify(dataPerson));
        let lastPosition = initialIndex;
        let i = index;
        let continuer = true;

        while (continuer && nbrParcours <= group.length) {
            let lastIndex = i;
            if (criteres && criteres.length) {
                let isSatisfiedCritere = true;

                do {
                    isSatisfiedCritere = true;
                    for (let critere of criteres) {
                        if (!dataPerson.criteres.includes(critere)) {
                            isSatisfiedCritere = false;
                            i = (i + 1) % group.length;
                            dataPerson = group[i];
                            nbrParcours++;
                            break;
                        }
                    }
                } while (!isSatisfiedCritere && nbrParcours <= group.length);
            }
            let isSameDateDay = true;
            while (isSameDateDay && nbrParcours <= group.length) {
                if (dataPerson.date instanceof Date) {
                    let theDate = dataPerson.date;
                    let date_person: Date = new Date(
                        theDate.getFullYear(),
                        theDate.getMonth(),
                        theDate.getDate()
                    );
                    date_person.setDate(date_person.getDate() + 7);
                    if (
                        date_person.getDate() == date.getDate() &&
                        date_person.getMonth() == date.getMonth()
                    ) {
                        i = (i + 1) % group.length;
                        dataPerson = group[i];
                        nbrParcours++;
                    } else {
                        isSameDateDay = false;
                    }
                } else {
                    isSameDateDay = false;
                }
            }

            if (date.getDay() != 0 && date.getDay() != 6) {
                while (
                    !(
                        dataPerson.criteres.includes('REPARTI NORMALEMENT') ||
                        dataPerson.criteres.includes(
                            'APPARAIT LUNDI - VENDREDI '
                        ) ||
                        dataPerson.criteres.includes('RESPONSABLE TFJ')
                    ) &&
                    nbrParcours <= group.length
                ) {
                    i = (i + 1) % group.length;
                    dataPerson = group[i];
                    nbrParcours++;
                }
            }
            if (date.getDay() == 6) {
                while (
                    !(
                        dataPerson.criteres.includes('REPARTI NORMALEMENT') ||
                        dataPerson.criteres.includes('APPARAIT SAMEDI') ||
                        dataPerson.criteres.includes('SAMEDI JOUR') ||
                        dataPerson.criteres.includes('SAMEDI NUIT') ||
                        dataPerson.criteres.includes('APPARAIT WEEKEND') ||
                        dataPerson.criteres.includes('RESPONSABLE TFJ')
                    ) &&
                    nbrParcours <= group.length
                ) {
                    i = (i + 1) % group.length;
                    dataPerson = group[i];
                    nbrParcours++;
                }
            }
            if (date.getDay() == 0) {
                while (
                    !(
                        dataPerson.criteres.includes('REPARTI NORMALEMENT') ||
                        dataPerson.criteres.includes('APPARAIT DIMANCHE') ||
                        dataPerson.criteres.includes('DIMANCHE JOUR') ||
                        dataPerson.criteres.includes('DIMANCHE NUIT') ||
                        dataPerson.criteres.includes('APPARAIT WEEKEND')
                    ) &&
                    nbrParcours <= group.length
                ) {
                    i = (i + 1) % group.length;
                    dataPerson = group[i];
                    nbrParcours++;
                }
            }
            let isIdentiqueGroup = true;
            while (isIdentiqueGroup && nbrParcours <= group.length) {
                isIdentiqueGroup = false;
                for (let personnel of groupExist) {
                    if (personnel?.group == dataPerson.group) {
                        if (!dataPerson.group.includes('ensemble')) {
                            i = (i + 1) % group.length;
                            dataPerson = group[i];
                            nbrParcours++;
                            isIdentiqueGroup = true;
                            break;
                        }
                    }
                }
            }

            while (
                ((dataPerson.criteres.includes('PRESENT JUSTE LA NUIT') ||
                    (dataPerson.criteres.includes('SAMEDI NUIT') &&
                        !dataPerson.criteres.includes('SAMEDI JOUR') &&
                        date.getDay() == 6) ||
                    (dataPerson.criteres.includes('DIMANCHE NUIT') &&
                        !dataPerson.criteres.includes('DIMANCHE JOUR') &&
                        date.getDay() == 0)) &&
                    type == 'jour') ||
                ((dataPerson.criteres.includes('PRESENT JUSTE LE JOUR') ||
                    (dataPerson.criteres.includes('SAMEDI JOUR') &&
                        !dataPerson.criteres.includes('SAMEDI NUIT') &&
                        date.getDay() == 6) ||
                    (dataPerson.criteres.includes('DIMANCHE JOUR') &&
                        !dataPerson.criteres.includes('DIMANCHE NUIT') &&
                        date.getDay() == 0)) &&
                    type == 'nuit' &&
                    nbrParcours <= group.length)
            ) {
                i = (i + 1) % group.length;
                dataPerson = group[i];
                nbrParcours++;
            }

            if (lastIndex == i) {
                continuer = false;
            }
        }

        lastDataPerson = JSON.parse(JSON.stringify(dataPerson));
        return [lastDataPerson, i, nbrParcours];
    }

    findPerson(
        dataPerson: GroupsPeople['data'][number],
        group: GroupsPeople['data'],
        index: number,
        date: Date,
        nbrParcours: number = 0,
        temps: 'jour' | 'nuit' = 'nuit',
        initialIndex: number = index,
        groupExist: Array<GroupsPeople['data'][number] | null>,
        critere?: typeof CRITERES
    ): GroupsPeople['data'][number] | null {
        if (nbrParcours > group.length) {
            return dataPerson;
        }
        let initParcours = nbrParcours;
        let continuer = true;
        let lastPosition = initialIndex;
        let i = index;
        let lastDataPerson = JSON.parse(JSON.stringify(dataPerson));

        while (continuer && nbrParcours <= group.length) {
            let indice: number = 0;
            [dataPerson, indice, nbrParcours] = this.findCompatibleDay(
                dataPerson,
                group,
                i,
                date,
                nbrParcours,
                temps,
                initialIndex,
                groupExist,
                critere
            );
            i = indice;
            let holidays = dataPerson.personnel.vacancies;

            if (holidays && holidays.length) {
                let isHoliday = false;
                for (let holiday of holidays) {
                    if (
                        holiday.start <= stringDate(date) &&
                        stringDate(date) <= holiday.end
                    ) {
                        i = (i + 1) % group.length;
                        dataPerson = group[i];
                        nbrParcours++;
                        isHoliday = true;
                        break;
                    }
                }
                if (isHoliday == false) {
                    [dataPerson, indice, nbrParcours] = this.findCompatibleDay(
                        dataPerson,
                        group,
                        i,
                        date,
                        nbrParcours,
                        temps,
                        initialIndex,
                        groupExist
                    );

                    if (indice == i) {
                        continuer = false;
                    }
                }
            } else {
                continuer = false;
            }
        }

        lastDataPerson = JSON.parse(JSON.stringify(dataPerson));
        // if (i != lastPosition) {
        //   console.log(
        //     'changement de position de group avant =>',
        //     [...group],
        //     '\nde la dataPersonne =>',
        //     dataPerson,
        //     '\net la dataPersonne =>',
        //     group[(i - nbrParcours + group.length) % group.length],
        //     'date =>',
        //     date
        //   );

        //   let temps = group[(i - nbrParcours + group.length) % group.length];
        //   lastDataPerson = JSON.parse(JSON.stringify(dataPerson));
        //   group[(i - nbrParcours + group.length) % group.length] = dataPerson;
        //   group[i] = temps;

        //   console.log('changement de position de group après =>', [...group]);
        // }
        console.log('findPerson dataPerson before =>', lastDataPerson);
        if (temps == 'jour') {
            this.decalage(initialIndex, i, group);

            console.log('_____fin find-person 1 _____', lastDataPerson);
            if (nbrParcours > group.length) return null;
            let returnPerson = group[initialIndex];
            if (returnPerson) {
                returnPerson.date = date;
            }
            return returnPerson;
        }

        if (i != lastPosition || nbrParcours == 0) {
            console.log(
                '__In FindPerson  envoie find-Man _____',
                lastDataPerson
            );
            let returnPerson = this.findMan(
                lastDataPerson,
                group,
                i,
                date,
                nbrParcours,
                initialIndex,
                groupExist,
                critere
            );
            if (returnPerson) {
                returnPerson.date = date;
            }
            return returnPerson;
        } else {
            console.log(
                '_____fin find-person 2 _____',
                lastDataPerson,
                '___ indice i=',
                i,
                '__indice lastPosition=',
                lastPosition,
                '___nbrParcours=',
                nbrParcours
            );

            this.decalage(initialIndex, i, group);
            if (nbrParcours > group.length) return null;
            let returnPerson = group[initialIndex];
            if (returnPerson) {
                returnPerson.date = date;
            }
            return returnPerson;
        }
    }

    trierPersonChief(
        tabs: GroupsPeople['data'],
        countChief: { [key in number]: number }
    ): GroupsPeople['data'] {
        tabs.sort((pers1, pers2) => {
            let nbrChiefPers1 = countChief[pers1.personnel.id || '-1'];
            let nbrChiefPers2 = countChief[pers2.personnel.id || '-1'];
            if ((nbrChiefPers1 == -1 || !nbrChiefPers1) && pers1.personnel.id) {
                countChief[pers1.personnel.id] = 0;
                nbrChiefPers1 = 0;
            }
            if ((nbrChiefPers2 == -1 || !nbrChiefPers2) && pers2.personnel.id) {
                countChief[pers2.personnel.id] = 0;
                nbrChiefPers2 = 0;
            }
            return nbrChiefPers1 - nbrChiefPers2;
        });

        countChief[tabs[0].personnel.id || -1] += 1;
        return tabs;
    }

    fillPlanning() {
        let decalage = 0;
        this.nbrSemaineParcouru = 0;
        let group1 = shuffleArray([...this.group1]);
        let group2 = shuffleArray([...this.group2]);
        let group3 = shuffleArray([...this.group3]);
        let groupsPeople: GroupsPeople = { data: [], parcours: 0 };
        let groupTfg: GroupsPeople = { data: [], parcours: 0 };
        let objetDataPersonnel: {
            [key in string]: GroupsPeople['data'][number];
        } = {};

        let nbrPersonDay: DataPlanning['repartition'] = {
            semaine: 4,
            samediJour: 4,
            samediNuit: 2,
            dimancheJour: 4,
            dimancheNuit: 2,
        };
        if (this.dataPlanning?.repartition) {
            nbrPersonDay = this.dataPlanning.repartition;
        }
        let iterGroup = 0;
        for (let group of this.api.data.groupes) {
            iterGroup++;
            let criteresGroup = group.criteres.map((critere) => critere.nom);
            let oneGroupPersonnel = shuffleArray([...group.personnels]);
            if (
                !criteresGroup.includes('SUPERVISEUR') &&
                !criteresGroup.includes('RESPONSABLE TFJ')
            ) {
                for (let personnel of oneGroupPersonnel) {
                    if (!personnel.id) {
                        throw Error('Invalid Identification Personnel');
                    }
                    let dataPersonnel: GroupsPeople['data'][number] =
                        objetDataPersonnel[personnel.id + ''];

                    if (!dataPersonnel) {
                        dataPersonnel = {
                            personnel: personnel,
                            criteres: criteresGroup,
                            group: ['group' + iterGroup],
                            date: null,
                        };
                    } else {
                        if (
                            criteresGroup.includes('PEUT APPARAITRE ENSEMBLE')
                        ) {
                            dataPersonnel.group.push(
                                'group' + iterGroup + ' ensemble'
                            );
                        } else {
                            dataPersonnel.group.push('group' + iterGroup);
                        }
                    }
                    objetDataPersonnel[personnel.id + ''] = dataPersonnel;
                }
            } else if (criteresGroup.includes('RESPONSABLE TFJ')) {
                for (let personnel of oneGroupPersonnel) {
                    if (!personnel.id) {
                        throw Error('Invalid Identification Personnel');
                    }

                    let dataPersonnel: GroupsPeople['data'][number] =
                        objetDataPersonnel[personnel.id + ''];

                    if (!dataPersonnel) {
                        dataPersonnel = {
                            personnel: personnel,
                            criteres: criteresGroup,
                            group: ['tfj'],
                            date: null,
                        };
                    } else {
                        dataPersonnel.group.push('tfj');
                    }
                    objetDataPersonnel[personnel.id + ''] = dataPersonnel;
                }
            }
        }

        for (let idPersonel in objetDataPersonnel) {
            let dataPersonnel = objetDataPersonnel[idPersonel + ''];
            if (dataPersonnel.group.includes('tfj')) {
                groupTfg.data.push(dataPersonnel);
            } else {
                groupsPeople.data.push(dataPersonnel);
            }
        }

        console.log(
            'voici les différents groupes creer',
            JSON.parse(JSON.stringify(groupsPeople)),
            groupTfg
        );

        let tabsVariables: UnitePermanence[] = [];
        let mapDatePermanence: { [key in string]: IPermanence } = {};
        let idUnitePermanence = 1;
        for (let permanence of this.permanences) {
            let datePermanence = new Date(permanence.date);
            mapDatePermanence[permanence.date] = permanence;
            //Generation des variables pour les journées de Lundi - Vendredi
            if (datePermanence.getDay() != 0 && datePermanence.getDay() != 6) {
                for (let i = 0; i < nbrPersonDay.semaine; i++) {
                    let unitePermanence = new UnitePermanence(
                        '' + idUnitePermanence++,
                        datePermanence,
                        permanence.type,
                        true,
                        i + 1,
                        null
                    );
                    tabsVariables.push(unitePermanence);
                }
            }
            //Generation des variables pour la journée de samedi
            if (datePermanence.getDay() == 6) {
                for (let i = 0; i < nbrPersonDay.samediJour; i++) {
                    let unitePermanence = new UnitePermanence(
                        '' + idUnitePermanence++,
                        datePermanence,
                        permanence.type,
                        false,
                        i + 1,
                        null
                    );
                    tabsVariables.push(unitePermanence);
                }

                for (let i = 0; i < nbrPersonDay.samediNuit; i++) {
                    let unitePermanence = new UnitePermanence(
                        '' + idUnitePermanence++,
                        datePermanence,
                        permanence.type,
                        true,
                        i + 1,
                        null
                    );
                    tabsVariables.push(unitePermanence);
                }
            }

            //Generation des variables pour la journée de dimanche
            if (datePermanence.getDay() == 0) {
                for (let i = 0; i < nbrPersonDay.dimancheJour; i++) {
                    let unitePermanence = new UnitePermanence(
                        '' + idUnitePermanence++,
                        datePermanence,
                        permanence.type,
                        false,
                        i + 1,
                        null
                    );
                    tabsVariables.push(unitePermanence);
                }

                for (let i = 0; i < nbrPersonDay.dimancheNuit; i++) {
                    let unitePermanence = new UnitePermanence(
                        '' + idUnitePermanence++,
                        datePermanence,
                        permanence.type,
                        true,
                        i + 1,
                        null
                    );
                    tabsVariables.push(unitePermanence);
                }
            }
        }
        let backtrackingPlanificateur: BacktrackPlanificateur =
            new BacktrackPlanificateur(tabsVariables, {
                variable: {},
                domain: { tfj: groupTfg, other: groupsPeople },
            });
        debugger;
        let resultVariables = backtrackingPlanificateur.start();
        console.log('resultat backtracking', resultVariables);
        debugger;
        for (let resultVariable of resultVariables) {
            let permanence = mapDatePermanence[stringDate(resultVariable.date)];
            if (!permanence.personnels_jour) {
                permanence.personnels_jour = [];
            }
            if (!permanence.personnels_nuit) {
                permanence.personnels_nuit = [];
            }
            if (!(resultVariable.type == "non_ouvrable" || (resultVariable.type == "ouvrable" && resultVariable.date.getDay() != 6 && resultVariable.date.getDay() != 1))) {
                if (resultVariable.isNight) {
                    if (!resultVariable.dataPersonnel) {
                        throw new Error('dataPersonnel not found');
                    }
                    if (resultVariable.ordre == 1) {
                        let personnelNuit: IPersonnelNuit = {
                            permanence: cloner(permanence),
                            personnel: resultVariable.dataPersonnel.personnel,
                            responsable: true,
                        };
                        permanence.personnels_nuit.push(personnelNuit);
                    } else {
                        let personnelNuit: IPersonnelNuit = {
                            permanence: cloner(permanence),
                            personnel: resultVariable.dataPersonnel.personnel,
                            responsable: false,
                        };
                        permanence.personnels_nuit.push(personnelNuit);
                    }
                } else {
                    if (!resultVariable.dataPersonnel) {
                        throw new Error('dataPersonnel not found');
                    }
                    if (resultVariable.ordre == 1) {
                        let personnelJour: IPersonnelJour = {
                            permanence: cloner(permanence),
                            personnel: resultVariable.dataPersonnel.personnel,
                            responsable: true,
                        };
                        permanence.personnels_jour.push(personnelJour);
                    } else {
                        let personnelJour: IPersonnelJour = {
                            permanence: cloner(permanence),
                            personnel: resultVariable.dataPersonnel.personnel,
                            responsable: false,
                        };
                        permanence.personnels_jour.push(personnelJour);
                    }
                }
            }

        }

        let jourFerier: {
            jour1: IPermanence | null;
            jour2: IPermanence | null;
        } = {
            jour1: null,
            jour2: null,
        };
        let sameditAvant: IPermanence | null = null;
        for (let permanence of this.permanences) {
            let date = new Date(permanence.date);
            if (
                date.getDay() != 6 &&
                date.getDay() != 0 &&
                permanence.type == 'ouvrable'
            ) {
                if (jourFerier.jour1 == null) {
                    jourFerier.jour1 = permanence;
                } else if (sameditAvant != null) {
                    permanence.personnels_jour = sameditAvant.personnels_jour;
                    permanence.personnels_nuit = sameditAvant.personnels_nuit;
                }
            }
            if (date.getDay() == 6) {
                if (jourFerier.jour1 != null) {
                    jourFerier.jour1.personnels_jour =
                        permanence.personnels_jour;
                    jourFerier.jour1.personnels_nuit =
                        permanence.personnels_nuit;
                    jourFerier.jour1 = null;
                }
                sameditAvant = permanence;
            }
        }
    }

    // fillPlanning() {
    //   let decalage = 0;
    //   this.nbrSemaineParcouru = 0;
    //   let group1 = shuffleArray([...this.group1]);
    //   let group2 = shuffleArray([...this.group2]);
    //   let group3 = shuffleArray([...this.group3]);
    //   let groupsPeople: GroupsPeople = { data: [], parcours: 0 };
    //   let groupTfg: GroupsPeople = { data: [], parcours: 0 };

    //   let nbrPersonDay: DataPlanning['repartition'] = {
    //     semaine: 4,
    //     samediJour: 4,
    //     samediNuit: 2,
    //     dimancheJour: 4,
    //     dimancheNuit: 2,
    //   };
    //   if (this.dataPlanning?.repartition) {
    //     nbrPersonDay = this.dataPlanning.repartition;
    //   }
    //   let iterGroup = 0;
    //   for (let group of this.api.data.groupes) {
    //     iterGroup++;
    //     let criteresGroup = group.criteres.map((critere) => critere.nom);
    //     let oneGroupPersonnel = shuffleArray([...group.personnels]);
    //     if (
    //       !criteresGroup.includes('SUPERVISEUR') &&
    //       !criteresGroup.includes('RESPONSABLE TFJ')
    //     ) {
    //       for (let personnel of oneGroupPersonnel) {
    //         let groupData = {
    //           personnel: personnel,
    //           criteres: criteresGroup,
    //           group: 'group' + iterGroup,
    //           date: null,
    //         };
    //         if (criteresGroup.includes('PEUT APPARAITRE ENSEMBLE')) {
    //           groupData.group = 'group' + iterGroup + ' ensemble';
    //         }

    //         groupsPeople.data.push(groupData);
    //       }
    //     } else if (criteresGroup.includes('RESPONSABLE TFJ')) {
    //       for (let personnel of oneGroupPersonnel) {
    //         groupTfg.data.push({
    //           personnel: personnel,
    //           criteres: criteresGroup,
    //           group: 'tfj',
    //           date: null,
    //         });
    //       }
    //     }
    //   }

    //   console.log(
    //     'voici les différents groupes creer',
    //     JSON.parse(JSON.stringify(groupsPeople)),
    //     groupTfg
    //   );

    //   let nbrGroup1 = group1.length;
    //   let nbrGroup2 = group2.length;
    //   let nbrGroup3 = group3.length;

    //   let oneOrTwoPerson = [1, 2];

    //   let jourFerier: { jour1: IPermanence | null; jour2: IPermanence | null } = {
    //     jour1: null,
    //     jour2: null,
    //   };
    //   let sameditAvant: IPermanence | null = null;

    //   let repartiGroup2 = 0;
    //   let repartiGroup3 = 0;
    //   let repartiOneOrTwo = 0;

    //   let idCountChief: { [key in number]: number } = { '-1': -1 };

    //   this.permanences.forEach((permanence, index) => {
    //     let date = new Date(permanence.date);
    //     let personnel_permanence: IPermanence = JSON.parse(
    //       JSON.stringify(permanence)
    //     );
    //     delete personnel_permanence.personnels_jour;
    //     delete personnel_permanence.personnels_nuit;
    //     if (date.getDay() != 0 && date.getDay() != 6) {
    //       if (permanence.type == 'simple') {
    //         // let person1 = group1[(index - decalage) % nbrGroup1];
    //         // let lastPosition = (index - decalage) % nbrGroup1;
    //         // person1 = this.findPerson(
    //         //   person1,
    //         //   group1,
    //         //   lastPosition,
    //         //   stringDate(date)
    //         // );

    //         let personDataTfjGroup: GroupsPeople['data'][number] =
    //           groupTfg.data[(index - groupTfg.parcours) % groupTfg.data.length];
    //         let lastPosition = (index - groupTfg.parcours) % groupTfg.data.length;

    //         let personDataTfj = this.findPerson(
    //           personDataTfjGroup,
    //           groupTfg.data,
    //           lastPosition,
    //           date,
    //           0,
    //           'nuit',
    //           lastPosition,
    //           []
    //         );
    //         let nbrPersonResponsable = 0;
    //         if (personDataTfj) {
    //           nbrPersonResponsable++;
    //         } else {
    //           personDataTfj = this.findPersonResponsability(
    //             groupsPeople,
    //             date,
    //             'nuit'
    //           );
    //           if (personDataTfj) {
    //             nbrPersonResponsable++;
    //           }
    //         }

    //         let personDataTfj2 = this.findPersonResponsability(
    //           groupsPeople,
    //           date,
    //           'nuit'
    //         );

    //         let datasPersonDay: GroupsPeople['data'][number][] = [];
    //         if (personDataTfj2) {
    //           datasPersonDay.push(personDataTfj2);
    //           nbrPersonResponsable++;
    //         }
    //         for (
    //           let c = 0;
    //           c < nbrPersonDay.semaine - nbrPersonResponsable;
    //           c++
    //         ) {
    //           let lastPosition = groupsPeople.parcours % groupsPeople.data.length;
    //           let dataPerson2: GroupsPeople['data'][number] | null =
    //             groupsPeople.data[
    //               groupsPeople.parcours++ % groupsPeople.data.length
    //             ];
    //           console.log(
    //             '----------------- personne selectionner => ',
    //             dataPerson2.personnel,
    //             '--- date => ',
    //             date,
    //             '---position =>',
    //             lastPosition,
    //             '---parcours =>',
    //             groupsPeople.parcours
    //           );
    //           dataPerson2 = this.uniquePersonDay(
    //             dataPerson2,
    //             datasPersonDay,
    //             groupsPeople.data,
    //             lastPosition,
    //             date,
    //             'nuit'
    //           );
    //           console.log(
    //             '_______________ après la recherche ------->',
    //             dataPerson2,
    //             'position =>',
    //             lastPosition,
    //             '---parcours =>',
    //             groupsPeople.parcours
    //           );
    //           if (dataPerson2) {
    //             datasPersonDay.push(dataPerson2);
    //           }
    //         }

    //         if (personDataTfj && personDataTfj.personnel.sexe == 'M') {
    //           let personNuitTfj: IPersonnelNuit = {
    //             permanence: personnel_permanence,
    //             personnel: personDataTfj.personnel,
    //             responsable: true,
    //           };
    //           permanence.personnels_nuit?.push(personNuitTfj);
    //         }
    //         for (let personData of datasPersonDay) {
    //           let otherPersonNuit: IPersonnelNuit = {
    //             permanence: personnel_permanence,
    //             personnel: personData.personnel,
    //             responsable: false,
    //           };
    //           personData.date = date;
    //           permanence.personnels_nuit?.push(otherPersonNuit);
    //         }

    //       } else if (permanence.type == 'ouvrable') {
    //         if (jourFerier.jour1 == null) {
    //           jourFerier.jour1 = permanence;
    //         } else if (jourFerier.jour1 != null && jourFerier.jour2 == null) {
    //           if (sameditAvant != null) {
    //             permanence.personnels_jour = sameditAvant.personnels_jour;
    //             permanence.personnels_nuit = sameditAvant.personnels_nuit;
    //           }
    //         }
    //         console.log('jour ouvrable semaine', date);
    //       }
    //     } else if (date.getDay() == 6) {
    //       if (permanence.type == 'ouvrable') {
    //         let nbrPersonResponsable = 0;
    //         let permanenceLundi = this.permanences[index - 5];
    //         if (
    //           permanence.personnels_jour != null &&
    //           permanenceLundi.personnels_nuit != null
    //         ) {
    //           let personNuit = permanenceLundi.personnels_nuit[0];
    //           let person0: GroupsPeople['data'][number] | null = null;
    //           if (personNuit) {
    //             permanence.personnels_jour[0] = personNuit;
    //             nbrPersonResponsable++;
    //           } else {
    //             console.log('problème rencontré le Lundi, anticipation ...');
    //             person0 =
    //               groupTfg.data[
    //                 (index - groupTfg.parcours) % groupTfg.data.length
    //               ];
    //             // let lastPosition = (index - decalage) % nbrGroup1;
    //             // person0 = this.findPerson(person0, group1, lastPosition,stringDate(date))
    //           }
    //           if (person0 != null) {
    //             let lastPosition =
    //               (index - groupTfg.parcours) % groupTfg.data.length;
    //             person0 = this.findPerson(
    //               person0,
    //               groupTfg.data,
    //               lastPosition,
    //               date,
    //               0,
    //               'jour',
    //               lastPosition,
    //               []
    //             );
    //             if (person0) {
    //               let person0Jour: IPersonnelJour = {
    //                 personnel: person0.personnel,
    //                 permanence: personnel_permanence,
    //                 responsable: true,
    //               };

    //               permanence.personnels_jour.push(person0Jour);
    //               nbrPersonResponsable++;
    //             } else {
    //               person0 = this.findPersonResponsability(
    //                 groupsPeople,
    //                 date,
    //                 'jour'
    //               );

    //               if (person0) {
    //                 let person0Jour: IPersonnelJour = {
    //                   personnel: person0.personnel,
    //                   permanence: personnel_permanence,
    //                   responsable: true,
    //                 };

    //                 permanence.personnels_jour.push(person0Jour);
    //                 nbrPersonResponsable++;
    //               }
    //             }
    //           }

    //           let personDataTfj2 = this.findPersonResponsability(
    //             groupsPeople,
    //             date,
    //             'jour'
    //           );
    //           let datasPersonDayJour: GroupsPeople['data'][number][] = [];
    //           if (personDataTfj2) {
    //             datasPersonDayJour.push(personDataTfj2);
    //             nbrPersonResponsable++;
    //           }

    //           for (
    //             let c = 0;
    //             c < nbrPersonDay.samediJour - nbrPersonResponsable;
    //             c++
    //           ) {
    //             let lastPosition =
    //               groupsPeople.parcours % groupsPeople.data.length;
    //             let dataPerson2: GroupsPeople['data'][number] | null =
    //               groupsPeople.data[
    //                 groupsPeople.parcours++ % groupsPeople.data.length
    //               ];
    //             dataPerson2 = this.uniquePersonDay(
    //               dataPerson2,
    //               datasPersonDayJour,
    //               groupsPeople.data,
    //               lastPosition,
    //               date,
    //               'jour'
    //             );
    //             if (dataPerson2) {
    //               datasPersonDayJour.push(dataPerson2);
    //             }
    //           }
    //           for (let personData of datasPersonDayJour) {
    //             let otherPersonJour: IPersonnelJour = {
    //               permanence: personnel_permanence,
    //               personnel: personData.personnel,
    //               responsable: false,
    //             };
    //             personData.date = date;
    //             permanence.personnels_jour?.push(otherPersonJour);
    //           }

    //           let oneOrTwo =
    //             oneOrTwoPerson[repartiOneOrTwo++ % oneOrTwoPerson.length];

    //           nbrPersonResponsable = 0;
    //           personDataTfj2 = this.findPersonResponsability(
    //             groupsPeople,
    //             date,
    //             'nuit'
    //           );

    //           let datasPersonDayNuit: GroupsPeople['data'][number][] = [];
    //           if (personDataTfj2) {
    //             datasPersonDayNuit.push(personDataTfj2);
    //             nbrPersonResponsable++;
    //           }

    //           for (
    //             let c = 0;
    //             c < nbrPersonDay.samediNuit - nbrPersonResponsable;
    //             c++
    //           ) {
    //             let lastPosition =
    //               groupsPeople.parcours % groupsPeople.data.length;
    //             let dataPerson2: GroupsPeople['data'][number] | null =
    //               groupsPeople.data[
    //                 groupsPeople.parcours++ % groupsPeople.data.length
    //               ];
    //             dataPerson2 = this.uniquePersonDay(
    //               dataPerson2,
    //               datasPersonDayNuit,
    //               groupsPeople.data,
    //               lastPosition,
    //               date,
    //               'nuit'
    //             );
    //             if (dataPerson2) {
    //               datasPersonDayNuit.push(dataPerson2);
    //             }
    //           }

    //           if (personDataTfj2 == null) {
    //             datasPersonDayNuit = this.trierPersonChief(
    //               datasPersonDayNuit,
    //               idCountChief
    //             );
    //           }

    //           datasPersonDayNuit.forEach((pers, i) => {
    //             if (pers) {
    //               let persNuit: IPersonnelNuit = {
    //                 personnel: pers.personnel,
    //                 responsable: i == 0,
    //                 permanence: personnel_permanence,
    //               };
    //               pers.date = date;
    //               permanence.personnels_nuit?.push(persNuit);
    //             }
    //           });

    //           if (jourFerier.jour1 != null) {
    //             jourFerier.jour1.personnels_jour = permanence.personnels_jour;
    //             jourFerier.jour1.personnels_nuit = permanence.personnels_nuit;
    //             jourFerier.jour1 = null;
    //           }

    //           sameditAvant = permanence;
    //         }
    //       }
    //     } else if (date.getDay() == 0) {
    //       groupTfg.parcours++;
    //       this.nbrSemaineParcouru++;

    //       if (permanence.type == 'simple' || permanence.type == 'ouvrable') {

    //         let nbrPersonResponsable = 0;
    //         let personDataTfj2 = this.findPersonResponsability(
    //           groupsPeople,
    //           date,
    //           'jour'
    //         );
    //         if (personDataTfj2) {
    //           nbrPersonResponsable++;
    //         }
    //         let datasPersonDayJour: GroupsPeople['data'][number][] = [];
    //         if (personDataTfj2) {
    //           datasPersonDayJour.push(personDataTfj2);
    //         }

    //         for (
    //           let c = 0;
    //           c < nbrPersonDay.dimancheJour - nbrPersonResponsable;
    //           c++
    //         ) {
    //           let lastPosition = groupsPeople.parcours % groupsPeople.data.length;
    //           let dataPerson2: GroupsPeople['data'][number] | null =
    //             groupsPeople.data[
    //               groupsPeople.parcours++ % groupsPeople.data.length
    //             ];
    //           dataPerson2 = this.uniquePersonDay(
    //             dataPerson2,
    //             datasPersonDayJour,
    //             groupsPeople.data,
    //             lastPosition,
    //             date,
    //             'jour'
    //           );
    //           if (dataPerson2) {
    //             datasPersonDayJour.push(dataPerson2);
    //           }
    //         }

    //         if (personDataTfj2 == null) {
    //           datasPersonDayJour = this.trierPersonChief(
    //             datasPersonDayJour,
    //             idCountChief
    //           );
    //         }

    //         datasPersonDayJour.forEach((pers, i) => {
    //           if (pers != null) {
    //             let persJour: IPersonnelJour = {
    //               personnel: pers.personnel,
    //               responsable: i == 0,
    //               permanence: personnel_permanence,
    //             };
    //             pers.date = date;
    //             permanence.personnels_jour?.push(persJour);
    //           }
    //         });

    //         nbrPersonResponsable = 0;
    //         personDataTfj2 = this.findPersonResponsability(
    //           groupsPeople,
    //           date,
    //           'nuit'
    //         );
    //         let datasPersonDayNuit: GroupsPeople['data'][number][] = [];
    //         if (personDataTfj2) {
    //           datasPersonDayNuit.push(personDataTfj2);
    //           nbrPersonResponsable++;
    //         }
    //         for (
    //           let c = 0;
    //           c < nbrPersonDay.dimancheNuit - nbrPersonResponsable;
    //           c++
    //         ) {
    //           let lastPosition = groupsPeople.parcours % groupsPeople.data.length;
    //           let dataPerson2: GroupsPeople['data'][number] | null =
    //             groupsPeople.data[
    //               groupsPeople.parcours++ % groupsPeople.data.length
    //             ];
    //           dataPerson2 = this.uniquePersonDay(
    //             dataPerson2,
    //             datasPersonDayNuit,
    //             groupsPeople.data,
    //             lastPosition,
    //             date,
    //             'nuit'
    //           );
    //           if (dataPerson2) {
    //             datasPersonDayNuit.push(dataPerson2);
    //           }
    //         }

    //         if (personDataTfj2 == null) {
    //           datasPersonDayNuit = this.trierPersonChief(
    //             datasPersonDayNuit,
    //             idCountChief
    //           );
    //         }

    //         datasPersonDayNuit.forEach((pers, i) => {
    //           if (pers != null) {
    //             let persNuit: IPersonnelNuit = {
    //               personnel: pers.personnel,
    //               responsable: i == 0,
    //               permanence: personnel_permanence,
    //             };
    //             pers.date = date;
    //             permanence.personnels_nuit?.push(persNuit);
    //           }
    //         });
    //       }
    //     }
    //   });
    // }

    decalage(
        indice1: number,
        indice2: number,
        tableau: GroupsPeople['data']
    ): GroupsPeople['data'] {
        let n = indice2 - indice1;
        if (n != 0) {
            let element = JSON.parse(JSON.stringify(tableau[indice2]));
            if (n < 0) {
                n += tableau.length;
            }
            for (let i = 0; i < n; i++) {
                let insertIndice = indice2 - i;
                let dataIndice = indice2 - i - 1;
                if (insertIndice < 0) {
                    insertIndice += tableau.length;
                }
                if (dataIndice < 0) {
                    dataIndice += tableau.length;
                }

                tableau[insertIndice] = tableau[dataIndice];
            }
            tableau[indice1] = element;
        }
        console.log('voici le tableau avec le decalage ', cloner(tableau));
        return tableau;
    }

    uniquePersonDay(
        person: GroupsPeople['data'][number],
        people: Array<GroupsPeople['data'][number] | null>,
        group: GroupsPeople['data'],
        lastPosition: number,
        date: Date,
        type: 'jour' | 'nuit'
    ): GroupsPeople['data'][number] | null {
        let isIdentique = false;
        let nbrIdentique = 0;
        let triPeople: GroupsPeople['data'] = <GroupsPeople['data']>(
            people.filter((p) => p != null)
        );
        let initialIndex = lastPosition;
        let personFind: GroupsPeople['data'][number] | null = null;
        do {
            personFind = this.findPerson(
                person,
                group,
                lastPosition,
                date,
                nbrIdentique,
                type,
                initialIndex,
                triPeople
            );
            let trouve = false;
            for (let onePerson of triPeople) {
                if (person.personnel.id == onePerson.personnel.id) {
                    isIdentique = true;
                    trouve = true;
                    break;
                }
            }

            if (!trouve) {
                isIdentique = false;
            }
            nbrIdentique++;
        } while (isIdentique && nbrIdentique <= group.length);

        if (isIdentique) {
            return null;
        } else {
            return personFind;
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next(true);
    }

    disabledNewPlanning() {
        let disabled = false;
        for (let planning of this.plannings) {
            if (!planning.id) {
                return true;
            }
        }
        return disabled;
    }

    ngAfterViewInit() {
        scrollToDiv('#mat-typography');
    }

    announceSortChange(sortState: Sort) {
        // This example uses English messages. If your application supports
        // multiple language, you would internationalize these strings.
        // Furthermore, you can customize the message to add additional
        // details about the values being sorted.
        if (sortState.direction) {
            this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
        } else {
            this._liveAnnouncer.announce('Sorting cleared');
        }
    }

    findPersonResponsability(
        group: GroupsPeople,
        date: Date,
        type: 'jour' | 'nuit'
    ): GroupsPeople['data'][number] | null {
        let personDataTfj2: GroupsPeople['data'][number] | null = null;

        let lastPosition = group.parcours % group.data.length;
        personDataTfj2 = group.data[group.parcours++ % group.data.length];
        personDataTfj2 = this.findPerson(
            personDataTfj2,
            group.data,
            lastPosition,
            date,
            0,
            type,
            lastPosition,
            [],
            ['PRIORITE 1']
        );

        if (personDataTfj2 == null) {
            let lastPosition = group.parcours % group.data.length;
            personDataTfj2 = group.data[group.parcours++ % group.data.length];
            personDataTfj2 = this.findPerson(
                personDataTfj2,
                group.data,
                lastPosition,
                date,
                0,
                type,
                lastPosition,
                [],
                ['PRIORITE 2']
            );
        }
        return personDataTfj2;
    }

    public handleClick(row: ApparitionPerson) {
        console.log('handle click row data ', row);

        this.row = row;
        this.openModal = true;

        // this.dialog.open(UserInfoModalComponent, {
        //   data: row
        // })
    }
}
