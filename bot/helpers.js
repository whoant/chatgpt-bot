require('dotenv').config();
const { fetchMessage } = require('./client');
const { sleep } = require('../utils');

const POE_CHATID = process.env.POE_CHATID;
const POE_BOT = process.env.POE_BOT;

const fetchResponse = async() => {
    let i = 0;
    while (i < 60) {
        const messages = await fetchMessage(POE_CHATID, 2);
        if (messages[0].author === 'human' && messages[1].author === POE_BOT && messages[1].state === 'complete') {
            return messages[1].text;
        }
        await sleep(1000);
        i++;
    }

    return '';
};

module.exports = {
    fetchResponse
};
