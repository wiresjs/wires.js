(function(){
   var _history;
   domain.service("$history", function(){
      if ( _history){
         return _history;
      }
      var Instance = Wires.Class.extend({
         initialize : function(){
            var self = this;
            window.onpopstate = function(){
               self.trigger("change");
            }
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
