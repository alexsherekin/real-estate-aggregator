import { Directive, ElementRef, HostBinding, Input, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[appBgImgLazyLoading]'
})
export class BackgroundImageLazyLoadingDirective implements OnChanges, AfterViewInit {

  @HostBinding('style.background-image') bgImage: string | null = null;
  @Input() img!: string;

  constructor(private el: ElementRef) { }

  public ngAfterViewInit() {
    this.canLazyLoad() ? this.lazyLoadImage() : this.loadImage();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.hasOwnProperty('img')) {
      this.lazyLoadImage();
    }
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
