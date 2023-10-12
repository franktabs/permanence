import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';


export type DataTableImport = {
    table:Array<any>;
    action:boolean;
}

@Component({
    selector: 'app-table-import',
    templateUrl: './table-import.component.html',
    styleUrls: ['./table-import.component.scss'],
})
export class TableImportComponent implements OnInit {

    public errors:boolean = false;
    public erreur:boolean=false;
    constructor(
        public dialogRef: MatDialogRef<TableImportComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DataTableImport
    ) {}
    ngOnInit(): void {}

    onNoClick(): void {
        this.dialogRef.close();
    }

    onClick():void{
        this.data.action = true;
        this.dialogRef.close();
    }

    isErrors(line:any, key:any):boolean{
        let erreur = line._errors.includes(key);
        this.errors = erreur==true?true:this.errors;
        return erreur;
    }

    getErrors(){
        return this.errors;
    }
    ngAfterViewInit(){
        this.errors = this.erreur;
    }
}
