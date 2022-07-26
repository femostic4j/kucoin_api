const {
    createSign,
    createHmac,
} = require('node:crypto');
require('dotenv').config();
const axios = require("axios");

// const endpoint = "https://api.kucoin.com/api/v1/accounts";
const depositEndpoint = "https://api.kucoin.com/api/v2/deposit-addresses?currency=BTC"
const withdrawEndpoint = "https://api.kucoin.com/api/v1/withdrawals"

const key = process.env.API_KEY; //Get Kucoin API key from environment file
const secret = process.env.API_SECRET; //Get Kucoin API secret from environment file
const passphrase = process.env.API_PASSPHRASE; //Get Kucoin API passphrase from environment file

const timestamp = Date.now().toString();
console.log("TIMESTAMP: ", timestamp);
const prehash_string = `${
    timestamp + "GET" + "/api/v2/deposit-addresses?currency=BTC" + ""
    }`;
const version = "2";

// Encrypt passphrase
const passphraseHash = createHmac('sha256', secret)
    .update(passphrase)
    .digest('base64');
// const encPassphrase = passphraseHash.toString(CryptoJS.enc.Base64);
console.log("PASSPHRASE: ", passphraseHash);

const signature = createHmac('sha256', secret)
    .update(prehash_string)
    .digest('base64');

const headers = {
    "Content-Type": "application/json",
    "KC-API-TIMESTAMP": `${timestamp}`,
    "KC-API-SIGN": `${signature}`,
    "KC-API-KEY": `${key}`,
    "KC-API-PASSPHRASE": `${passphraseHash}`,
    "KC-API-KEY-VERSION": `${version}`,
};

const kucoinData = () => {
    const getKucoinData = async () => {
        await axios
            .get(depositEndpoint, {
                headers: headers,
            }).then(res => console.log("RESPONSE", res.data)).catch(error => console.log("ERROR", error.message))

    }
    return getKucoinData()
}

// const { data } = await axios.get(endpoint, { headers: headers }).catch(e => console.log(e));
// console.log(data);


module.exports = { kucoinData }