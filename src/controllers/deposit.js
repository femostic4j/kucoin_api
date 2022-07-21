const {
    createSign,
    createHmac,
  } = require('node:crypto');
const axios = require("axios");

// const endpoint = "https://api.kucoin.com/api/v1/accounts";
const depositEndpoint ="https://api.kucoin.com/api/v2/deposit-addresses?currency=BTC"
const withdrawEndpoint ="https://api.kucoin.com/api/v1/withdrawals"
const key = "62c84ec85f44740001ea34b1";
const secret = "f2924067-2442-4489-8606-f0b324d487a5";
const passphrase = "taxwhaleapp";
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

const getKucoinData = async () => {
    await axios
        .get(depositEndpoint, {
            headers: headers,
        }).then(res => console.log("RESPONSE", res.data)).catch(error => console.log("ERROR", error.message))
}

// const { data } = await axios.get(endpoint, { headers: headers }).catch(e => console.log(e));
// console.log(data);

getKucoinData()