import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, HostListener, Inject, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import * as _ from 'lodash';
import { isBuffer } from 'lodash';

@Component({
  selector: 'app-keep-in-view',
  templateUrl: './keep-in-view.component.html',
  styleUrls: ['./keep-in-view.component.scss']
})
export class KeepInViewComponent implements OnInit {

  @Input() topOffset: number = 0;

  @ViewChild('keepInView') keepInViewElement!: ElementRef;
  updateTopOffsetDebounce = _.debounce(x => this.updateTop(x), 30, { maxWait: 100 });

  constructor(private elementRef: ElementRef, private renderer: Renderer2, @Inject(DOCUMENT) private document: any) { }

  ngOnInit(): void {
  }

  top = 0;

  @HostListener('window:scroll', ['$event.target'])
  onScroll(eventTarget: any) {
    const bb = this.elementRef.nativeElement.getBoundingClientRect();

    if (bb.top < 0) {
      this.updateTop(Math.abs(bb.top));
    }
    else {
      this.updateTop(0);
    }
  }

  private updateTop(top: number) {
    this.top = top;
    this.renderer.setStyle(this.keepInViewElement.nativeElement, 'top', `${this.topOffset + top}px`);
  }
}
