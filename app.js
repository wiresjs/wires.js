var express = require('express');
var app = express();

app.use('/', express.static(__dirname + '/src'));
app.use('/bower_components', express.static(__dirname + '/bower_components'));

var port = process.env.PORT || 3021;
var server = app.listen(port, function() {
	var host = server.address().address;
	console.log('Example app listening at http://%s:%s', host, port);
});
