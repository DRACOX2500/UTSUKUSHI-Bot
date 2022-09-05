const { SlashCommandBuilder } = require('discord.js');

const burger = new SlashCommandBuilder()
	.setName('big-burger')
	.setDescription('Random Burger 🍔!');

const BURGER_ERROR = '🥲 Sorry but no burger has been found 🍔!';

exports.BURGER_COMMAND = burger;
exports.BURGER_ERROR = BURGER_ERROR;

const options = {
	method: 'GET',
	url: 'https://foodish-api.herokuapp.com/api/images/burger/',
};

exports.result = async (test_error) => {
	const axios = require('axios');

	function burgerError(err) {
		if (err)
			console.error('[Big-Burger] Error: ' + err.message);
		return BURGER_ERROR;
	}

	const burgerResult = await axios.request(options).then(
		response => {
			if (!response || test_error)
				return burgerError();
			else
				return response.data.image;
		},
		error => {
			return burgerError(error);
		},
	);
	return burgerResult;
};