;import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { ModificationComponent } from '../modification/modification.component';
import axios from 'axios';
import { ApiService } from 'src/app/shared/services/api.service';
import { IParameter } from 'src/app/shared/interfaces/iparameter';
import { AlertService } from 'src/app/shared/services/alert.service';



@Component({
  selector: 'app-para',
  templateUrl: './para.component.html',
  styleUrls: ['./para.component.scss'],
})
export class ParaComponent implements OnInit {
  displayedColumns: string[] = ['libelle', 'valeur'];
  dataSource: IParameter[] = [];
  selectedRow: IParameter | null = null;

  constructor(
    private dialog: MatDialog,
    private api:ApiService,
    private alert:AlertService
  ) {}

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    axios.get(this.api.URL_PARAMETERS).then(
      (res)=>{
        this.dataSource = res.data
      }
    ).catch((e)=>{
      console.error("voici l'erreur", e);
      this.alert.alertError();
    })

  }

  editValue(row: IParameter) {
    this.selectedRow = row;

    this.dialog.open(ModificationComponent, {
      data: row,
    });
  }

  // onValueChanged(updatedValue: string) {
  //   if (this.selectedRow) {
  //     const clonedRow = { ...this.selectedRow };
  //     clonedRow.valeur = updatedValue;

  //     const rowIndex = this.dataSource.indexOf(this.selectedRow);
  //     this.dataSource[rowIndex] = clonedRow;
  //     this.selectedRow = null;
  //   }
  // }
}