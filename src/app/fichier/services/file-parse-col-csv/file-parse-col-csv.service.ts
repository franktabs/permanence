import { Injectable } from '@angular/core';
import { IFileParse } from '../../interfaces/IFileParse';

@Injectable({
  providedIn: 'root'
})
export class FileParseColCSVService extends IFileParse {


  parseCSV(csvData: string) {
    // Logique de traitement du fichier CSV
    const lines = csvData.split('\n');
    const headers = lines[0].split(';');
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
    return objects;
}
}
