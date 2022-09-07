/* eslint-disable @typescript-eslint/no-explicit-any */
import { SlashCommandBuilder } from 'discord.js';
import { BURGER_ERROR } from '../../utils/const';
import axios from 'axios';

const options = {
	method: 'GET',
	url: 'https://foodish-api.herokuapp.com/api/images/burger/',
};

export class BigBurgerCommand {

	static readonly slash = new SlashCommandBuilder()
		.setName('big-burger')
		.setDescription('Random Burger 🍔!');

	static readonly result = async (test_error = false): Promise<string> => {

		function burgerError(err?: Error) {
			if (err)
				console.error('[Big-Burger] Error: ' + err.message);
			return BURGER_ERROR;
		}

		return axios.request(options).then(
			(response: any) => {
				if (!response || test_error)
					return burgerError();
				else
					return response.data.image;
			},
			(error: Error) => {
				return burgerError(error);
			},
		);
	};
}