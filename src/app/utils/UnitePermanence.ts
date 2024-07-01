import { GroupsPeople } from '../pages/page-plannification/page-plannification.component';

export class UnitePermanence {
    constructor(
        public id:string,
        public date: Date,
        public type: 'ouvrable' | 'non_ouvrable' | 'simple',
        public isNight: boolean,
        public ordre: number,
        public dataPersonnel: GroupsPeople['data'][number]
    ) {}
}
