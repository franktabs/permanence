import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TitleModalForm } from 'src/app/shared/components/modal-form-model/modal-form-model.component';
import { IApiPersonnel } from 'src/app/shared/interfaces/iapipersonnel';
import { OptionalKey } from 'src/app/shared/utils/type';

export type DataTableImport = {
    table: Array<any>;
    action: boolean;
    type: TitleModalForm;
    colonneFile: {
        required: Array<keyof IApiPersonnel>;
        other: Array<keyof IApiPersonnel>;
    };
};

@Component({
    selector: 'app-table-import',
    templateUrl: './table-import.component.html',
    styleUrls: ['./table-import.component.scss'],
})
export class TableImportComponent implements OnInit {
    public errors: boolean = false;
    public erreur: boolean = false;
    public messagesChamps: string[] = [];
    public messagesColonne: string[] = [];

    constructor(
        public dialogRef: MatDialogRef<TableImportComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DataTableImport
    ) {}
    ngOnInit(): void {}

    onNoClick(): void {
        this.dialogRef.close();
    }

    onClick(): void {
        this.data.action = true;
        if (this.data.type === 'PERSONNEL') {
            let personnelList = []
            for (let line of this.data.table) {
                let personnel: OptionalKey<IApiPersonnel> = {};
                for (let key of this.data.colonneFile.required) {
                    personnel[key] = line[key];
                }
                for (let key of this.data.colonneFile.other) {
                    personnel[key] = line[key];
                }
                personnelList.push(personnel);
            }
            this.saveManyPersonnel(personnelList);
        }
    }
    saveManyPersonnel(list:Array<OptionalKey<IApiPersonnel>>){
        
    }

    isErrors(line: any, key: any): boolean {
        let erreur = line._errors.includes(key);
        this.errors = erreur == true ? true : this.errors;
        return erreur;
    }

    getErrors() {
        return this.errors;
    }
    ngAfterViewInit() {
        this.errors = this.erreur;
    }

    isErrorsChamps(line: any, key: any): string[] {
        let keyError = [];
        let keyMsg = [];
        for (let error of line._errors.lines) {
            if (error.key === key) {
                keyError.push(error.key);
                keyMsg.push(error.msg);
            }
        }
        let erreur = keyError.includes(key);

        if (erreur) {
            this.errors = true;
            this.erreur = true;
        }
        this.messagesChamps = keyMsg;
        return keyMsg;
    }

    isErrorsColonne(line: any): string[] {
        let keyError = [];
        let keyMsg = [];
        for (let error of line._errors.columns) {
            keyError.push(error.key);
            keyMsg.push(error.msg);
        }
        if (keyError.length > 0) {
            this.errors = true;
            this.erreur = true;
        }
        this.messagesColonne = keyMsg;
        return keyMsg;
    }

    fusionErreurMessage(keyMsg: string[]) {
        let msg = '';
        for (let i = 0; i < keyMsg.length; i++) {
            msg += keyMsg[i];
            if (i != keyMsg.length - 1) {
                msg += '; ';
            }
        }
        return msg;
    }

    nbrKey(obj: object) {
        if (obj == null) return 0;
        return Object.keys(obj).length;
    }
}
