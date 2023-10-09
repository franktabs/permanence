import { Component, Input, OnInit } from '@angular/core';
import { AlertService } from 'src/app/shared/services/alert.service';

@Component({
    selector: 'app-import-file',
    templateUrl: './import-file.component.html',
    styleUrls: ['./import-file.component.scss'],
})
export class ImportFileComponent implements OnInit {
    @Input() public accept: 'text/csv' = 'text/csv';

    constructor(public alert:AlertService) {}

    ngOnInit(): void {}

    async importerFichier(event: any) {
        // Récupère le contenu du fichier
        console.log("voici l'event du fichier =>", event);
        const fichier: File = event.target.files[0];

        if (fichier) {
            try{
                let textFileCsv = await this.readFileContent(fichier);
                this.parseCSV(textFileCsv);
            }catch(err){
                console.log("voici l'erreur", err);
                this.alert.alertError();
            }
        }
    }

    readFileContent(file: File): Promise<string> {
        const reader = new FileReader();
        return new Promise((resolve, reject) => {

            reader.onload = () => {
                const csvData = reader.result as string;
                resolve(csvData)
                // Faites quelque chose avec les données CSV, par exemple, parsez-les
                // this.parseCSV(csvData);
            };

            reader.onerror = () =>{
                const error = reader.error;
                reject(error);
            }


            reader.readAsText(file, 'UTF-8');

        });
    }

    parseCSV(csvData: string) {
        // Logique de traitement du fichier CSV
        console.log('voici le csvData => ', csvData);
        const lines = csvData.split('\n');
        const headers = lines[0].split(';');
        const result = [];
        const objects: any = {};
        for (let header of headers) {
            if (header.trim() != '') {
                objects[header] = [];
            }
        }

        for (let i = 1; i < lines.length; i++) {
            const currentLine = lines[i].split(';');
            if (currentLine.length === headers.length) {
                for (let j = 0; j < headers.length; j++) {
                    if (currentLine[j].trim() != '') {
                        objects[headers[j]].push(currentLine[j]);
                    }
                }
            }
        }
        result.push(objects);

        console.log('voici le result => ', result);
    }
}
