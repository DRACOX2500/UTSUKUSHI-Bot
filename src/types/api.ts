export interface ApiFuelResponse {
	id: string;
	prix_id: string;
	pop: string;
	reg_code: string;
	reg_name: string;
	horaires_automate_24_24: string;
	com_arm_name: string;
	adresse: string;
	cp: string;
	dep_code: string;
	ville: string;
	services_service: string | null;
	dep_name: string;
	epci_name: string;
	geom: [number, number];
	prix_valeur: number;
	prix_name: string;
	prix_maj: Date;
}

export interface DataEconomieGouvResponseRecord {
	datasetid: string;
	recordid: string;
	fields: ApiFuelResponse;
	geometry: {
		type: string;
		coordinates: [number, number];
	};
}

export interface DataEconomieGouvResponse {
	nhits: number;
	parameters: {
		dataset: string;
		rows: number;
		start: number;
		facet: string[];
		format: string;
		timezone: string;
	};
	records: DataEconomieGouvResponseRecord[];
}