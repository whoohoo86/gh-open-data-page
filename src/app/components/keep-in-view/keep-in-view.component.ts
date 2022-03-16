import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, HostListener, Inject, OnInit, Renderer2, ViewChild } from '@angular/core';
import * as _ from 'lodash';

@Component({
  selector: 'app-keep-in-view',
  templateUrl: './keep-in-view.component.html',
  styleUrls: ['./keep-in-view.component.scss']
})
export class KeepInViewComponent implements OnInit {

  @ViewChild('keepInView') keepInViewElement!: ElementRef;
  updateTopOffsetDebounce = _.debounce(x => this.updateTopOffset(x), 50, { maxWait: 200 });

  constructor(private elementRef: ElementRef, private renderer: Renderer2, @Inject(DOCUMENT) private document: any) { }

  ngOnInit(): void {
  }

  topOffset = 0;

  @HostListener('window:scroll', ['$event.target'])
  onScroll(eventTarget: any) {
    const bb = this.elementRef.nativeElement.getBoundingClientRect();

    if (bb.top < 0) {
      this.updateTopOffset(Math.abs(bb.top));
      // this.updateTopOffsetDebounce(Math.abs(bb.top));
    }
    else {
      this.updateTopOffset(0);
      // this.updateTopOffsetDebounce(0);

      // this.resetTopOffsetDelay();
      // this.renderer.setStyle(this.keepInViewElement.nativeElement, 'top', `0`);
      // this.updateTopDelayed(0);
    }
  }

  // private resetTopOffset() {
  //   this.topOffset = 0;
  //   _.delay((x: number) => {
  //     if (x === this.topOffset) {
  //       this.updateTopOffset(x);
  //     }
  //   }, 50);
  // }

  private updateTopOffset(top: number) {
    this.topOffset = top;
    this.renderer.setStyle(this.keepInViewElement.nativeElement, 'top', `${top}px`);
  }
}
