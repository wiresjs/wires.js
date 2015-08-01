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

      var watchers  = [];


      var notify = function(){
         var args = arguments;
         _.each(watchers, function(watcher){
            if ( watcher ){
               watcher.apply(null, args);
            }
         })
      }


      array.$watch = function(cb){
         watchers.push(cb);
         return {
            // Detaching current callback
            detach : function(){
               var index = watchers.indexOf(cb);
               watchers.splice(index, 1);

               delete cb;
            }
         }
      }
      // clean up array
      array.$removeAll = function(){
         array.splice(0, array.length);
      }

      array.$empty = function(){
         this.$removeAll();
      }

      // Completely destroys this.array
      // Removes all elements
      // Detaches all watchers
      array.$destroy = function(){
         array.$removeAll();
         _.each(watchers, function(watcher){
            delete watcher;
         })
         watchers = undefined;
         delete array
      }
      // Adding new value to array
      array.$add = function(target){

         if (_.isArray(target) ){
            _.each(target, function(item){
               array.push(item)
            })
            return;
         }
         if ( _.isObject(target) ) {
            this.push(target);
         }

      }


      // Watching variable size
      array.size = array.length;

      // overriding array properties
      array.push = function(target){
			var push = Array.prototype.push.apply(this, [target]);
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
         if ( _.isObject(index) ) {
            index = this.indexOf(index);
         }
         return this.splice(index, 1);
      }



      return array;
   }
})
