const express = require('express');
const csv = require('express-csv');
const fs = require('fs');
const app = express();

app.use((req, res, next) => {
    // write your logging code here
    //console.log(new Date(), req.method, req.url);
    //Agent,Time,Method,Resource,Version,Status < turn this into strings

    var agent = req.headers['user-agent'].replace(/,/g, '');
    var time = new Date().toISOString();
    var method = req.method;
    var resource = req.originalUrl;
    var version = 'HTTP/' + req.httpVersion;
    var status = res.statusCode;

    var user = ('\n' + agent + ',' + time + ',' + method + ',' + resource + ',' + version + ',' + status);

    console.log(user);

    fs.appendFile("./server/log.csv", user, (err) => {
        // console.log(user);
        if (err) throw err;
    });

    next();
});

app.get('/', (req, res) => {
    // write your c2ode to respond "ok" here
    res.send('ok');
    app.get('/log', (req, res, ) => {

    });
});
function csvJSON(data) {

    var lines = data.split("\n");

    var result = [];

    var headers = lines[0].split(",");

    for (var i = 1; i < lines.length; i++) {

        var obj = {};
        var currentline = lines[i].split(",");

        for (var j = 0; j < headers.length; j++) {
            obj[headers[j]] = currentline[j];
        }

        result.push(obj);
    }
    return result; //JavaScript object
   // return JSON.stringify(result); //JSON
}
app.get('/logs', (req, res) => {
    // write your code to return a json object containing the log data here
    fs.readFile("./server/log.csv", 'utf-8', (err, data) => {
        if (err) throw err;
        // console.log(data)
        res.json(csvJSON(data));

    });


});

module.exports = app;
