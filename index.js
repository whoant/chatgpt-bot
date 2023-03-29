const fs = require('fs');
const login = require("facebook-chat-api");
const { sendMessage } = require('./bot/client');
const { fetchResponse } = require('./bot/helpers');
const http = require('http');
const { convertCookieToAppState } = require('./utils');

const POE_CHATID = process.env.POE_CHATID;
const POE_BOT = process.env.POE_BOT;
const FACEBOOK_COOKIE = process.env.FACEBOOK_COOKIE;

const host = '0.0.0.0';
const port = process.env.PORT || 3000;

const credential = {
    appState: convertCookieToAppState(FACEBOOK_COOKIE),
};

let isWaitResponse = false;

login(credential, (err, api) => {
    if (err) return console.error(err);

    api.listenMqtt(async(err, event) => {
        switch (event.type) {
            case "message":
                const [cmd, ...messages] = event.body.split(' ');
                if (cmd === '/chatgpt') {
                    if (isWaitResponse) {
                        return;
                    }
                    isWaitResponse = true;
                    try {
                        const message = messages.join(" ");
                        console.log(`From : ${event.senderID} with message: ${message}`);
                        await sendMessage(message, POE_CHATID, POE_BOT);
                        const resp = await fetchResponse();
                        if (resp !== '') {
                            api.sendMessage(resp, event.threadID);
                        }
                    } catch (e) {
                        console.error(e);
                    }
                    isWaitResponse = false;
                }
        }
    });
});

const requestListener = function(req, res) {
    res.writeHead(200);
    res.end("Live !!!!!");
};

const server = http.createServer(requestListener);
server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});

