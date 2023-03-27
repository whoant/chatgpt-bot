const encodeByBase64 = text => {
    return Buffer.from(text).toString('base64')
};

const sleep = (time) => {
    return new Promise(r => setTimeout(r, time));
};

module.exports = { encodeByBase64, sleep };
