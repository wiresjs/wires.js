(function() {
   domain.service("Proxy", function() {
      return Wires.Class.extend({
         initialize: function() {
            this.callbacks = [];
            this._changed = 1;
            this.init();
         },
         init : function(){

         },
         // _changed variable is beeing watch by $evaluate
         // So any access to this variable should provoke node's re-render
         update : function(){
            this._changed = 1;
         },
         addCallback: function(cb, path) {

            var callback = cb.bind({
               proxy: this,
               path: path
            });
            this.callbacks.push(callback);
            callback(null, this.get(path));
         },
         get : function(key){

         }
      })
   })
})();
