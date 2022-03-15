import { ScrollDispatcher } from '@angular/cdk/scrolling';
import { DOCUMENT } from '@angular/common';
import { AfterViewInit, Directive, ElementRef, HostListener, Inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import { fromEvent } from 'rxjs';

@Directive({
  selector: '[onScrollIntoView]'
})
export class onScrollIntoViewDirective implements AfterViewInit {

  constructor(private elementRef: ElementRef, @Inject(DOCUMENT) private document: any) { 
    
  }

  ngAfterViewInit(): void {
    // const containers = this.sd.getAncestorScrollContainers(this.elementRef);
    // console.log("CONTAINERS", this.elementRef, containers);
    
  }

  private currentPosition = 0;

  @HostListener('scroll', ['$event.target']) 
  onScroll(e: any) {
    let scroll = e.scrollingElement.scrollTop;
    console.log("this is the scroll position", scroll)
    if (scroll > this.currentPosition) {
      console.log("scrollDown");
    } else {
      console.log("scrollUp");
    }
    this.currentPosition = scroll;
  }



  // @HostListener("window:scroll", ['$event'])
  onWindowScroll(event: Event) {
    // if (this.tocLinkElements) {
    //   for (let elem of this.tocLinkElements) {
    //     const targetId = _.last(elem.href.split('#'));
    //     const scrollContainer = event.currentTarget as HTMLElement;
    //     const target = scrollContainer.querySelector(`#${targetId}`);
    //     if (target) {
    //       const targetTop = target.getBoundingClientRect().top;
    //       console.log("SCROLL :: ITEM - ", targetTop, scrollContainer.scrollTop);
    //       if (targetTop > 0) {
    //         this.renderer.addClass(elem, 'active');
    //       }
    //     }

    //     // let top = .destination.getBoundingClientRect().top;
    //     // if (top > 0 && top < 25) {
    //     //   this._cleanCurrentLink();
    //     //   this._setCurrentLink(elem.link);
    //     //   break;
    //     // }
    //   }
    // }
  }

  private registerListener(container: ElementRef<HTMLElement>) {
    if(container){
      
      // container.nativeElement.onscroll(() => {
      //   return null;
      // })
    }
  }

}
