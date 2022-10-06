import { ApiFuelResponse } from './ApiFuelResponse';

export interface DataEconomieGouvResponse {
    nhits: number;
    parameters: {
        dataset: string,
        rows: number
        start: number,
        facet: string[]
        format: string,
        timezone: string
    }
    records: DataEconomieGouvResponseRecord[];
}

export interface DataEconomieGouvResponseRecord {
    datasetid: string;
    recordid: string;
    fields: ApiFuelResponse,
    geometry:{
        type: string,
        coordinates:[
            number,
            number
        ]
    }
}