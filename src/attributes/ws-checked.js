(function(){
   domain.service("attrs.ws-checked", ['TagAttribute', '$array'],
      function(TagAttribute, $array) {
         var WsOption = TagAttribute.extend({
            create: function() {

               var currentVar = this.element.$variable;
               if ( currentVar){
                  this.currentValue = currentVar.value.value;
               }
               this.watcher = [];
               this.watcher.push(this.startWatching());

               this.arrayWatcher = false;
            },
            onValue: function(v) {

               var self = this;
               if ( this.selfUpdate === true){
                  this.selfUpdate = false;
                  return;
               }
               var targetObject = v.locals[0].value;
               var targetValue = v.locals[0].value.value;
               this.element.$checked =  targetObject;

               if ( _.isArray(targetValue) ){
                  // Convert to $array object just in case
                  targetValue = $array(targetValue);

                  // Check if this array is watched
                  if ( !this.arrayWatcher){
                     this.watcherCreated = true;
                     this.arrayWatcher = targetValue.$watch(function(event, start, end){
                        var isChecked;
                        if ( event === "splice"){
                           var index = v;
                           // Getting spliced objects

                           for(var i = start; i<= end; i++){
                              var modifiedValue = targetValue[i];

                              if ( modifiedValue === self.currentValue){
                                 if ( self.element.checked === true){
                                    self.element.checked = false;
                                 }
                              }
                           }
                        } else {
                           if ( self.currentValue === start){
                              self.element.checked = targetValue.indexOf(start) > -1;
                           }
                        }
                     });
                     self.watcher.push(self.arrayWatcher);
                  }
                  if ( this.currentValue ){
                     var isChecked = targetValue.indexOf(this.currentValue) > -1;
                     if ( isChecked ){
                        this.element.checked = true;
                     } else {
                        this.element.checked = false;
                     }
                  }
               } else {
                  this.selfUpdate = true;
                  this.element.checked = targetValue ? true : false;
                  targetObject.update(targetValue ? true : false);
               }
            }
         });
         return WsOption;
      });
})();
