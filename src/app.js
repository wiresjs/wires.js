var path = require('path');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.urlencoded({
	extended : false
}));
app.use(bodyParser.json());
// parse application/vnd.api+json as json
app.use(bodyParser.json({
	type : 'application/vnd.api+json'
}));
app.set('port', process.env.PORT || 3001);
var router = express.Router();
app.use(router);
app.use('/', express.static(path.join(__dirname, './')));
var domain = require('wires-domain');
var Item = domain.models.BaseModel.extend({
	name : 'items'
});
domain.setAdapter(domain.adapters.File);
domain.rest.Collection.register('/items', {
	handler : domain.resources.ModelResource,
	model : Item
});
app.use(domain.rest.Service);
app.listen(app.get('port'));
console.log('listening on port:' + app.get('port')); 