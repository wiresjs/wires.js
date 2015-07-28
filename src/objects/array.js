domain.service("$array", function(){
   return function(a, b){
      var opts;
      var array;
      if ( _.isArray(a) ){
         array = a;
         opts = b || {};
      } else {
         array = [];
         opts = _.isPlainObject(b) ? b : {};
      }

      // Array has been already initialized
      if ( array.$watch)
         return array;

      array.$arrayWatchers = [];
      array.$watch = function(cb){
         array.$arrayWatchers.push(cb);
         return {
            // Detaching current callback
            detach : function(){
               console.log("wacher detached")
               var index = array.$arrayWatchers.indexOf(cb);
               array.$arrayWatchers.splice(index, 1);

               delete cb;
            }
         }
      }

      var notify = function(){
         var args = arguments;
         _.each(array.$arrayWatchers, function(watcher){
            if ( watcher ){
               watcher.apply(null, args);
            }
         })
      }
      // Watching variable size
      array.size = array.length;

      // overriding array properties
      array.push = function(target){
			var push = Array.prototype.push.apply(this, arguments);
         notify('push', target)
         array.size = array.length;
         return push;
      }
      // Splicing (removing)
      array.splice = function(index, howmany){

         notify('splice', index, howmany);
         var sp = Array.prototype.splice.apply(this, arguments);
         array.size = array.length;
         return  sp;
      }
      // Convinience methods
      array.$remove = function(index){
         return this.splice(index, 1);
      }
      array.$add = function(item){
         return this.push(item)
      }


      return array;
   }
})
