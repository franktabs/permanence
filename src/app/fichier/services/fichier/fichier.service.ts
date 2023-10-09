import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class FichierService {

    // abstract readFileContent(file: File): Promise<string>
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

}
