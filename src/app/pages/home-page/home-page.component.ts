import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DatasourceService } from 'src/app/services/datasource.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {

  readonly datasource = this.datasourceService.getDatasource();
  isSmall$: Observable<boolean>;

  constructor(private datasourceService: DatasourceService, private breakpointObs: BreakpointObserver){
    this.isSmall$ = this.breakpointObs.observe([Breakpoints.Small, Breakpoints.XSmall]).pipe(map(x => x.matches))
  }
  ngOnInit(): void {
  }

}
