require('dotenv').config();
const axios = require('axios');
const POE_FORMKEY = process.env.POE_FORMKEY;
const POE_COOKIE = process.env.POE_COOKIE;


axios.interceptors.request.use(function(config) {
    config.headers = {
        ...config.headers,
        "content-type": "application/json",
        "poe-formkey": POE_FORMKEY,
        "cookie": POE_COOKIE,
    }
    return config;
}, function(error) {
    return Promise.reject(error);
});

// Add a response interceptor
axios.interceptors.response.use(function(response) {
    const { data } = response;
    if (data.errors) return Promise.reject(data);
    return data;
}, function(error) {
    return Promise.reject(error);
});

module.exports = axios;
