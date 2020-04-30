const fetch = require("node-fetch");
const bodyParser = require('body-parser');

const requestCovidAPI = (url, cb) => {
    url = String(url);
    if (url.startsWith("/")){
        url = url.slice(1)
    }
    const base_url = "https://crnzwhack.herokuapp.com/"
    fetch(base_url + url, {

    })
    .then(res => res.json())
    .then(cb)
    .catch(err => {
        console.log(err);
    })
}

module.exports = {
    requestCovidAPI
}
