const { SlashCommandBuilder } = require('discord.js');

const burger = new SlashCommandBuilder()
	.setName('big-burger')
	.setDescription('Random Burger 🍔!');

exports.BURGER_COMMAND = burger;

exports.result = () => {
	const axios = require('axios');

	const options = {
		method: 'GET',
		url: 'https://foodish-api.herokuapp.com/api/images/burger/',
	};

	axios.request(options).then(function(response) {
		console.log(response.data);
		return response.data;

	}).catch(function(error) {
		console.error(error);
		return null;
	});
};