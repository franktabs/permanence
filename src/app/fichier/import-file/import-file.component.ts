import { Component, Input, OnInit } from '@angular/core';
import { AlertService } from 'src/app/shared/services/alert.service';
import { FichierService } from '../services/fichier/fichier.service';
import { IFileParse } from '../interfaces/IFileParse';
import { FileParseColCSVService } from '../services/file-parse-col-csv/file-parse-col-csv.service';
import { FileParseLineCSVService } from '../services/file-parse-line-csv/file-parse-line-csv.service';

@Component({
    selector: 'app-import-file',
    templateUrl: './import-file.component.html',
    styleUrls: ['./import-file.component.scss'],
})
export class ImportFileComponent implements OnInit {
    @Input() public accept: 'text/csv' = 'text/csv';

    constructor(
        public alert: AlertService,
        public fichierService: FichierService,
        public parseCol: FileParseColCSVService,
        public parseLine: FileParseLineCSVService
    ) {}

    ngOnInit(): void {}

    async importerFichier(event: any) {
        // Récupère le contenu du fichier
        console.log("voici l'event du fichier =>", event);
        const fichier: File = event.target.files[0];

        if (fichier) {
            try {
                let textFileCsv = await this.fichierService.readFileContent(
                    fichier
                );

                let resultCol = this.parseCol.parseCSV(textFileCsv);
                let resultLine = this.parseLine.parseCSV(textFileCsv);

                console.log('resultat resultLine=>', resultLine);
                console.log('resultat resultCol=>', resultCol);
            } catch (err) {
                console.log("voici l'erreur", err);
                this.alert.alertError();
            }
        }
    }
}
