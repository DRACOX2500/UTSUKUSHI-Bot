import { type DataEconomieGouvResponse } from '../../types/api';
import { HttpService } from '../../services/http-service';
import { type BotChoice } from '../../core/types/bot-interaction';

enum FuelEnum {
    Gazole,
	SP98,
	SP95,
	E85,
	E10,
	GPLc,
}

export type Fuel = keyof typeof FuelEnum;

enum FuelSearchEnum {
    ADDRESS = 0,
	CITY = 1,
	COMMUNE = 2,
	DEPARTMENT_NAME = 3,
	DEPARTMENT_CODE = 4,
	REGION = 5,
}

export type FuelSearch = keyof typeof FuelSearchEnum;

const QUERY = [
	'adresse=',
	'ville=',
	'com_arm_name=',
	'dep_name=',
	'dep_code=',
	'reg_name=',
];

const LIMIT = 3;

const API = {
	URL: 'https://data.economie.gouv.fr/api/records/1.0/search/?dataset=prix-carburants-fichier-instantane-test-ods-copie',
	QUERY: {
		ROWS: `rows=${LIMIT}`,
		Q: 'q=',
		FACETS: [
			'facet=id',
			'facet=adresse',
			'facet=ville',
			'facet=prix_maj',
			'facet=prix_nom',
			'facet=com_arm_name',
			'facet=epci_name',
			'facet=dep_name',
			'facet=reg_name',
			'facet=services_service',
			'facet=horaires_automate_24_24',
			'facet=dep_code',
		],
		REFINE: 'refine.prix_nom=',
		TIMEZONE: 'timezone=Europe/Paris',
	},
	ERROR: '🥲 Sorry but no fuel has been found ⛽!',
};

export class FuelApiService {

	static get fuels(): Fuel[] {
		const keys: Fuel[] = [];
		for (const key in FuelEnum) {
			if (isNaN(Number(key))) {
				keys.push(key as Fuel);
			}
		}
		return keys;
	}

	static get fuelsChoices(): BotChoice[] {
		return FuelApiService.fuels.map(_fuel => ({
			name: _fuel,
			value: _fuel,
		}));
	}

	static getFuel(fuel: keyof typeof FuelEnum = 'Gazole'): FuelEnum {
		return FuelEnum[fuel];
	}

	static get fuelsSearchChoices(): Array<{ name: FuelSearch, value: number }> {
		const choices: Array<{ name: FuelSearch, value: number }> = [];
		for (const key in FuelSearchEnum) {
			if (isNaN(Number(key))) {
				choices.push({
					name: key as FuelSearch,
					value: +FuelSearchEnum[key],
				});
			}
		}
		return choices;
	}

	static getFuelSearch(fuelSearch: keyof typeof FuelSearchEnum = 'CITY'): FuelSearchEnum {
		return FuelSearchEnum[fuelSearch];
	}

	static async search(fuel: Fuel, search: number, value: string): Promise<DataEconomieGouvResponse> {

		const url = [
			API.URL,
			`${API.QUERY.Q}${QUERY[search]}${value}`,
			API.QUERY.ROWS,
			API.QUERY.FACETS.join('&'),
			`${API.QUERY.REFINE}${fuel}`,
			API.QUERY.TIMEZONE,
		].join('&');

		return await HttpService.get<DataEconomieGouvResponse>(encodeURI(url));
	}
}