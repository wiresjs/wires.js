var app = app || {};
(function() {
	'use strict';
	app.AuthInterceptor = Wires.Class.extend({
		initialize : function(){},
		call : function(done) {
			
			if ( !localStorage.getItem("auth")  ){
				done()
			} else {
				done();
			}
		}
	});
})();