var domain = require('wires-domain');
var express = require('express');
var path = require('path');
var fs = require("fs")
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var app = express();
var swig = require('swig');
app.use(cookieParser('your secret here'));

app.use('/app', express.static(__dirname + '/app'));
app.use('/external', express.static(__dirname + '/external'));
app.use('/src', express.static(__dirname + '/src'));




domain.path(new RegExp('\/.*'),
	function($res, $includeAll) {


		return $includeAll( "./src", {
         order: ['essentials/','app.js'],
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




require("wires-include-all")
app.use(domain.express());

var port = process.env.PORT || 3020;

var server = app.listen(port, function() {

	var host = server.address().address;

	console.log('Example app listening at http://%s:%s', host, port);

});
