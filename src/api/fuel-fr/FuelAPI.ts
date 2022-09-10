import axios from 'axios';
import { DataEconomieGouvResponse, DataEconomieGouvResponseRecord } from 'src/model/DataEconomieGouv';
import { API } from '../../utils/const';

export class FuelAPI {

	refinePrixNom!: string;

	queryValue!: string;

	constructor() {

		this.refinePrixNom = '&refine.prix_nom=';
		this.queryValue = '';
	}

	private fuelError(err?: Error) {
		if (err)
			console.error('[Fuel API] Error: ' + err.message);
		return API.FUEL.ERROR;
	}

	setPrixNom(prixNom: string): void {
		this.refinePrixNom += prixNom;
	}

	setAdresse(address: string): void {
		this.queryValue = 'adresse=' + address;
	}

	setVille(city: string): void {
		this.queryValue = 'ville=' + city;
	}

	setCommune(commune: string): void {
		this.queryValue = 'com_arm_name=' + commune;
	}

	setDepartement(dep: string): void {
		this.queryValue = 'dep_name=' + dep;
	}

	setDepartementCode(depCode: string): void {
		this.queryValue = 'dep_code=' + depCode;
	}

	setRegion(region: string): void {
		this.queryValue = 'reg_name=' + region;
	}

	async getReponse(): Promise<DataEconomieGouvResponseRecord[] | string> {

		const options = {
			method: 'GET',
			url: this.generateURL(),
		};

		return axios.request(options).then(
			(response) => {
				if (!response)
					return this.fuelError();
				else
					return (<DataEconomieGouvResponse>response.data).records;
			},
			(error: Error) => {
				return this.fuelError(error);
			},
		);
	}

	private generateURL(): string {
		let result = API.FUEL.URL + API.FUEL.QUERY + this.queryValue + API.FUEL.ROWS;
		for (const facet of API.FUEL.FACETS) {
			result += facet;
		}
		result += this.refinePrixNom;
		result += API.FUEL.TIMEZONE;
		return result;
	}
}