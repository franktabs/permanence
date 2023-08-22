import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';

@Component({
  selector: 'app-head-modal-default',
  templateUrl: './head-modal-default.component.html',
  styleUrls: ['./head-modal-default.component.scss'],
})
export class HeadModalDefaultComponent implements OnInit {
  @Input() open: boolean = false;
  @Input() icon!: string;
  @Output() openChange: EventEmitter<boolean> = new EventEmitter();

  @Input() nameModal!: string;

  constructor(private elementRef: ElementRef) {}

  ngOnInit(): void {}

  closeModal() {
    let headerModal =
      this.elementRef.nativeElement.querySelector('.see-header-modal');
    headerModal.classList.add('anim-rotOut');
    // let headerModal = document.querySelectorAll(".see-header-modal")
    // for(let i = 0; i<headerModal.length; i++){
    //   let elemt = headerModal[i];
    //   elemt.classList.remove("anim-rotOut");
    //   elemt.classList.add("anim-rotOut");
    // }

    setTimeout(() => {
      this.openChange.emit(false);
    }, 500);
  }
}
