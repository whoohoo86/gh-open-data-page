import { Injectable } from '@angular/core';
import data from '../data/datasource.json';
import { Datasource, DatasourceContent, ExternalLink } from '../models/datasource';

@Injectable({
  providedIn: 'root'
})
export class DatasourceService {

  constructor() { }

  getDataAsDatasource(): Datasource {
    return { ...data, lastUpdated: new Date(data.lastUpdated), externalLinks: data.externalLinks as ExternalLink[], content: data.content as DatasourceContent[] };
  }
}
