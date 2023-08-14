import { Component, Inject, OnInit } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { AlertMessage } from '../../services/alert.service';

@Component({
  selector: 'app-alert-material',
  templateUrl: './alert-material.component.html',
  styleUrls: ['./alert-material.component.scss']
})
export class AlertMaterialComponent implements OnInit {

  


  constructor(@Inject(MAT_SNACK_BAR_DATA) public data:AlertMessage) { }

  ngOnInit(): void {
  }

}
