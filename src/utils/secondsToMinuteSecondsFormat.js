module.exports.minuteSecondsFormater = (seconds) => {

	const min = Math.floor(seconds / 60);
	const sec = seconds % 60;

	function padTo2Digits(num) {
		return num.toString().padStart(2, '0');
	}
	return `${padTo2Digits(min)}:${padTo2Digits(sec)}`;
};