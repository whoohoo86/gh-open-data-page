import { Component, Input, OnInit } from '@angular/core';
import { OpenDataDatasource } from 'src/app/models/datasource';

@Component({
  selector: 'app-datasource-links',
  templateUrl: './datasource-links.component.html',
  styleUrls: ['./datasource-links.component.scss']
})
export class DatasourceLinksComponent implements OnInit {

  @Input() datasource?: OpenDataDatasource;

  constructor() { }

  ngOnInit(): void {
  }

}
