import { BurgerAPI } from '@api/burger/BurgerAPI';
import { ApiBurgerReponse } from '@models/api/ApiBurgerResponse';
import { API } from '@utils/const';

const BURGER_API_RESULT = /^https:\/\/foodish-api\.herokuapp\.com\/images\/burger\/burger\d+\..{3,4}$/;

describe('Burger Module', () => {

	test('Test Big-Buger', async () => {
		const api = new BurgerAPI();
		const response = await api.getReponse();
		expect((<ApiBurgerReponse>response).image).toMatch(BURGER_API_RESULT);
	});

	test('Test Big-Buger [Error]', async () => {
		const api = new BurgerAPI();
		const response = await api.getReponse(true);
		expect(<string>response).toMatch(API.BURGER.ERROR);
	});
});