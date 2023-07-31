import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IPersonnel } from 'src/app/shared/interfaces/ipersonnel';

@Component({
  selector: 'app-user-info-modal',
  templateUrl: './user-info-modal.component.html',
  styleUrls: ['./user-info-modal.component.scss']
})
export class UserInfoModalComponent implements OnInit {

  constructor(
     @Inject(MAT_DIALOG_DATA) public userInfo: IPersonnel
  ) { }

  ngOnInit(): void {
  }

}
