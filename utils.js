const encodeByBase64 = text => {
    return Buffer.from(text).toString('base64')
};

const sleep = (time) => {
    return new Promise(r => setTimeout(r, time));
};

const convertCookieToAppState = (j2TeamCookie) => {
    const { cookies } = JSON.parse(j2TeamCookie);
    return cookies.map(cookie => {
        return { ...cookie, key: cookie.name }
    });
};

module.exports = { encodeByBase64, sleep, convertCookieToAppState };
