export interface IPersonnel {
    matricule:string;
    nom:string;
    prenom?:string;
    date_naissance:Date,
    sexe:"M"|"F";
    holiday?:Date,
    willPassed?:boolean;
}


