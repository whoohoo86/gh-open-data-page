import { Component, OnInit } from '@angular/core';
import { DatasourceService } from 'src/app/services/datasource.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {

  readonly datasource = this.datasourceService.getDataAsDatasource();

  constructor(private datasourceService: DatasourceService){
  }
  ngOnInit(): void {
  }

}
