import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {IPersonnel} from '../../interfaces/ipersonnel';
import {IHolidays} from '../../interfaces/iholidays';
import {IAbsence} from '../../interfaces/iabsence';
import {TypeAbsence, TypePersonnel} from '../../utils/types-map';
import {IApiHoliday} from '../../interfaces/iapiholiday';
import {IApiRemplacement} from '../../interfaces/iapiremplacement';
import {MatDialog} from '@angular/material/dialog';
import {ModalRoleComponent} from '../modal-role/modal-role.component';
import {IRole} from '../../interfaces/irole';
import {AuthService} from '../../services/auth.service';
import {IPermanence} from '../../interfaces/ipermanence';
import {IApiPersonnel} from '../../interfaces/iapipersonnel';
import axios from 'axios';
import {ApiService} from '../../services/api.service';
import {IPersonnelJour} from '../../interfaces/ipersonneljour';
import {AlertService} from '../../services/alert.service';
import {IPersonnelNuit} from '../../interfaces/ipersonnelNuit';
import {IPlanning} from "../../interfaces/iplanning";

//modal utilisé pour afficher les informations sur une ressource
// provenant d'un click sur une ligne du tableau
@Component({
  selector: 'app-modal1',
  templateUrl: './modal1.component.html',
  styleUrls: ['./modal1.component.scss'],
})
export class Modal1Component implements OnInit, OnChanges {
  @Input() isOpen!: boolean;

  @Output() isOpenChange: EventEmitter<boolean> = new EventEmitter();

  @Input() rows!: TypePersonnel | any;

  public permanences: IPermanence[] = [];

  public nbrPermanences: number = 0;

  public closeModal3: boolean = true;

  public keyRow: Array<keyof TypePersonnel> = [];

  public keyRowHoliday: Array<keyof IHolidays> = [];

  public userRoles: IRole['name'][] = [];

  public openModalHoliday: boolean = false;

  public planningList:IPlanning[] = [];


  public infoAbsence: {
    keys: Array<keyof IApiRemplacement> | null;
    value: IApiRemplacement | null;
  } = {keys: null, value: null};

  constructor(
    public dialog: MatDialog,
    private auth: AuthService,
    private api: ApiService,
    private alert: AlertService,
    private elementRef: ElementRef
  ) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['rows']) {
      let obj = changes['rows'].currentValue;

      let person: IApiPersonnel = obj;

      // axios
      //   .get(this.api.URL_PERMANENCES + '/personnel/' + person.id)
      //   .then((res) => {
      //     let permanenceData: IPermanence[] = res.data;
      //     this.permanences = permanenceData;
      //     this.nbrPermanences = this.permanences.length || 0;

      //     let plannings:IPlanning[] = [];
      //     let idListPlanning:Set<number> = new Set();

      //     for(let permanence of this.permanences){
      //       let planning:IPlanning = permanence.month?.planning as IPlanning ;
      //       console.log("permanence en cours => ", permanence);
      //       if(planning.id && !idListPlanning.has(planning.id)){
      //         idListPlanning.add(planning.id);
      //         plannings.push(planning);
      //       }
      //     }
          
      //     this.planningList = plannings;
      //   })
      //   .catch((err) => {
      //     console.error("Voici l'erreur", err);
      //     this.alert.alertMaterial({
      //       message: "Une erreurs lors des recueils des données s'est produite",
      //       title: 'error',
      //     });
      //   });

      axios.get(this.api.URL_PLANNINGS+'/personnel/'+person.id)
        .then((res)=>{
          let planningData:IPlanning[] = res.data;
          this.planningList = planningData;
        })
        .catch((err)=>{
          console.error("Voici l'erreur", err);
          this.alert.alertMaterial({
            message: "Une erreurs lors des recueils des données s'est produite",
            title: 'error',
          });
        })
      // let personnels_jour = person.personnels_jour;
      // let personnels_nuit = person.personnels_nuit;
      // if(personnels_jour && personnels_jour.length){
      //   for(let personJour of personnels_jour){
      //     axios.get(this.api.URL_PERSONNEL_JOURS+"/"+personJour.id)
      //     .then((res)=>{
      //       let personJourData:IPersonnelJour = res.data;
      //       this.permanences.push(personJourData.permanence as IPermanence);
      //     })
      //     .catch((err)=>{
      //       console.error("Voici l'erreur", err)
      //       this.alert.alertMaterial({message:"Une erreurs lors des recueils des données s'est produite", "title":"error"})
      //     })
      //   }
      // }
      // if(personnels_nuit && personnels_nuit.length){
      //   for(let personNuit of personnels_nuit){
      //     axios.get(this.api.URL_PERSONNEL_NUITS+"/"+personNuit.id)
      //     .then((res)=>{
      //       let personNuitData:IPersonnelNuit = res.data;
      //       this.permanences.push(personNuitData.permanence as IPermanence);
      //     })
      // .catch((err)=>{
      //   console.error("Voici l'erreur", err)
      //   this.alert.alertMaterial({message:"Une erreurs lors des recueils des données s'est produite", "title":"error"})
      // })
      //   }
      // }
      this.keyRow = Object.keys(obj).filter((item) => {
        if (typeof obj[item] == 'string') {
          return true;
        }
        return false;
      }) as any;
      let obj1 = obj as TypePersonnel;
      let unkHolidays: IApiHoliday[] = obj1.vacancies as any;
      if (unkHolidays && unkHolidays.length) {
        this.keyRowHoliday = Object.keys(unkHolidays[0]).filter((item) => {
          // console.log("who's undefined", obj.absence[item], obj.absence)

          let item1: keyof IApiHoliday = item as any;
          if (
            unkHolidays &&
            unkHolidays[0] &&
            typeof unkHolidays[0][item1] == 'string'
          ) {
            return true;
          }
          return false;
        }) as any;
      }

      let unkAbsences: IApiRemplacement[] = obj1.absentList as any;
      if (unkAbsences && unkAbsences.length) {
        let absence: IApiRemplacement | null = unkAbsences[0];
        for (let oneAbsence of unkAbsences) {
          let seconde = Math.floor(
            (+new Date(oneAbsence.start) - +new Date()) / 1000
          );
          if (seconde > 0) {
            absence = oneAbsence as TypeAbsence;
            break;
          }
        }
        if (absence) {
          this.infoAbsence.value = absence;
          this.infoAbsence.keys = Object.keys(absence).filter((item) => {
            let item1: keyof IApiRemplacement = item as any;
            if (absence && typeof absence[item1] == 'string') {
              return true;
            }
            return false;
          }) as any;
        }
      }
      console.log('personnes cliqué', this.rows);
    }
  }

  ngOnInit(): void {
    let userAuth = this.auth.user;
    if (userAuth && userAuth.roles) {
      this.userRoles = userAuth.roles.map((role) => role.name);
    }
  }

  closeModal() {
    let headerModal = this.elementRef.nativeElement.querySelector('.see-modal1');
    // for (let i = 0; i < headerModal.length; i++) {
    //   let elemt = headerModal[i];
    //   elemt.classList.remove('anim-scaleOut');
    //   elemt.classList.add('anim-scaleOut');
    // }
    headerModal.classList.add('anim-scaleOut');
    setTimeout(() => {
      this.isOpenChange.emit(false);
    }, 400);
  }

  openModalRemplacement() {
    this.closeModal3 = false;
  }

  openDialog() {
    let dialogRel = this.dialog.open(ModalRoleComponent, {
      data: this.rows,
    });
  }

  voirPlanning(planning:IPlanning){
    console.log("Planning d'un personnel => ",planning)
  }
}
