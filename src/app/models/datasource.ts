export interface Datasource {
    id: string;
    branch: string;
    name: string;
    description: string;

    licence: string;
    tags: string[];
    doi: string;
    lastUpdated: Date;
    contributors: Contributor[];
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