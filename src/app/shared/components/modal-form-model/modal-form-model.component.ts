import { Component, Inject, Input, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { TitleCard1 } from '../card1/card1.component';
import { IApiPersonnel } from '../../interfaces/iapipersonnel';
import { OptionalKey, OptionalKeyString } from '../../utils/type';
import { IApiDepartement } from '../../interfaces/iapidepartement';
import DepartementRequest from '../../models/model-request/DepartementRequest';
import axios from 'axios';
import { ApiService } from '../../services/api.service';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { IApiDirection } from '../../interfaces/iapidirection';
import DirectionRequest from '../../models/model-request/DirectionRequest';
import { LoaderService } from '../../services/loader.service';
import { AlertService } from '../../services/alert.service';
import { ValidationService } from '../../services/validation.service';

export type DataDialogModalFormModelComponent = {
  titre: TitleModalForm;
  dataForm: OptionalKeyString<IApiDepartement | IApiDirection | IApiPersonnel>;
  icon: string;
};

export type TitleModalForm = 'DIRECTION' | 'DEPARTEMENT' | 'PERSONNEL';

const VIEW_INPUT: Array<keyof DataDialogModalFormModelComponent['dataForm']> = [
  'emailaddress',
  'firstname',
  'sexe',
  'organizationId',
  'name',
  'parentorganizationId',
];

@Component({
  selector: 'app-modal-form-model',
  templateUrl: './modal-form-model.component.html',
  styleUrls: ['./modal-form-model.component.scss'],
})
export class ModalFormModelComponent implements OnInit {
  public iconTitle!: string;

  public dataForm: DataDialogModalFormModelComponent['dataForm'];

  public dataViewHtml!: any;

  public departementRequest: DepartementRequest<IApiDepartement[]> =
    new DepartementRequest([]);

  public DirectionRequest: DirectionRequest<IApiDirection[]> =
    new DirectionRequest([]);

  public directionRequest: DirectionRequest<IApiDirection[]> =
    new DirectionRequest([]);

  public typeInput: { simple: Array<(typeof VIEW_INPUT)[number]> } = {
    simple: ['firstname', 'name'],
  };

  public keyDataForm!: (keyof typeof this.dataForm)[];

  public myFormGroup!: FormGroup;

  public titre!: TitleModalForm;

  public emailList!: (string | null)[];

  constructor(
    public dialogRef: MatDialogRef<ModalFormModelComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DataDialogModalFormModelComponent,
    public api: ApiService,
    public formBuilder: FormBuilder,
    public loader: LoaderService,
    private dialog: MatDialog,
    private alert: AlertService,
    private validation: ValidationService
  ) {
    this.dataForm = data.dataForm;
    this.iconTitle = data.icon;
    this.titre = data.titre;
  }

  ngOnInit(): void {
    this.keyDataForm = Object.keys(this.dataForm) as any;
    let elemntGroup: { [key in keyof typeof this.dataForm]: any } = {};
    let personnels = this.api.data.personnels;
    this.emailList = personnels.map((personnel) => {
      return personnel.emailaddress;
    });
    for (let key in this.dataForm) {
      let cle: keyof typeof this.dataForm = key as any;
      if (cle == 'emailaddress') {
        elemntGroup.emailaddress = [
          this.dataForm.emailaddress,
          Validators.compose([
            Validators.email,
            Validators.required,
            this.emailUnique(),
          ]),
        ];
      } else {
        elemntGroup[cle] = [this.dataForm[cle], Validators.required];
      }
    }
    this.myFormGroup = this.formBuilder.group(elemntGroup);
    this.dataViewHtml = JSON.parse(JSON.stringify(this.dataForm));
    if (
      (<(keyof OptionalKeyString<IApiPersonnel>)[]>(
        Object.keys(this.dataForm)
      )).includes('organizationId') &&
      this.titre == 'PERSONNEL'
    ) {
      this.initDepartementList();
    } else if (
      (<(keyof OptionalKeyString<IApiDirection>)[]>(
        Object.keys(this.dataForm)
      )).includes('parentorganizationId') &&
      this.titre == 'DEPARTEMENT'
    ) {
      this.initDirectionList();
    }
  }

  onNoClick() {
    this.dialogRef.close();
  }

  isSimpleInput(key: string) {
    return this.typeInput.simple.includes(key as any);
  }

  async initDepartementList() {
    try {
      this.departementRequest.loading();
      let response = await axios.get(this.api.URL_DEPARTEMENTS);
      if (response.data) {
        this.departementRequest.data = response.data;
        this.departementRequest.success();
      }
    } catch (e) {
      console.error("voici l'erreur ", e);
      this.departementRequest.error();
    }
  }

  async initDirectionList() {
    try {
      this.directionRequest.loading();
      let response = await axios.get(this.api.URL_DIRECTIONS);
      if(response.data){
        this.directionRequest.setData(response.data);
        this.directionRequest.success();
      }
    } catch (e) {
      console.error("voici l'erreur ", e);
      this.directionRequest.error();
    }
  }

  async enregistrer() {
    if (this.titre == 'PERSONNEL') {
      let datas: IApiPersonnel = this.myFormGroup.value;
      this.loader.loader_modal$.next(true);
      try {
        let response = await axios.post(
          this.api.URL_PERSONNELS + '/config-actualise',
          [datas]
        );
        console.log('personne sauvegarder', response.data);
      } catch (e) {
        console.error("voici l'erreur ", e);
        this.alert.alertError();
      }

      this.loader.loader_modal$.next(false);
    }
    else if(this.titre=="DEPARTEMENT"){
      let datas: IApiDepartement = this.myFormGroup.value;
      this.loader.loader_modal$.next(true);
      try{
        let direction = this.directionRequest.data.find((direction1)=>{
          if(direction1?.organizationId == datas.parentorganizationId){
            return true
          }else{
            return false
          }
        });

        console.log("voici le parentOrganizationId", datas.parentorganizationId, " voici la direction correspondante ", direction)
      }
      catch (e) {
        console.error("voici l'erreur ", e);
        this.alert.alertError();
      }
      this.loader.loader_modal$.next(false);


    }
    else if(this.titre="DIRECTION"){
      
    }
  }

  testEmail(): boolean {
    let result = this.myFormGroup.controls['emailaddress'];
    console.log('le champs email est ', result);
    return !!result;
  }

  async addOtherFor(titre: TitleModalForm) {
    if (titre == 'PERSONNEL') {
      this.loader.loader_modal$.next(true);

      try {
        let response = await axios.get(
          this.api.URL_DEPARTEMENTS + '/min-organizationId'
        );
        if (response.data) {
          let departement: IApiDepartement = response.data;
          let minOrganizationId: number = departement.organizationId as any;

          if (minOrganizationId >= 0) {
            minOrganizationId = -1;
          } else {
            minOrganizationId -= 1;
          }
          let newDepartement: OptionalKeyString<IApiDepartement> = {
            name: '',
            parentorganizationId: undefined,
            organizationId: minOrganizationId,
          };
          this.dialog.open<
            ModalFormModelComponent,
            DataDialogModalFormModelComponent
          >(ModalFormModelComponent, {
            data: {
              titre: 'DEPARTEMENT',
              dataForm: newDepartement,
              icon: "<i class='bi bi-building-add'></i>",
            },
          });
        }
      } catch (e) {
        console.error("voici l'erreur ", e);
        this.alert.alertError();
      }

      this.loader.loader_modal$.next(false);
    }
    if (titre == 'DEPARTEMENT') {


      this.loader.loader_modal$.next(true);

      try{
        let response = await axios.get(this.api.URL_DIRECTIONS+"/min-organizationId");
        if(response.data){
          let direction:IApiDirection = response.data;
          let minOrganizationId:number = direction.organizationId as any;
          
          if (minOrganizationId >= 0) {
            minOrganizationId = -1;
          } else {
            minOrganizationId -= 1;
          }

          let newDirection: OptionalKeyString<IApiDirection> = {
            name: '',
            organizationId: minOrganizationId,
          };

          this.dialog.open<
            ModalFormModelComponent,
            DataDialogModalFormModelComponent
          >(ModalFormModelComponent, {
            data: {
              titre: "DIRECTION",
              dataForm: newDirection,
              icon: "<i class='bi bi-building-add'></i>",
            },
          });

        }

      }catch (e) {
        console.error("voici l'erreur ", e);
        this.alert.alertError();
      }

      


      this.loader.loader_modal$.next(false);
    }
  }

  getError(cle: string): boolean {
    return (
      this.myFormGroup &&
      this.myFormGroup.controls[cle].errors &&
      //@ts-ignore
      this.myFormGroup.controls[cle].errors['required']
    );
  }

  emailUnique(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      console.log("voici l'emailList", this.emailList);

      if (this.emailList.includes(value)) {
        return { emailUnique: true };
      }

      return null;
    };
  }
}
