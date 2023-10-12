import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AlertService } from 'src/app/shared/services/alert.service';
import { FichierService } from '../../services/fichier/fichier.service';
import { IFileParse } from '../../interfaces/IFileParse';
import { FileParseColCSVService } from '../../services/file-parse-col-csv/file-parse-col-csv.service';
import { FileParseLineCSVService } from '../../services/file-parse-line-csv/file-parse-line-csv.service';

@Component({
    selector: 'app-import-file',
    templateUrl: './import-file.component.html',
    styleUrls: ['./import-file.component.scss'],
})
export class ImportFileComponent implements OnInit {
    @Input() public accept: 'text/csv' = 'text/csv';
    @Input() public alert:AlertService|undefined;
    @Input() public title:string = "Importer un fichier";
    @Input() public read_per:"LINES"|"COLUMNS" = "LINES"
    @Output() public resultEmitter:EventEmitter<any> = new EventEmitter();

    constructor(
        public fichierService: FichierService,
        public parseCol: FileParseColCSVService,
        public parseLine: FileParseLineCSVService
    ) {}

    ngOnInit(): void {}

    async importerFichier(event: any) {
        // Récupère le contenu du fichier
        const fichier: File = event.target.files[0];

        if (fichier) {
            let textFileCsv:string ="";
            try {
                textFileCsv = await this.fichierService.readFileContent(
                    fichier
                );
            } catch (err) {
                console.log("voici l'erreur", err);
                if(this.alert instanceof AlertService){
                    this.alert.alertError();
                }
            }
            let result;

            if(this.read_per=="LINES" && textFileCsv){

                result = this.parseLine.clearStringEmpty(this.parseLine.parseCSV(textFileCsv));
            }
            else if ( this.read_per=="COLUMNS" && textFileCsv ){
                result = this.parseCol.clearStringEmpty(this.parseCol.parseCSV(textFileCsv));

            }else{
                if(textFileCsv){
                    throw new Error("Does'nt support !!!")
                }
            }
            this.resultEmitter.emit(result);
        }
    }
}
