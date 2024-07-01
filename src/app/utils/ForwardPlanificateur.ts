import { GroupsPeople } from '../pages/page-plannification/page-plannification.component';
import { cloner } from '../shared/utils/function';
import { PermanenceCSP } from './PermanenceCSP';
import { UnitePermanence } from './UnitePermanence';

export class ForwardPlanificateur {
    public tailleVariable!: number;
    public tabNonAffectation: number[] = [];

    constructor(
        public variablePermanence: UnitePermanence[],
        public affectation: {
            variable: { [key in string]: UnitePermanence };
            domain: { tfj: GroupsPeople; other: GroupsPeople };
        }
    ) {
        this.tailleVariable = variablePermanence.length;
    }
    backtracking(
        affectation: typeof this.affectation,
        variable: UnitePermanence | null
    ): boolean {
        //Si affectation non consistante retourner faux;
        if (!this.isConsistante(affectation, variable)) {
            return false;
        } else {
            //On affecte la variable
            if (variable != null) {
                this.affectation.variable[variable.id + ''] = variable;
            }
        }
        if (this.tabNonAffectation.length > 0) {
            let initialIndex: number = this.tabNonAffectation[0];
            let lastIndex: number =
                this.tabNonAffectation[this.tabNonAffectation.length - 1];
            this.decalage(
                initialIndex,
                lastIndex,
                affectation.domain.other.data
            );
            this.tabNonAffectation = [];
        }
        let tailleActuelVariable = Object.keys(affectation.variable).length;
        if (tailleActuelVariable == this.tailleVariable) {
            // Affectation totale est consistante
            return true;
        } else {
            //Choisir une variable qui n'est pas encore affectée
            variable = null;
            let estAffecte = true;
            let i = 0;
            while (estAffecte && i < this.tailleVariable) {
                variable = this.variablePermanence[i];
                if (!affectation.variable[variable.id]) {
                    estAffecte = false;
                } else {
                    i++;
                }
            }
            if (variable == null) {
                throw Error("Impossible d'affecter une autre variable");
            }

            //pour toute valeur V appartenant a D(Xi)

            while (
                this.tabNonAffectation.length <=
                affectation.domain.other.data.length
            ) {
                if (
                    variable.ordre == 1 &&
                    variable.date.getDay() != 0 &&
                    variable.date.getDay() != 6
                ) {
                    let groupTfj = affectation.domain.tfj;
                    let index = groupTfj.parcours;
                    let dataPersonnel =
                        groupTfj.data[
                            groupTfj.parcours++ % groupTfj.data.length
                        ];
                    this.tabNonAffectation.push(index);
                    variable.dataPersonnel = dataPersonnel;
                    if (this.backtracking(affectation, variable)) {
                        return true;
                    }
                } else {
                    let groupOther = affectation.domain.other;
                    let index = groupOther.parcours;
                    let dataPersonnel =
                        groupOther.data[
                            groupOther.parcours++ % groupOther.data.length
                        ];
                    this.tabNonAffectation.push(index);
                    variable.dataPersonnel = dataPersonnel;
                    if (this.backtracking(affectation, variable)) {
                        return true;
                    }
                }
            }
            return false;
        }
    }

    isConsistante(
        affectation: typeof this.affectation,
        variable: UnitePermanence | null
    ): boolean {
        let tailleActuelVariable = Object.keys(affectation.variable).length;
        //si au tout debut du parcours return true
        if (!tailleActuelVariable || variable == null) {
            return true;
        }
        //femme ne pas apparaitre la nuit
        if (variable.isNight && variable.dataPersonnel.personnel.sexe == 'F') {
            return false;
        }

        //personnes du même groupe ne doivent pas être ensemble sauf contraintes accepté
        let buffer = this.variableSameDate(affectation, variable.date);
        let tabGroup = this.groupsSameDate(buffer);
        for (let group of variable.dataPersonnel.group) {
            if (tabGroup.includes(group) && group.indexOf('ensemble') == -1) {
                return false;
            }
        }

        //Controle journée du samedi
        if (variable.date.getDay() == 6) {
            //Controle nuit et jour du samedi
            if (
                !(
                    variable.dataPersonnel.criteres.includes(
                        'REPARTI NORMALEMENT'
                    ) ||
                    variable.dataPersonnel.criteres.includes(
                        'APPARAIT SAMEDI'
                    ) ||
                    // variable.dataPersonnel.criteres.includes('SAMEDI JOUR') ||
                    // variable.dataPersonnel.criteres.includes('SAMEDI NUIT') ||
                    variable.dataPersonnel.criteres.includes(
                        'APPARAIT WEEKEND'
                    ) ||
                    variable.dataPersonnel.criteres.includes('RESPONSABLE TFJ')
                )
            ) {
                //Controle jour et nuit du samedi
                if (
                    (!variable.isNight &&
                        !variable.dataPersonnel.criteres.includes(
                            'SAMEDI JOUR'
                        )) ||
                    (variable.isNight &&
                        !variable.dataPersonnel.criteres.includes(
                            'SAMEDI NUIT'
                        ))
                ) {
                    return false;
                }
            }
        }

        //Controle journée du dimanche
        if (variable.date.getDay() == 0) {
            //Controle nuit et jour du samedi
            if (
                !(
                    variable.dataPersonnel.criteres.includes(
                        'REPARTI NORMALEMENT'
                    ) ||
                    variable.dataPersonnel.criteres.includes(
                        'APPARAIT DIMANCHE'
                    ) ||
                    // variable.dataPersonnel.criteres.includes('SAMEDI JOUR') ||
                    // variable.dataPersonnel.criteres.includes('SAMEDI NUIT') ||
                    variable.dataPersonnel.criteres.includes(
                        'APPARAIT WEEKEND'
                    ) ||
                    variable.dataPersonnel.criteres.includes('RESPONSABLE TFJ')
                )
            ) {
                //Controle jour et nuit du samedi
                if (
                    (!variable.isNight &&
                        !(
                            variable.dataPersonnel.criteres.includes(
                                'DIMANCHE JOUR'
                            ) ||
                            variable.dataPersonnel.criteres.includes(
                                'PRESENT JUSTE LE JOUR'
                            )
                        )) ||
                    (variable.isNight &&
                        !(
                            variable.dataPersonnel.criteres.includes(
                                'DIMANCHE NUIT'
                            ) ||
                            variable.dataPersonnel.criteres.includes(
                                'PRESENT JUSTE LA NUIT'
                            )
                        ))
                ) {
                    return false;
                }
            }
        }

        //Controle de Lundi - Vendredi
        if (variable.date.getDay() != 0 && variable.date.getDay() != 6) {
            if (
                !(
                    variable.dataPersonnel.criteres.includes(
                        'REPARTI NORMALEMENT'
                    ) ||
                    variable.dataPersonnel.criteres.includes('RESPONSABLE TFJ')
                )
            ) {
                if (
                    (!variable.isNight &&
                        !variable.dataPersonnel.criteres.includes(
                            'PRESENT JUSTE LE JOUR'
                        )) ||
                    (variable.isNight &&
                        !variable.dataPersonnel.criteres.includes(
                            'PRESENT JUSTE LA NUIT'
                        ))
                ) {
                    return false;
                }
            }
        }
        
        return true;
    }

    variableSameDate(affectation: typeof this.affectation, date: Date) {
        let variable = [];
        for (let key in affectation.variable) {
            let variableCurrent = affectation.variable[key];
            if (
                variableCurrent.date.getDate() == date.getDate() &&
                variableCurrent.date.getMonth() == date.getMonth() &&
                variableCurrent.date.getFullYear() == date.getFullYear()
            ) {
                variable.push(variableCurrent);
            }
        }
        return variable;
    }

    personnelSameGroupeDate(
        affectation: typeof this.affectation,
        variable: UnitePermanence
    ): boolean {
        let buffer = this.variableSameDate(affectation, variable.date);
        let tabGroup = this.groupsSameDate(buffer);
        for (let group of variable.dataPersonnel.group) {
            if (tabGroup.includes(group) && group.indexOf('ensemble') == -1) {
                return false;
            }
        }
        return true;
    }

    groupsSameDate(variables: UnitePermanence[]) {
        let tabGroup: string[] = [];
        for (let variable of variables) {
            let group = variable.dataPersonnel.group;
            tabGroup = [...tabGroup, ...group];
        }
        return tabGroup;
    }

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
}
