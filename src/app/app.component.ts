import { Component } from '@angular/core';
import { DatasourceService } from './services/datasource.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  readonly datasource = this.datasourceService.getDataAsDatasource();

  constructor(private datasourceService: DatasourceService){
  }
  
}
