import { Component, Inject, OnInit } from '@angular/core';
import axios from 'axios';
import { ApiService } from '../../services/api.service';
import { IRole } from '../../interfaces/irole';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IApiPersonnel } from '../../interfaces/iapipersonnel';
import { LoaderService } from '../../services/loader.service';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-modal-role',
  templateUrl: './modal-role.component.html',
  styleUrls: ['./modal-role.component.scss'],
})
export class ModalRoleComponent implements OnInit {
  public roles: IRole[] = [];
  public initialResult: boolean[] = [];
  public result: Array<boolean> = [];

  constructor(
    private api: ApiService,
    public dialogRef: MatDialogRef<ModalRoleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IApiPersonnel,
    private loader: LoaderService,
    private alert: AlertService
  ) {}

  ngOnInit(): void {
    axios
      .get(this.api.URL_ROLES)
      .then((res) => {
        console.log('voici les roles', res.data);
        this.roles = res.data;
        this.result = Array(this.roles.length).fill(false);
        for (let i = 0; i < this.roles.length; i++) {
          let role = this.roles[i];
          if (role.personnels)
            for (let j = 0; j < role.personnels.length; j++) {
              let personnel = role.personnels[j];
              if (
                personnel.id == this.data.id &&
                personnel.userId == this.data.userId
              ) {
                this.result[i] = true;
                break;
              }
            }
        }
        this.initialResult = [...this.result];
      })
      .catch((e) => {
        console.error("Voici l'erreur", e);
      });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  rendu() {
    console.log('re-rendu');
    return true;
  }

  desactiver() {
    let exact = true;
    for (let i = 0; i < this.result.length; i++) {
      if (this.result[i] != this.initialResult[i]) {
        exact = false;
        break;
      }
    }
    return exact;
  }

  async confirmer() {
    this.dialogRef.close();
    this.loader.loader_modal$.next(true);
    let modify = true;
    try {
      for (let i = 0; i < this.roles.length; i++) {
        if (this.result[i] != this.initialResult[i]) {
          let role = this.roles[i];
          if (this.result[i]) {
            role.personnels?.push(this.data);
            let response = await axios.post(this.api.URL_ROLES, role);
            if (response.data.id) {
              let copyRole: IRole = JSON.parse(JSON.stringify(role));
              delete copyRole.personnels;
              this.data.roles?.push(copyRole);
            }else{
              modify=false
            }
          }
          else {
            let response = await axios.delete(this.api.URL_ROLES+"/"+role.id+"/personnel/"+this.data.id);
            if(response.data.id){
              let copyRole: IRole = JSON.parse(JSON.stringify(role));
              delete copyRole.personnels;
              if (this.data.roles) {
                for (let k = 0; k < this.data.roles.length; k++) {
                  let supprRole = this.data.roles[k];
                  if (supprRole.id == copyRole.id) {
                    this.data.roles.splice(k, 1);
                    break;
                  }
                }
              }
            }else{
              modify=false;
            }
            
          }
          console.log('changement role ', role.name);
        }
      }
      if (modify) {
        this.alert.alertMaterial({
          message: 'Changement effectué avec succès',
          title: 'success',
        });
      } else {
        this.alert.alertMaterial({
          message: 'Un changement non effectué',
          title: 'error',
        });
      }
    } catch (e) {
      console.error("voici l'erreur", e);
      this.alert.alertMaterial({
        message: "une erreur s'est produite",
        title: 'error',
      });
    }

    this.loader.loader_modal$.next(false);
  }
}
