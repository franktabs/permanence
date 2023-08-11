import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-modal-permanence',
  templateUrl: './modal-permanence.component.html',
  styleUrls: ['./modal-permanence.component.scss']
})
export class ModalPermanenceComponent implements OnInit {
  @Output() openChange: EventEmitter<boolean> = new EventEmitter();


  @Input()
  set open(bool: boolean) {
    if (bool == false) {
      this.openChange.emit(false);
    }
  }


  constructor() { }

  ngOnInit(): void {
  }

}
