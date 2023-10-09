import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-import-file',
    templateUrl: './import-file.component.html',
    styleUrls: ['./import-file.component.scss'],
})
export class ImportFileComponent implements OnInit {
    public files!: any;

    constructor() {}

    ngOnInit(): void {}

    importerFichier(event: any) {
        // Récupère le contenu du fichier
        console.log("voici l'event du fichier =>", event);
        const fichier:File = event.target.files[0];


        if(fichier){
            this.readFileContent(fichier)
        }
    }

    readFileContent(file: File) {
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = () => {
          const csvData = reader.result as string;
          // Faites quelque chose avec les données CSV, par exemple, parsez-les
          this.parseCSV(csvData);
        };
      }

      parseCSV(csvData: string) {
        // Logique de traitement du fichier CSV
        
      }
}
