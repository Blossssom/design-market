const req = require('request');

let URL = "https://binance.com/api/v3/klines?symbol=BTCUSDT&interval=12h";

const option = {
    url : URL,
    type : "get",
};

req.get(option, function(err, data) {
    if(err) {
        console.log(err);
    }else {
        let chrat_data = data.body;
        let obj_data = JSON.parse(chrat_data);
        let data_set = obj_data;
        console.log(data_set);
    }
})