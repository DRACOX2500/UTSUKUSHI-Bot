
const ping = {
    name: 'ping',
    description: 'Replies with Pong!',
};

exports.PING_COMMAND = ping;

exports.result = (client) => {

    function getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }

    if(getRandomInt(5) == 1)
        return `🏓🔥 SMAAAAAAAAAAAAAAAAASH! (${Math.round(client.ws.ping)}ms)`;
    else
        return `🏓 Pong! (${Math.round(client.ws.ping)}ms)`;
};