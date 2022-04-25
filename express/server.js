const express = require('express');
const path = require('path');
const app = express();

const http = require('http').createServer(app);
http.listen(8000, function () {
    console.log('server test');
});

app.use('/', express.static(path.join(__dirname, './aikitweb/build')))


app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, "./aikitweb/build/index.html"))
})