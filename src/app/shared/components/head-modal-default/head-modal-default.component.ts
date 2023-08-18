import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-head-modal-default',
  templateUrl: './head-modal-default.component.html',
  styleUrls: ['./head-modal-default.component.scss']
})
export class HeadModalDefaultComponent implements OnInit {

  
  @Input() open : boolean = false;
  @Input() icon !:string;
  @Output() openChange: EventEmitter<boolean> = new EventEmitter();

  @Input() nameModal!:string;

  constructor() { }

  ngOnInit(): void {
  }

  closeModal(){
    let headerModal = document.querySelectorAll(".see-header-modal")
    for(let i = 0; i<headerModal.length; i++){
      let elemt = headerModal[i];
      elemt.classList.add("anim-rotOut");
    }
    setTimeout(()=>{
      this.openChange.emit(false)
    }, 500)
  }

}
