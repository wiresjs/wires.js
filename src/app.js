var path = require('path');
var express = require('express');

var app = express();
app.set('port', process.env.PORT || 3001);
var router = express.Router();
app.use(router);
app.use('/', express.static(path.join(__dirname, './')));

var domain = require('wires-domain');

var Item = domain.models.BaseModel.extend({
 name : 'items'
});

domain.setAdapter( domain.adapters.File );

domain.rest.Collection.register('/items', {
    handler : domain.resources.ModelResource,
    model   : Item
});

app.use(domain.rest.Service);

app.listen(app.get('port'));
console.log('listening on port:' + app.get('port'));