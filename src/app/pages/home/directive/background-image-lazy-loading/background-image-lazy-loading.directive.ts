import { Directive, ElementRef, HostBinding, Input, AfterViewInit } from '@angular/core';

@Directive({
  selector: '[appBgImgLazyLoading]'
})
export class BackgroundImageLazyLoadingDirective implements AfterViewInit {

  @HostBinding('style.background-image') bgImage = null;
  @Input() img: string;

  constructor(private el: ElementRef) { }

  ngAfterViewInit() {
    this.canLazyLoad() ? this.lazyLoadImage() : this.loadImage();
  }

  private canLazyLoad() {
    return window && 'IntersectionObserver' in window;
  }

  private lazyLoadImage() {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(({ isIntersecting }) => {
        if (isIntersecting) {
          this.loadImage();
          obs.unobserve(this.el.nativeElement);
        }
      });
    });
    obs.observe(this.el.nativeElement);
  }

  private loadImage() {
    this.bgImage = `url(${this.img})`;
  }
}
