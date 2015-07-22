var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var app = express();
var cookieParser = require('cookie-parser');
var app = express();
var fs = require("fs");

app.use(cookieParser('your secret here'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

app.all(new RegExp(/^\/test.*/), function(req, res){
	res.send(fs.readFileSync('./app/index.html').toString())
});

app.use('/', express.static(path.join(__dirname, './')));
console.log(path.join(__dirname, './'))


var data = [{name : "FromDB"},{name : "Another Value from the service"}]
app.get("/list", function(req, res) {
	res.send(data)
})
app.post("/list", function(req, res) {
	data.push(req.body)
	res.send(req.body)
})

app.listen(8888);
console.log('listening on port:8888');
