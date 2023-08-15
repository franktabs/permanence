import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { IPermanence } from '../../interfaces/ipermanence';
import { TypePersonnel } from '../../utils/types-map';
import { ApiService } from '../../services/api.service';
import { IApiPersonnel } from '../../interfaces/iapipersonnel';
import { formatJSON, mapJSON } from '../../utils/function';
import { IPersonnel } from '../../interfaces/ipersonnel';
import { mapPersonnel } from '../../utils/tables-map';
import { IPersonnelJour } from '../../interfaces/ipersonneljour';
import { IPersonnelNuit } from '../../interfaces/ipersonnelNuit';

@Component({
  selector: 'app-modal-permanence',
  templateUrl: './modal-permanence.component.html',
  styleUrls: ['./modal-permanence.component.scss'],
})
export class ModalPermanenceComponent implements OnInit, OnChanges {
  @Output() openChange: EventEmitter<boolean> = new EventEmitter();

  public typeFerier: IPermanence['type'] = 'simple';
  public date!: Date;
  public ordinaire = true;

  public options!: TypePersonnel[];

  @Input() permanence!: IPermanence;

  public formFerier: IPermanence['type'] = this.typeFerier;
  public formPersonnelJour: Array<TypePersonnel | string> = [];
  public formPersonnelNuit: Array<TypePersonnel | string> = [];

  public personnelJourDatas: Array<TypePersonnel | string> = [];
  public personnelNuitDatas: Array<TypePersonnel | string> = [];

  public numArrayJour: number[] = [];
  public numArrayNuit: number[] = [];

  @Input()
  set open(bool: boolean) {
    if (bool == false) {
      this.openChange.emit(false);
    }
  }

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api
      .getAllData<IApiPersonnel[]>({ for: 'personnels' })
      .subscribe((subs) => {
        let transSubs = subs
        // let transSubs = mapJSON<IApiPersonnel, IPersonnel>(subs, mapPersonnel);
        this.options = transSubs;
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['permanence']) {
      let thisPermanence: IPermanence = changes['permanence'].currentValue;
      this.date = new Date(thisPermanence.date);
      this.typeFerier = thisPermanence.type;
      this.formFerier = this.typeFerier;

      // this.formPersonnelJour = JSON.parse(JSON.stringify(thisPermanence.personnels_jour))
      // this.formPersonnelNuit = JSON.parse(JSON.stringify(thisPermanence.personnels_nuit))

      console.log('type de ferrier', this.formFerier);

      if (thisPermanence.personnels_jour) {
        let i = 0;
        for (let person of thisPermanence.personnels_jour) {
          let personIApiPersonnel = person.personnel;
          let personTypePersonnel = personIApiPersonnel
          // let personTypePersonnel = formatJSON<IApiPersonnel, IPersonnel>({
          //   obj: personIApiPersonnel,
          //   correspondance: mapPersonnel,
          // });
          this.formPersonnelJour.push(personTypePersonnel);
          this.personnelJourDatas.push(personTypePersonnel as TypePersonnel);
        }
      }
      if (thisPermanence.personnels_nuit)
        for (let person of thisPermanence.personnels_nuit) {
          let personIApiPersonnel = person.personnel;
          let personTypePersonnel = personIApiPersonnel
          // let personTypePersonnel = formatJSON<IApiPersonnel, IPersonnel>({
          //   obj: personIApiPersonnel,
          //   correspondance: mapPersonnel,
          // });
          this.formPersonnelNuit.push(personTypePersonnel);
          this.personnelNuitDatas.push(personTypePersonnel);
        }
      this.numArrayJour = Array.from(
        { length: this.personnelJourDatas.length },
        (_, ind) => ind
      );
      this.numArrayNuit = Array.from(
        { length: this.personnelNuitDatas.length },
        (_, ind) => ind
      );

      this.ordinaire =
        this.date.getDay() != 0 &&
        this.date.getDay() != 6 &&
        this.typeFerier == 'simple';
    }
  }

  dataNuitPersonnel(ind: number, event: any) {
    this.personnelNuitDatas[ind] = event;
    console.log('affichages des données nuit', this.personnelNuitDatas);
  }

  dataJourPersonnel(ind: number, event: any) {
    this.personnelJourDatas[ind] = event;
    console.log('affichages des données jour', this.personnelJourDatas);
  }

  ajoutPersonNuit() {
    this.personnelNuitDatas.push('');
    this.numArrayNuit = Array.from(
      { length: this.personnelNuitDatas.length },
      (_, ind) => ind
    );
  }
  ajoutPersonJour() {
    this.personnelJourDatas.push('');
    this.numArrayJour = Array.from(
      { length: this.personnelJourDatas.length },
      (_, ind) => ind
    );
  }

  suprPersonNuit(i: number) {
    console.log('indice suppression', i, this.personnelNuitDatas);
    this.formPersonnelNuit = this.personnelNuitDatas;
    this.personnelNuitDatas.splice(i, 1);
    this.numArrayNuit = Array.from(
      { length: this.personnelNuitDatas.length },
      (_, ind) => ind
    );
    console.log('après suppression', this.personnelNuitDatas);
  }


  suprPersonJour(i: number) {
    console.log('indice suppression', i, this.personnelJourDatas);
    this.formPersonnelJour = this.personnelJourDatas;
    this.personnelJourDatas.splice(i, 1);
    this.numArrayJour = Array.from(
      { length: this.personnelJourDatas.length },
      (_, ind) => ind
    );
    console.log('après suppression', this.personnelJourDatas);
  }

  modifier(){
    let personnel_jour:IPersonnelJour[]=[]
    let personnel_nuit:IPersonnelNuit[]=[]
    let attrPermanence:IPermanence = JSON.parse(JSON.stringify(this.permanence));
    delete attrPermanence.personnels_jour;
    delete attrPermanence.personnels_nuit;
    for(let personnel of this.personnelJourDatas){
      if(typeof personnel !="string"){
        personnel_jour.push({responsable:false, "permanence":attrPermanence, "personnel":personnel})
      }
    }
    for(let personnel of this.personnelNuitDatas){
      if(typeof personnel !="string"){
        personnel_nuit.push({responsable:false, "permanence":attrPermanence, "personnel":personnel})
      }
    }


    console.log("données permanence", personnel_jour,personnel_nuit, this.formFerier)
    this.permanence.type=this.formFerier;
    this.permanence.personnels_jour=personnel_jour
    this.permanence.personnels_nuit=personnel_nuit
    console.log("permanence modal sortie", this.permanence)
    this.openChange.emit(false)

  }
}
