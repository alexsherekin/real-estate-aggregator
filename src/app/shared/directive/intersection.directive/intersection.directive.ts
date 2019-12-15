import { Directive, Output, EventEmitter, ElementRef } from '@angular/core';

@Directive({
  selector: '[appIntersection]'
})
export class IntersectionDirective {

  @Output()
  public intersectionChange = new EventEmitter();

  constructor(private el: ElementRef) { }

  public ngAfterViewInit() {
    if (this.isEnabled) {
      this.startWatch();
    }
  }

  private isEnabled() {
    return window && 'IntersectionObserver' in window;
  }

  private startWatch() {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(({ isIntersecting }) => {
        if (isIntersecting) {
          this.intersectionChange.emit();
          obs.unobserve(this.el.nativeElement);
        }
      });
    });
    obs.observe(this.el.nativeElement);
  }

}
