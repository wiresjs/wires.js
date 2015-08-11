var domain = require('wires-domain');
var express = require('express');
var path = require('path');
var fs = require("fs")
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var app = express();
var swig = require('swig');
app.use(cookieParser('your secret here'));
var wires = require("./index.js")
app.use(bodyParser.json());
		app.use(bodyParser.urlencoded({
			extended: true
		}));

app.all("/views.js", wires.views('./app/views/',{}).express() )

app.use('/app', express.static(__dirname + '/app'));
app.use('/external', express.static(__dirname + '/external'));
app.use('/src', express.static(__dirname + '/src'));
app.use('/dist', express.static(__dirname + '/dist/'));


require('require-all')(__dirname + "/testbackend");
var includeAll = require("wires-include-all");


domain.path(new RegExp('\/.*'),
	function($res) {

		return includeAll( "./src", {
         order: ['essentials/'],
         rootPath : "/src/",
         tagOutput : true
      }).then(function(list){
			var contents = swig.render(fs.readFileSync("./index.html").toString(), {
				locals: { js : list}
			});
			$res.send(contents)
      });
	}
);



// .each(function(index, element){
// 	console.log(element)
// })



app.use(domain.express());

var port = process.env.PORT || 3020;

var server = app.listen(port, function() {

	var host = server.address().address;

	console.log('Example app listening at http://%s:%s', host, port);

});
