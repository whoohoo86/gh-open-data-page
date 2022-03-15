import { AfterViewInit, Component, ElementRef, HostListener, Input, OnChanges, OnInit, QueryList, Renderer2, SimpleChanges, ViewChildren } from '@angular/core';
import { MatListItem } from '@angular/material/list';
import { PageScrollService } from 'ngx-page-scroll-core';
import { OpenDataDatasource } from 'src/app/models/datasource';
import * as _ from 'lodash';
import { MarkdownService } from 'ngx-markdown';
import { ComplexInnerSubscriber } from 'rxjs/internal/innerSubscribe';

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
    { label: 'Zusammenfassung', fragment: 'abstract' },
    { label: 'Schlagwörter', fragment: 'tags' },
    { label: 'Zitieren', fragment: 'cite' },
    { label: 'Lizenz', fragment: 'licence' },
    { label: 'Datenquellen', fragment: 'links' },
    { label: 'Dateien / Inhalt', fragment: 'content' }
  ];
  tocItems: TocItem[] = [];

  @Input() scrollContainerSelector?: string;
  @Input() datasource?: OpenDataDatasource;
  @ViewChildren('tocItem') tocLinkElements?: QueryList<ElementRef<HTMLAnchorElement>>;
  private activeElement?: HTMLElement;

  constructor(private renderer: Renderer2, private markdownService: MarkdownService) {
  }
  ngAfterViewInit(): void {
    if (this.tocLinkElements && this.tocLinkElements.length > 0) {
      console.log("initial activation");
      this.activateElement(this.tocLinkElements.first.nativeElement);
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

    if (this.tocLinkElements) {
      for (let tocLinkElem of this.tocLinkElements) {
        const targetId = _.last(tocLinkElem.nativeElement.href.split('#'));
        const targetElem = scrollContainer.querySelector(`#${targetId}`);
        const targetElemBB = targetElem.getBoundingClientRect();
        const targetTop = targetElemBB.top;

        if (targetTop > 0) {
          this.activateElement(tocLinkElem.nativeElement);
          break;
        }
      }
    }
  }

  private activateElement(element: HTMLElement) {
    this.activeElement = element;
    this.renderer.addClass(element, 'active');
  }

  private cleanup() {
    if (this.activeElement) {
      this.renderer.removeClass(this.activeElement, 'active');
      this.activeElement = undefined;
    }

  }

}
