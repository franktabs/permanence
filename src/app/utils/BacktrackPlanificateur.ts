import { GroupsPeople } from '../pages/page-plannification/page-plannification.component';
import { cloner, stringDate } from '../shared/utils/function';
import { PermanenceCSP } from './PermanenceCSP';
import { UnitePermanence } from './UnitePermanence';

export class BacktrackPlanificateur {
    public tailleVariables!: number;
    public tabNonAffectation: number[] = [];
    public nbreChief: { [key in string]: number } = {};

    constructor(
        public variablePermanence: UnitePermanence[],
        public affectation: {
            variable: { [key in string]: UnitePermanence };
            domain: { tfj: GroupsPeople; other: GroupsPeople };
        }
    ) {
        //taile de l'ensemble des variables
        this.tailleVariables = variablePermanence.length;
    }

    /**
     * Lancer l'algorithme backtracking
     * @returns
     */
    start() {
        this.backtracking(this.affectation, null);
        return Object.keys(this.affectation.variable).map((key) => {
            let variable = this.affectation.variable[key];
            return variable;
        });
    }

    /**
     * Execute l'algorithme backtracking pour les CSP
     * @param affectation
     * @param variable
     * @returns
     */
    backtracking(
        affectation: typeof this.affectation,
        variable: UnitePermanence | null
    ): boolean {
        //Si affectation non consistante retourner faux;
        debugger;
        if (!this.isConsistante(affectation, variable)) {
            return false;
        }
        if (variable != null) {
            this.configureNextIndex(affectation, variable);
            this.affecterVariable(affectation, variable);
        }
        debugger;
        this.tabNonAffectation = [];
        let tailleVariableAffectee = Object.keys(affectation.variable).length;

        //Si l'affectation est total et consistante
        if (tailleVariableAffectee == this.tailleVariables) {
            // Affectation totale est consistante
            return true;
        } else {
            //Choisir une variable qui n'est pas encore affectée
            variable = this.takeAnotherVariable(affectation);

            //pourt toutes les valeurs du domaine de la variable
            while (
                this.tabNonAffectation.length <=
                affectation.domain.other.data.length
            ) {
                if (
                    this.backtracking(
                        affectation,
                        this.takeValeur(affectation, variable)
                    )
                ) {
                    return true;
                }
            }
            return false;
        }
    }

    isConsistante(
        affectation: typeof this.affectation,
        variable: UnitePermanence | null
    ): boolean {
        //Au tout de debut sans affectation
        if (variable == null) {
            return true;
        }

        //verification de la disponibilité
        if (!this.estDisponible(variable)) {
            return false;
        }

        //femme non présente la nuit
        if (variable.isNight && variable.dataPersonnel?.personnel.sexe == 'F') {
            return false;
        }

        //personne du même groupe non présent ensemble sauf contrainte qui l'autorise
        if (this.hasSameGroup(affectation, variable)) {
            return false;
        }

        //Controle contrainte weekend
        if (!this.isValidWeekendCriteria(variable)) {
            return false;
        }

        //Controle contrainte Lundi-Vendredi
        if (!this.isValidDayCriteria(variable)) {
            return false;
        }

        return true;
    }

    private takeAnotherVariable(
        affectation: typeof this.affectation
    ): UnitePermanence {
        let variable = null;
        let estAffecte = true;
        let i = 0;
        while (estAffecte && i < this.tailleVariables) {
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
        return variable;
    }

    private takeValeur(
        affectation: typeof this.affectation,
        variable: UnitePermanence
    ): UnitePermanence {
        if (
            (variable.ordre == 1 &&
                variable.date.getDay() != 0 &&
                variable.date.getDay() != 6) ||
            (variable.ordre == 1 &&
                variable.date.getDay() == 6 &&
                !variable.isNight)
        ) {
            let groupTfj = affectation.domain.tfj;
            let index = groupTfj.parcours;
            let dataPersonnel =
                groupTfj.data[groupTfj.parcours++ % groupTfj.data.length];
            this.tabNonAffectation.push(index % groupTfj.data.length);
            variable.dataPersonnel = dataPersonnel;
        } else {
            let groupOther = affectation.domain.other;
            let index = groupOther.parcours;
            let dataPersonnel =
                groupOther.data[groupOther.parcours++ % groupOther.data.length];
            this.tabNonAffectation.push(index % groupOther.data.length);
            variable.dataPersonnel = dataPersonnel;
        }

        return variable;
    }

    private affecterVariable(
        affectation: typeof this.affectation,
        variable: UnitePermanence
    ) {
        //Controle responsable
        variable = this.controleResponsable(affectation, variable);
        //Controle des priorités
        variable = this.controlePriorite(affectation, variable);

        affectation.variable[variable.id + ''] = variable;

        this.incrementNbreChef(variable);
    }

    private incrementNbreChef(variable: UnitePermanence) {
        if (!variable.dataPersonnel) {
            throw Error('dataPersonnel non présent !! Erreur backtracking');
        }
        if (variable.ordre != 1) return;
        let id = variable.dataPersonnel.personnel.id;
        if (!id) {
            throw Error('Utilisateur sans id');
        }
        if (this.nbreChief['' + id] >= 0) {
            this.nbreChief['' + id] += 1;
        } else {
            this.nbreChief['' + id] = 1;
        }
    }

    private decrementNbreChef(variable: UnitePermanence) {
        if (!variable.dataPersonnel) {
            throw Error('dataPersonnel non présent !! Erreur backtracking');
        }
        if (variable.ordre != 1) return;
        let id = variable.dataPersonnel.personnel.id;
        if (!id) {
            throw Error('Utilisateur sans id');
        }
        if (this.nbreChief['' + id] >= 1) {
            this.nbreChief['' + id] -= 1;
        }
    }

    private configureNextIndex(
        affectation: typeof this.affectation,
        variable: UnitePermanence
    ) {
        if (
            this.tabNonAffectation.length > 1 &&
            !variable.dataPersonnel?.criteres.includes('RESPONSABLE TFJ')
        ) {
            let initialIndex: number = this.tabNonAffectation[0];
            let lastIndex: number =
                this.tabNonAffectation[this.tabNonAffectation.length - 1];
            console.log(
                'avant le decalage',
                cloner(affectation.domain.other.data)
            );
            this.decalage(
                initialIndex,
                lastIndex,
                affectation.domain.other.data
            );
            console.log(
                'après le decalage',
                cloner(affectation.domain.other.data)
            );
            let groupOther = affectation.domain.other;
            groupOther.parcours = initialIndex + 1;
        }
    }

    private controlePriorite(
        affectation: typeof this.affectation,
        variable: UnitePermanence
    ): UnitePermanence {
        if (!variable.dataPersonnel) {
            return variable;
        }

        const listVariableSamePeriode = this.variableSamePeriode(
            affectation,
            variable
        );

        if (
            variable.dataPersonnel.criteres.includes('PRIORITE 1') ||
            variable.dataPersonnel.criteres.includes('PRIORITE 2')
        ) {
            listVariableSamePeriode.sort((a, b) => a.ordre - b.ordre);
            let listVariableToChange = [];
            for (let oneVariable of listVariableSamePeriode) {
                if (
                    oneVariable.dataPersonnel &&
                    !oneVariable.dataPersonnel.criteres.includes(
                        'RESPONSABLE TFJ'
                    ) &&
                    !oneVariable.dataPersonnel.criteres.includes(
                        'PRIORITE 1'
                    )
                ) {
                    if (
                        variable.dataPersonnel.criteres.includes(
                            'PRIORITE 1'
                        )
                    ) {
                        listVariableToChange.push(oneVariable);
                        continue;
                    }
                    if (
                        !oneVariable.dataPersonnel.criteres.includes(
                            'PRIORITE 2'
                        ) &&
                        variable.dataPersonnel.criteres.includes(
                            'PRIORITE 2'
                        )
                    ) {
                        listVariableToChange.push(oneVariable);
                        continue;
                    }
                }
            }
            let dataPersonnelTemporaire = variable.dataPersonnel;
            for (let oneVariable of listVariableToChange) {
                if (!oneVariable.dataPersonnel) {
                    throw Error(
                        'Erreur Configuration Responsabilité!! DataPersonnel null'
                    );
                }
                let dataPersonnel = oneVariable.dataPersonnel;
                this.decrementNbreChef(oneVariable);
                oneVariable.dataPersonnel = dataPersonnelTemporaire;
                dataPersonnelTemporaire = dataPersonnel;
                this.incrementNbreChef(oneVariable);
            }
            variable.dataPersonnel = dataPersonnelTemporaire;
        }
        return variable;
    }

    private controleResponsable(
        affectation: typeof this.affectation,
        variable: UnitePermanence
    ) {
        if (!variable.dataPersonnel) {
            return variable;
        }

        const listVariableSamePeriode = this.variableSamePeriode(
            affectation,
            variable
        );
        listVariableSamePeriode.sort((a, b) => a.ordre - b.ordre);
        let variableToChange :UnitePermanence | null = null;

        for (let oneVariable of listVariableSamePeriode) {
            if (oneVariable.ordre == 1 && oneVariable.dataPersonnel) {
                if (
                    !oneVariable.dataPersonnel.criteres.includes(
                        'RESPONSABLE TFJ'
                    )
                ) {
                    if (
                        variable.dataPersonnel.criteres.includes(
                            'PRIORITE 1'
                        ) ||
                        (!oneVariable.dataPersonnel.criteres.includes(
                            'PRIORITE 1'
                        ) &&
                            variable.dataPersonnel.criteres.includes(
                                'PRIORITE 2'
                            )
                        ) ||
                        (!oneVariable.dataPersonnel.criteres.includes(
                            'PRIORITE 1'
                        ) &&
                            !oneVariable.dataPersonnel.criteres.includes(
                                'PRIORITE 2'
                            )
                        )
                    ) {
                        let n: number =
                            this.nbreChief[
                                '' + oneVariable.dataPersonnel.personnel.id
                            ] ?? 0; // variable déjà affectée
                        let m: number =
                            this.nbreChief[
                                '' + variable.dataPersonnel.personnel.id
                            ] ?? 0; //variable non affectée
                        if (n > m) {
                            variableToChange = oneVariable;
                        }
                        continue;
                    }
                }
            }
        }
        if(variableToChange){
            let dataPersonnelTemporaire = variableToChange.dataPersonnel;
            this.decrementNbreChef(variableToChange);
            variableToChange.dataPersonnel=variable.dataPersonnel;
            variable.dataPersonnel=dataPersonnelTemporaire;
            this.incrementNbreChef(variableToChange);
        }
        return variable;
    }

    private hasSameGroup(
        affectation: typeof this.affectation,
        variable: UnitePermanence
    ): boolean {
        const listVariableSamePeriode = this.variableSamePeriode(
            affectation,
            variable
        );
        const listGroupSamePeriode = this.groupsOfListVariable(
            listVariableSamePeriode
        );
        if (!variable.dataPersonnel) {
            throw Error('dataPersonnel non présent !! Erreur backtracking');
        }

        for (let group of variable.dataPersonnel.group) {
            if (
                listGroupSamePeriode.includes(group) &&
                group.indexOf('ensemble') == -1
            ) {
                return true;
            }
        }
        return false;
    }

    private estDisponible(variable: UnitePermanence) {
        if (!variable.dataPersonnel) {
            throw Error('dataPersonnel non présent !! Erreur backtracking');
        }
        //Verification des vacances
        let vacances = variable.dataPersonnel.personnel.vacancies;
        if (vacances?.length) {
            for (let vacance of vacances) {
                if (
                    vacance.start <= stringDate(variable.date) &&
                    stringDate(variable.date) <= vacance.end && vacance.validate==null && vacance.validate==true
                ) {
                    return false;
                }
            }
        }
        return true;
    }

    private isValidWeekendCriteria(variable: UnitePermanence): boolean {
        if (!variable.dataPersonnel) {
            throw Error('dataPersonnel non présent !! Erreur backtracking');
        }
        const day = variable.date.getDay();
        const personnel = variable.dataPersonnel;
        if (day === 6 && personnel.criteres.includes('RESPONSABLE TFJ')) {
            return true;
        }

        if (day === 6 || day === 0) {
            return (
                personnel.criteres.includes('REPARTI NORMALEMENT') ||
                personnel.criteres.includes('APPARAIT WEEKEND') ||
                personnel.criteres.includes(
                    `SAMEDI ${variable.isNight ? 'NUIT' : 'JOUR'}`
                ) ||
                personnel.criteres.includes(
                    `DIMANCHE ${variable.isNight ? 'NUIT' : 'JOUR'}`
                ) ||
                personnel.criteres.includes(
                    `PRESENT JUSTE ${variable.isNight ? 'LA NUIT' : 'LE JOUR'}`
                )
            );
        }

        return true;
    }

    private isValidDayCriteria(variable: UnitePermanence): boolean {
        if (!variable.dataPersonnel) {
            throw Error('dataPersonnel non présent !! Erreur backtracking');
        }
        const day = variable.date.getDay();
        const personnel = variable.dataPersonnel;

        if (day !== 0 && day !== 6) {
            return (
                personnel.criteres.includes('REPARTI NORMALEMENT') ||
                personnel.criteres.includes('RESPONSABLE TFJ') ||
                personnel.criteres.includes(
                    `PRESENT JUSTE ${variable.isNight ? 'LA NUIT' : 'LE JOUR'}`
                )
            );
        }

        return true;
    }

    private variableSamePeriode(
        affectation: typeof this.affectation,
        variable: UnitePermanence
    ) {
        let listVariable = [];
        let date = variable.date;
        for (let key in affectation.variable) {
            let variableCurrent = affectation.variable[key];
            if (
                variableCurrent.isNight == variable.isNight &&
                variableCurrent.date.getDate() == date.getDate() &&
                variableCurrent.date.getMonth() == date.getMonth() &&
                variableCurrent.date.getFullYear() == date.getFullYear()
            ) {
                listVariable.push(variableCurrent);
            }
        }
        return listVariable;
    }

    private groupsOfListVariable(variables: UnitePermanence[]) {
        let tabGroup: string[] = [];
        for (let variable of variables) {
            if (!variable.dataPersonnel) {
                throw Error('dataPersonnel non présent !! Erreur backtracking');
            }
            let group = variable.dataPersonnel.group;
            tabGroup = [...tabGroup, ...group];
        }
        return tabGroup;
    }

    private decalage(
        indice1: number,
        indice2: number,
        tableau: GroupsPeople['data']
    ): GroupsPeople['data'] {
        let n = indice2 - indice1;
        if (n != 0) {
            let element = cloner(tableau[indice2]);
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
