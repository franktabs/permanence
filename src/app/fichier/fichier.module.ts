import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImportFileComponent } from './components/import-file/import-file.component';
import { FichierService } from './services/fichier/fichier.service';
import { FileParseColCSVService } from './services/file-parse-col-csv/file-parse-col-csv.service';
import { TableImportComponent } from './components/table-import/table-import.component';



@NgModule({
  declarations: [
    ImportFileComponent,
    TableImportComponent
  ],
  imports: [
    CommonModule
  ],
  providers:[
    FichierService, FileParseColCSVService, FileParseColCSVService
  ],
  exports:[ImportFileComponent, TableImportComponent]
})
export class FichierModule { }
