import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appDropdown]',
})
export class DropdownDirective {
  constructor(private elementRef: ElementRef, private renderer: Renderer2) {}

  @HostListener('click') toggleOpen = () => {
    const nativeElem = this.elementRef.nativeElement;
    if (nativeElem.classList.contains('open')) {
      this.renderer.removeClass(nativeElem, 'open');
    } else {
      this.renderer.addClass(nativeElem, 'open');
    }
  };

  // Logic for outside click:
  // @HostBinding('class.open') isOpen = false;
  // @HostListener('document:click', ['$event']) toggleOpen(event: Event) {
  //   this.isOpen = this.elRef.nativeElement.contains(event.target) ? !this.isOpen : false;
  // }
}
