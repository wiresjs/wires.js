var realm = require('realm-js');
var server = require('realm-server');

require("./build/backend.js");
require("./build/universal.js");
require("./build/app/backend.js")
require("./build/app/universal.js")
realm.start('app.TestInflate');
