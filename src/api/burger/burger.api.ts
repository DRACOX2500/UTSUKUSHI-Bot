import { API } from 'src/constant';
import { ApiBurgerReponse } from '@models/api/api-burger-response.model';
import axios from 'axios';
import { logger } from '@modules/system/logger/logger';

/**
 * @deprecated burger API is deprecated
 * TODO : delete or update this class
 */
export class BurgerAPI {
	private burgerError(err?: Error) {
		if (err) logger.error({ tag: 'Big-Burger-API' }, err.message);
		return API.BURGER.ERROR;
	}

	async getReponse(test_error = false): Promise<ApiBurgerReponse | string> {
		const options = {
			method: 'GET',
			url: API.BURGER.URL,
		};

		return axios.request(options).then(
			(response) => {
				if (!response || test_error) return this.burgerError();
				else return <ApiBurgerReponse>response.data;
			},
			(error: Error) => {
				return this.burgerError(error);
			}
		);
	}
}
