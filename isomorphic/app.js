var path = require('path');
var express = require('express');
var backbone = require('backbone');
var wires = require('./wires');
var app = express();
app.set('port', process.env.PORT || 3000);

app.use(new wires.Exposer({
	url : '/wires/',
	path : './wires'
}).express);

app.use(new wires.Exposer({
	url : '/exposed/',
	path : './app'
}).express);

app.use('/', express.static(path.join(__dirname, './app')));
app.use('/node_modules', express.static(path.join(__dirname, './node_modules')));

app.listen(app.get('port'));
