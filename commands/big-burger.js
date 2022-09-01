const { SlashCommandBuilder } = require('discord.js');

const burger = new SlashCommandBuilder()
	.setName('big-burger')
	.setDescription('Random Burger 🍔!');

exports.BURGER_COMMAND = burger;

const options = {
	method: 'GET',
	url: 'https://foodish-api.herokuapp.com/api/images/burger/',
};

exports.result = async () => {
	const axios = require('axios');

	function burgerError(err) {
		if (err)
			console.error('[Big-Burger] Error: ' + err.message);
		return '🥲 Sorry but no burger has been found 🍔!';
	}

	const burgerResult = await axios.request(options).then(
		response => {
			if (!response)
				return burgerError();
			else
				return response.data.image;
		},
		error => {
			burgerError(error);
		},
	);
	return burgerResult;
};