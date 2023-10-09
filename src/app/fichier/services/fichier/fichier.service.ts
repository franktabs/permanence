import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class FichierService {
    constructor() {}

    readFileContent(file: File): Promise<string> {
        const reader = new FileReader();
        return new Promise((resolve, reject) => {
            reader.onload = () => {
                const csvData = reader.result as string;
                resolve(csvData);
                // Faites quelque chose avec les données CSV, par exemple, parsez-les
                // this.parseCSV(csvData);
            };

            reader.onerror = () => {
                const error = reader.error;
                reject(error);
            };

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
