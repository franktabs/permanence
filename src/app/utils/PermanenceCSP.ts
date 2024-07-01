import { GroupsPeople } from "../pages/page-plannification/page-plannification.component";
import { IApiPersonnel } from "../shared/interfaces/iapipersonnel";
import { UnitePermanence } from "./UnitePermanence";

export class PermanenceCSP{

    constructor(public variables: UnitePermanence[], public domaine: {tfj:GroupsPeople, other:GroupsPeople}  ){}
}