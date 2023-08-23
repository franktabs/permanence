import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import axios from 'axios';
import { IParameter } from 'src/app/shared/interfaces/iparameter';
import { AlertService } from 'src/app/shared/services/alert.service';
import { ApiService } from 'src/app/shared/services/api.service';
import { LoaderService } from 'src/app/shared/services/loader.service';

@Component({
  selector: 'app-modification',
  templateUrl: './modification.component.html',
  styleUrls: ['./modification.component.scss'],
})
export class ModificationComponent implements OnInit {
  public value: string = '';
  // @Output() valueChanged = new EventEmitter<string>();

  constructor(
    public dialogRef: MatDialogRef<ModificationComponent>,
    @Inject(MAT_DIALOG_DATA) public row: IParameter,
    private loader: LoaderService,
    private alert: AlertService,
    private api: ApiService
  ) {}

  ngOnInit(): void {
    this.value = this.row.valeur || '';
  }

  async updateValue() {
    this.dialogRef.close();
    this.loader.loader_modal$.next(true);
    let copyParse = JSON.parse(JSON.stringify(this.row));
    let copyRow: IParameter = copyParse;
    copyRow.valeur = this.value;

    try {
      let response = await axios.post(this.api.URL_PARAMETERS, copyRow);
      if (response.data.id) {
        this.alert.alertSave();
        this.row.valeur = this.value;
      }
    } catch (e) {
      console.error("Voici l'erreur", e);
      this.alert.alertError();
    }

    this.loader.loader_modal$.next(false);
  }

  close() {
    this.dialogRef.close();
  }
}
