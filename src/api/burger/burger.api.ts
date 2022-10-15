import { API } from '@utils/const';
import { ApiBurgerReponse } from '@models/api/api-burger-response.model';
import axios from 'axios';
import { red } from 'ansicolor';

export class BurgerAPI {
	private burgerError(err?: Error) {
		if (err) console.error(red(`[Big-Burger] Error: ${err.message}`));
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
