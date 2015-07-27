(function(){
   var _counter = 1;
   //  Unique id  helper
   Object.defineProperty(Object.prototype, "__uniqueId", {
      writable : true
   });
   Object.defineProperty(Object.prototype, "uniqueId", {
      get : function() {
         if (this.__uniqueId == undefined)
            this.__uniqueId = _counter++;
         return this.__uniqueId;
      }
   });
})();
