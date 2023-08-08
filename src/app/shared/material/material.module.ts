import { NgModule } from '@angular/core';
import { MatTableModule} from "@angular/material/table"
import {MatPaginatorModule} from "@angular/material/paginator"
import { MatSortModule } from '@angular/material/sort';
import {MatInputModule} from "@angular/material/input";
import { MatButtonModule } from '@angular/material/button';
import {MatBadgeModule} from "@angular/material/badge"
import { MatSelectModule } from '@angular/material/select';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatIconModule} from "@angular/material/icon"

const moduleMaterial = [
  MatPaginatorModule,
  MatTableModule,
  MatSortModule,
  MatBadgeModule,
  MatButtonModule,
  MatSelectModule,
  MatFormFieldModule,
  MatInputModule,
  MatDialogModule,
  BrowserAnimationsModule,
  MatIconModule
]

@NgModule({
  imports: moduleMaterial,
  exports:moduleMaterial
})
export class MaterialModule { }
