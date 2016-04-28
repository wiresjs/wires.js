var express = require('express');
var realm = require('realm-js');
var app = express();

app.use('/', express.static(__dirname + '/dist'));
app.use('/bower_components', express.static(__dirname + '/bower_components'));
app.use('/realm.js', realm.serve.express());
app.use('/angular', express.static(__dirname + '/angular-compare'));

require(__dirname + "/dist/build.js")
realm.require('wires.compiler.SchemaGenerator', function(generator) {
	app.use('/views.js', generator.express(__dirname + "/views/"));

})
var port = process.env.PORT || 3021;
var server = app.listen(port, function() {
	var host = server.address().address;
	console.log('Example app listening at http://%s:%s', host, port);
});
