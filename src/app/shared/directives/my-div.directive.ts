import { Directive, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  selector: '[app-max]'
})
export class MyDivDirective   {

  constructor(private elementRef:ElementRef, private renderer:Renderer2)  { }

  ngOnInit(){
    // let newElement =  this.renderer.createElement("div");
    // newElement.classList.add("w-max-content")
    
    // console.log("value div", valueElement)

    // let nodes = this.renderer.

    // this.renderer.appendChild(newElement, valueElement)
    // this.renderer.setProperty(this.elementRef.nativeElement, "innerHTML", "");
    // this.renderer.appendChild(this.elementRef.nativeElement, newElement)


    // this.renderer.appendChild(this.elementRef.nativeElement, newElement)

    
  }

  ngAfterViewInit(){
  }
}
