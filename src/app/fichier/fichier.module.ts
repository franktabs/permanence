import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImportFileComponent } from './import-file/import-file.component';
import { FichierService } from './services/fichier/fichier.service';



@NgModule({
  declarations: [
    ImportFileComponent
  ],
  imports: [
    CommonModule
  ],
  providers:[
    FichierService
  ],
  exports:[ImportFileComponent]
})
export class FichierModule { }
