(function(){
   Object.defineProperty(Object.prototype, "watch", {
   	enumerable : false,
   	configurable : true,
   	writable : false,
   	value : function(prop, handler) {
   		var oldval = this[prop], newval = oldval, getter = function() {
   			return newval;
   		}, setter = function(val) {
   			oldval = newval;
   			return newval = handler.call(this, prop, oldval, val);
   		};
   		if (delete this[prop]) { // can't watch constants
   			Object.defineProperty(this, prop, {
   				get : getter,
   				set : setter,
   				enumerable : true,
   				configurable : true
   			});
   		}
   	}
   });


   Object.defineProperty(Object.prototype, "unwatch", {
   	enumerable : false,
   	configurable : true,
   	writable : false,
   	value : function(prop) {
   		var val = this[prop];
   		delete this[prop]; // remove accessors
   		this[prop] = val;
   	}
   });

   var lastTime = 0;
   var vendors = ['ms', 'moz', 'webkit', 'o'];
   for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
      window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
      window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
                                  || window[vendors[x]+'CancelRequestAnimationFrame'];
   }

   if (!window.requestAnimationFrame)
      window.requestAnimationFrame = function(callback, element) {
           var currTime = new Date().getTime();
           var timeToCall = Math.max(0, 16 - (currTime - lastTime));
           var id = window.setTimeout(function() { callback(currTime + timeToCall); },
             timeToCall);
           lastTime = currTime + timeToCall;
           return id;
      };

   if (!window.cancelAnimationFrame)
      window.cancelAnimationFrame = function(id) {
           clearTimeout(id);
      };

   window.$defered = function(cb){
      window.requestAnimationFrame(function(){
         cb();
      });
   }
})();
