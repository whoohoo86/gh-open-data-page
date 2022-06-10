import { AfterViewInit, Component, ElementRef, HostListener, Inject, Input, OnChanges, OnInit, QueryList, Renderer2, SimpleChanges, ViewChildren } from '@angular/core';
import { MatList, MatListItem } from '@angular/material/list';
import { PageScrollService } from 'ngx-page-scroll-core';
import { OpenDataDatasource } from 'src/app/models/datasource';
import * as _ from 'lodash';
import { MarkdownService } from 'ngx-markdown';
import { ComplexInnerSubscriber } from 'rxjs/internal/innerSubscribe';
import { DOCUMENT } from '@angular/common';

interface TocItem {
  fragment: string;
  label: string;
  childs?: TocItem[];
}

@Component({
  selector: 'app-table-of-content',
  templateUrl: './table-of-content.component.html',
  styleUrls: ['./table-of-content.component.scss']
})
export class TableOfContentComponent implements OnInit, OnChanges, AfterViewInit, OnInit {

  private readonly defaultTocItems = [
    // { label: 'Zusammenfassung', fragment: 'abstract' },
    // { label: 'Dateien / Inhalt', fragment: 'content' }
  ];
  tocItems: TocItem[] = [];

  @Input() scrollContainerSelector?: string;
  @Input() datasource?: OpenDataDatasource;
  @ViewChildren('tocItem') tocElements?: QueryList<ElementRef<HTMLAnchorElement>>;
  private activeElement?: HTMLElement;

  constructor(private renderer: Renderer2, private markdownService: MarkdownService, @Inject(DOCUMENT) private document: any) {
  }

  ngAfterViewInit(): void {
    if (this.tocElements && this.tocElements.length > 0) {
      this.activateElement(this.tocElements.first.nativeElement);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.datasource) {
      this.tocItems = [...this.defaultTocItems, ...this.createDocumentationTocItems()];
    }
  }

  ngOnInit(): void {
    this.tocItems = [...this.defaultTocItems, ...this.createDocumentationTocItems()];
  }

  private readonly h2RegEx = /<h2 id="(?<fragment>.*)">(?<title>.*)<\/h2>/g;
  private createDocumentationTocItems() {
    const result = [];
    if (this.datasource) {
      const compiled = this.markdownService.compile(this.datasource.readme);

      let match = this.h2RegEx.exec(compiled);
      do {
        if (match && match.groups && match.groups.title && match.groups.fragment) {
          result.push({ label: match.groups.title, fragment: match.groups.fragment });
        }
      } while ((match = this.h2RegEx.exec(compiled)) !== null);
    }
    return result;
  }

  @HostListener('window:scroll', ['$event.target'])
  onWindowScrolled(eventTarget: any) {
    const scrollContainer = eventTarget.scrollingElement;
    this.cleanup();

    let toActivate = this.tocElements?.first.nativeElement;

    if (this.tocElements) {
      const last = this.tocElements.last;
      for (const tocLinkElem of _.reverse(this.tocElements.toArray())) {

        const targetId = _.last(tocLinkElem.nativeElement.href.split('#'));
        if (targetId) {
          const targetElem = scrollContainer.querySelector(`#${decodeURIComponent(targetId)}`);
 
          if (last === tocLinkElem && this.isInViewport(targetElem)) {
            toActivate = last.nativeElement;
            break;
          }

          if (Math.floor(targetElem.getBoundingClientRect().top) <= 0) {
            toActivate = tocLinkElem.nativeElement;
            break;
          }
        }
      }
    }

    if (toActivate) {
      this.activateElement(toActivate);
    }
  }

  private isInViewport(ele: any) {
    const rect = ele.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (this.document.documentElement.clientHeight) &&
      rect.right <= (this.document.documentElement.clientWidth)
    );
  };

  private activateElement(element: HTMLElement) {
    this.activeElement = element;
    // element.parentElement?.parentElement
    this.renderer.addClass(element.parentElement?.parentElement, 'active');
  }

  private cleanup() {
    if (this.activeElement) {
      this.renderer.removeClass(this.activeElement.parentElement?.parentElement, 'active');
      this.activeElement = undefined;
    }
  }

}
