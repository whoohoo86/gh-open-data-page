# Github Opendata Webpage

Dieses Repository stellt den Quellcode für das Erzeugen und Veröffentlichen der Github Opendata Webpage bereit. Die Github Opendata Webpage erstellt auf Basis eines Github-Repositories eine Webseite um offene Daten und deren Dokumentation einfach Erfassbar macht und das Herunterladen von Dateien vereinfacht. Dabei handelt es sich um eine Angular-Webpage, welche als Datenbasis eine [Datei](#daten) nutzt und somit ohne Backend auskommt und dadaruch einfach wiederverwendbar ist. Das Github-Repositoriy, welches die offenen Daten bereitstellt unterliegt dabei einigen [Voraussetzungen](#Voraussetzungen). Sollten Sie in betracht ziehen, diese Webpage zu nutzen um ihre eigenen offen Daten einfacher Zugreifbar zu machen, dann kontaktieren sie uns gerne unter [mf4@rki.de](mailto:mf4@rki.de) oder via Github-Issues.

## Voraussetzungen

1. Es handelt sich um offene Daten, welche in einem Github-Repository bereitgestellt werden.
1. Es liegt eine Zenodo.json Datei vor und beinhaltet 
    1. Den Namen der offenen Daten (zenodo.title)
    1. Das Datum der letzten Aktualiserung (zenodo.publication_date)
    1. Die Autoren (zenodo.creators)
    1. Beitragende mit dazugehöriger Rolle (zenodo.contributors)
    1. Eine kurze Beschreibung, warum es diese Datenquelle gibt und welche Daten enthalten sind (zenodod.descriptions)
    1. Schlagwörter (zenodo.keywords)
1. Es existiert ein Readme.md mit ausführlicher Dokumentation der Daten
1. Es ist eine Lizenz in dem Reposiotory hinterlegt
1. (optional) Die Homepage des Repositories ist eine doi von Zenodo => externer Link auf Zenodo 

## Daten

Alle Daten der Webseite sind in der app/data/datasource.json gespeichert. Diese wird mit Hilfe der [Github-Action](#createDatasourceJsonAction) erzeugt und hat folgende Struktur:

```typescript
export interface OpenDataDatasource {
    id: string;
    branch: string;
    name: string;
    description: string;

    licence: string;
    tags: string[];
    doi: string;
    lastUpdated: Date;
    contributors: { name: string; role: string }[];
    authors: string[];
    externalLinks: ExternalLink[];
    readme: string;

    content: DatasourceContent[];
}

export interface ExternalLink {
    $type: 'github' | 'zenodo';
    url: string;
}

export interface Contributor {
    name: string;
    role: string;
}

export interface FileDatasourceContent {
    $type: 'file';
    name: string;
    path: string;
    previewUrl: string;
    downloadUrl: string;
    visitUrl: string;
    lfs: boolean;
}

export interface FolderDatasourceContent {
    $type: 'folder';
    name: string;
    path: string;

    content: DatasourceContent[];
}

export type DatasourceContent = FileDatasourceContent | FolderDatasourceContent;
```

## Github-Action

Besteht aus zwei Github-Actions. Zum Einen die action.yml, welche alle nötigen Schritte ausführt um die Github Opendata Webpage für eigene Repositories zu bauen und deployen. Zum Anderen aus eigener selbst geschriebenen Action, welche die benötigte datasource.json auf Basis eines Github Repositories erzeugt. Damit diese Action erfolgreich ausgeführt werden kann, müssen die oben genannten [Voraussetzungen](#voraussetzungen) erfüllt sein.

### action.yml

Die action.yml kann genutzt werden um die Github Opendata Webpage für eigene Repositories zu erzeugen und zu deployen. Dazu führt sie 4 Schritte aus:

1. Pullen dieses Repositories (Opendata Webpage)
2. Node installieren
3. Erzeugen der [datasource.json](#createDatasourceJsonAction)
4. Build und Deploy der Opendata Webpage (nutzt [angular-cli-ghpages](https://github.com/angular-schule/angular-cli-ghpages))

| Input          | Required | Default    | Beschreibung                                                                                                                            |
| -------------- | -------- | ---------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| GH_TOKEN       | true     | $          | Ein Github Token, welches Zugriff auf das Repository hat. Dieses wird benötigt, um die datasource.json über die Github-API zu erzeugen. |
| WEBSITE_BRANCH | false    | "gh-pages" | Der Name des Branchs, in den die Webseite deployt wird.                                                                                  |

### createDatasourceJsonAction

Diese Action ist für das Erstellen der datasource.json (/src/app/data/datasource.json) verantwortlich und wird vom der action.yml aufgerufen. Der Quellcode dieser Actions befindet sich in /src/github-action. Sie führt folgende Schritte aus:

1. Authentifizerung an Github-API mittels GH_TOKEN
2. Abfragen des Repositories, aus welchem heraus die Action aufgerufen wurde
3. Hinzufügen des externen Zenodo-Links, sofern Zenodo-Doi in Webseite eingetragen ist
4. Abfragen der Dateien des Repositories
5. Parsen und Einlesen der zenodo.json um die in [Voraussetzungen](#voraussetzungen) beschriebenen Daten zu extrahieren
6. Einlesen der Dokumentation aus der Readme.md
7. Lizenz auslesen
8. Schreiben der datasource.json nach `./src/app/data/datasource.json`.
