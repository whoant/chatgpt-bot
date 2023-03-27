require('dotenv').config();
const http = require("http");
const { Telegraf } = require('telegraf');
const { sendMessage } = require('./bot/client');
const { fetchResponse } = require('./bot/helpers');

const host = '0.0.0.0';
const port = process.env.PORT || 3000;

const POE_CHATID = process.env.POE_CHATID;
const POE_BOT = process.env.POE_BOT;

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

console.log('Start bot !!');

let isWaitResponse = false;

bot.command('chatgpt', async(ctx) => {
    if (isWaitResponse) {
        return;
    }
    isWaitResponse = true;
    const { text } = ctx.message;
    try {
        const [, ...msg] = text.split(' ');
        const message = msg.join(' ');
        await sendMessage(message, POE_CHATID, POE_BOT);
        const resp = await fetchResponse();
        if (resp !== '') {
            ctx.reply(resp);
        }
    } catch (e) {
        console.error(e);
    }
    isWaitResponse = false;
});

const requestListener = function(req, res) {
    res.writeHead(200);
    res.end("Live !!!!!");
};

const server = http.createServer(requestListener);
server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
