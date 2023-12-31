import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { Ferier } from '../modal-planification/modal-planification.component';
import { formatJSON, isEqualDate, stringDate } from '../../utils/function';
import { IPermanence } from '../../interfaces/ipermanence';
import { TypePersonnel } from '../../utils/types-map';
import { IApiPersonnel } from '../../interfaces/iapipersonnel';
import { IPersonnel } from '../../interfaces/ipersonnel';
import { mapPersonnel } from '../../utils/tables-map';
import { AuthService } from '../../services/auth.service';
import { RoleType } from '../../interfaces/irole';

@Component({
  selector: 'app-day',
  templateUrl: './day.component.html',
  styleUrls: ['./day.component.scss'],
})
export class DayComponent implements OnInit, OnChanges {
  public ordinaire: boolean = true;

  public visibleModalPermanence: boolean = false;

  private _typeFerier: IPermanence['type'] = 'simple';

  // @Input() permanences!:IPermanence[] ;
  public date!: Date;

  @Input()
  public autorisation: 'WRITE' | 'READ' = 'WRITE';
  // @Input() feriers: Ferier[] = [];
  @Input() permanence!: IPermanence;

  @Input()
  public personnel!: IApiPersonnel;

  public openModal: boolean = false;

  public row!: TypePersonnel;

  set typeFerier(value: IPermanence['type']) {
    this._typeFerier = value;
    this.ordinaire =
      this.date.getDay() != 0 && this.date.getDay() != 6 && value == 'simple';
  }

  get typeFerier() {
    return this._typeFerier;
  }

  public authRoles: RoleType[] = [];

  public userAuth!: IApiPersonnel;

  constructor(private auth: AuthService) {}

  ngOnInit(): void {
    this.authRoles = this.auth.rolesName;
    this.userAuth = this.auth.user as IApiPersonnel;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['permanence']) {
      let thisPermanence: IPermanence = changes['permanence'].currentValue;
      console.log("La permanence du ", thisPermanence.date, "est ->", thisPermanence.type)
      this.date = new Date(thisPermanence.date);
      this.typeFerier = thisPermanence.type;
      thisPermanence.personnels_jour?.sort((jour1, jour2) => {
        if (jour1.responsable && !jour2.responsable) return -1;
        if (!jour1.responsable && jour2.responsable) return 1;
        return 0;
      });
      thisPermanence.personnels_nuit?.sort((jour1, jour2) => {
        if (jour1.responsable && !jour2.responsable) return -1;
        if (!jour1.responsable && jour2.responsable) return 1;
        return 0;
      });
      this.ordinaire =
        this.date.getDay() != 0 &&
        this.date.getDay() != 6 &&
        this.typeFerier == 'simple';
    }
    // if (changes['date']) {
    //   let newDate = changes['date'].currentValue;

    // if (this.feriers.length) {
    //   for (let ferier of this.feriers) {
    //     let thisDate = new Date(ferier.jour);
    //     if (
    //       this.date &&
    //       isEqualDate(this.date, thisDate) &&
    //       (ferier.type == 'ouvrable' || ferier.type == 'non_ouvrable')
    //     ) {
    //       this.typeFerier = ferier.type;
    //       this.ordinaire = false;
    //       break;
    //     } else {
    //       this.ordinaire = true;
    //     }
    //   }
    // }
    // if(this.typeFerier){

    //   this.ordinaire =
    //   newDate.getDay() != 0 &&
    //   newDate.getDay() != 6 &&
    //   this.typeFerier == 'simple';
    // }
    // if(this.permanence){
    //   this.permanence.date = stringDate(newDate);
    //   this.permanence.type = this.typeFerier
    // }
    // }

    // if (changes['typeFerier']) {
    //   let currentTypeFerier: IPermanence["type"] = changes['typeFerier'].currentValue;

    //     if (

    //       (currentTypeFerier == 'ouvrable' || currentTypeFerier== 'non_ouvrable')
    //     ) {
    //       this.ordinaire = false;
    //     } else {
    //       this.ordinaire = true;
    //     }
    //   if(this.date){
    //     this.ordinaire =
    //     this.date.getDay() != 0 &&
    //     this.date.getDay() != 6 &&
    //     this.typeFerier == 'simple';
    //   }

    // if (changes['feriers']) {
    //   let currentFerier: Ferier[] = changes['feriers'].currentValue;
    //   for (let ferier of currentFerier) {
    //     let thisDate = new Date(ferier.jour);
    //     if (
    //       this.date &&
    //       isEqualDate(this.date, thisDate) &&
    //       (ferier.type == 'ouvrable' || ferier.type == 'non_ouvrable')
    //     ) {
    //       this.typeFerier = ferier.type;
    //       this.ordinaire = false;
    //       break;
    //     } else {
    //       this.ordinaire = true;
    //     }
    //   }
    //   if(this.date){
    //     this.ordinaire =
    //     this.date.getDay() != 0 &&
    //     this.date.getDay() != 6 &&
    //     this.typeFerier == 'simple';

    //     if(this.permanence){
    //       this.permanence.date = stringDate(this.date);
    //       this.permanence.type = this.typeFerier
    //     }
    //   }

    // }
    // if(changes["permanences"]){
    //   let perm = changes["permanences"].currentValue
    //   this.permanences = perm;
    //   this.permanence = {date:stringDate(this.date)||"", type:"simple", personnels_jour:[], personnels_nuit:[]}
    //   this.permanences.push(this.permanence)
    // }
  }

  handleClick(person: IApiPersonnel) {
    if (
      this.authRoles.includes('VOIR PAGE ADMINISTRATEUR') &&
      this.autorisation == 'WRITE'
    ) {
      this.row = person;
      // this.row = formatJSON<IApiPersonnel, IPersonnel>({
      //   obj: person,
      //   correspondance: mapPersonnel,
      // });
      this.openModal = true;
    }
  }

  refresh(val: boolean) {
    if (val) {
      this.typeFerier = this.permanence.type;
    }
  }

  colorDay(person: IApiPersonnel) {
    let absents = person.absentList;
    if (absents) {
      for (let absent of absents) {
        if (absent.end) {
          if (
            absent.start <= this.permanence.date &&
            this.permanence.date <= absent.end &&
            absent.validate
          ) {
            return 'rouge';
          } else if (
            absent.start <= this.permanence.date &&
            this.permanence.date <= absent.end &&
            absent.validate == null
          ) {
            return 'vert';
          }
        } else {
          if (absent.start == this.permanence.date && absent.validate)
            return 'rouge';
          else if (
            absent.start == this.permanence.date &&
            absent.validate == null
          )
            return 'vert';
        }
      }
    }
    return false;
  }
}
