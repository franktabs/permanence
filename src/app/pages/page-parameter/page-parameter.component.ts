import { Component, OnInit } from '@angular/core';
import axios from 'axios';
import { IApiDirection } from 'src/app/shared/interfaces/iapidirection';
import { IDirection } from 'src/app/shared/interfaces/idirection';
import { IParameter } from 'src/app/shared/interfaces/iparameter';
import { AlertService } from 'src/app/shared/services/alert.service';
import { ApiService } from 'src/app/shared/services/api.service';
import { LoaderService } from 'src/app/shared/services/loader.service';

@Component({
  selector: 'app-page-parameter',
  templateUrl: './page-parameter.component.html',
  styleUrls: [
    './page-parameter.component.scss',
    '../shared/styles/styles.scss',
  ],
})
export class PageParameterComponent implements OnInit {

  public parameters:IParameter[] = [];

  public api1_DSI!:IParameter ;

  public api2_DSI!:IParameter;

  constructor(private api:ApiService, private alert:AlertService, private loader:LoaderService) {}

  ngOnInit(): void {

    axios.get(this.api.URL_PARAMETERS).then(
      (res)=>{
        this.parameters = res.data;
        for(let parameter of this.parameters){
          if(parameter.code=="api1_DSI"){
            this.api1_DSI = parameter;
          }else if(parameter.code=="api2_DSI"){
            this.api2_DSI = parameter;
          }
        }
      }
    ).catch((e)=>{
      console.error("voici l'erreur", e);
      this.alert.alertError();
    })

  }


  async reloadDataOrganisation(){
    this.loader.loader_modal$.next(true);
    try{

      if(this.api2_DSI.valeur){
  
        let response = await axios.get(this.api2_DSI.valeur);
        let datas:IApiDirection[] = response.data;
        console.log("données de l'api parametre", datas)

        // for(let data of datas){
          datas.sort((data1, data2)=>{
            if(data1.organizationId && data2.organizationId){
              return data2.organizationId.toString().localeCompare(data1.organizationId.toString())
            }
            return 0;
          })
          response = await axios.post(this.api.URL_DIRECTIONS+"/config-actualise", datas)
          console.log("resultat requete", response.data)
        // }
      }
    }catch(e){
      console.error("Voici l'erreur", e)
      this.alert.alertError();
    }
    this.loader.loader_modal$.next(false);
  }
}
