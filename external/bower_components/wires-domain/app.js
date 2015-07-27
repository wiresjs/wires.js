var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var app = express();
var cookieParser = require('cookie-parser');
var app = express();


app.use(cookieParser('your secret here'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use('/', express.static(path.join(__dirname, './')));



app.listen(8888);
console.log('listening on port:8888');
