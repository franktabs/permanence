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
}
