var path = require('path');
var express = require('express');

var app = express();
app.set('port', process.env.PORT || 3000);

app.use('/', express.static(path.join(__dirname, './')));

app.listen(app.get('port'));
console.log('listening on port:' + app.get('port'));