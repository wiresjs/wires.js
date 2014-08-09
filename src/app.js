var path = require('path');
var express = require('express');

var app = express();
app.set('port', process.env.PORT || 3001);
var router = express.Router();
app.use(router);
app.use('/', express.static(path.join(__dirname, './')));


var items = [ {id : 1, name : 'Book'}, {id : 2, name : 'Pen'} ]


router.get('/events', function(req, res, next) {
	res.send(1)
	  //next();
	});
//router.get('/items', function(req, res){
//	res.send(items)
//})
app.listen(app.get('port'));
console.log('listening on port:' + app.get('port'));