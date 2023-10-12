import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImportFileComponent } from './components/import-file/import-file.component';
import { FichierService } from './services/fichier/fichier.service';
import { FileParseColCSVService } from './services/file-parse-col-csv/file-parse-col-csv.service';



@NgModule({
  declarations: [
    ImportFileComponent
  ],
  imports: [
    CommonModule
  ],
  providers:[
    FichierService, FileParseColCSVService, FileParseColCSVService
  ],
  exports:[ImportFileComponent]
})
export class FichierModule { }
