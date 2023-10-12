import { Injectable } from '@angular/core';
import { IFileParse } from '../../interfaces/IFileParse';

@Injectable({
  providedIn: 'root'
})
export class FileParseLineCSVService extends IFileParse {


  parseCSV(csvData: string) {
    const lines = csvData.split('\n');
    const headers = lines[0].split(';');
    const result = [];

    for (let i = 1; i < lines.length; i++) {
        const currentLine = lines[i].split(';');
        if (currentLine.length === headers.length) {
            const object:any = {};
            for (let j = 0; j < headers.length; j++) {
                if(headers[j].trim()!=""){
                    object[headers[j]] = currentLine[j];
                }
            }
            result.push(object);
        }
    }

    return result;
}
}
