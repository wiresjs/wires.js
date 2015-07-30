(function(){
   var _history;
   domain.service("$history", function(){
      if ( _history){
         return _history;
      }
      var Instance = Wires.Class.extend({
         initialize : function(){
            var self = this;
            this.events = {};
            window.onpopstate = function(){
               self.trigger("change");
            }
         },
         trigger : function(event){
            if ( _.isArray(this.events[event]) ) {
               _.each(this.events[event], function(cb){
                  cb();
               })
            }
         },
         on : function(event, cb){
            if ( !this.events[event]){
               this.events[event] = [];
            }
            this.events[event].push(cb);
         },
         go : function(url){
            var stateObj = { url : url };
            history.pushState(stateObj, url, url);
            this.trigger("change");
         }
      });
      _history = new Instance();
      return _history;
   })
})();
