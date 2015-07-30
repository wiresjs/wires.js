domain.service("attrs.ws-value", ['TagAttribute', '$evaluate'], function(TagAttribute, $evaluate){
   var WsVisible = TagAttribute.extend({
      // Overriding default method
      // (we don't need to create an attribute for this case)
      create : function(){
         this.watcher = this.startWatching();
      },
      startWatching : function(){
         // Binding variable
         var watcher = $evaluate(this.attr, {
               scope: this.scope,
               changed: function(data) {

               }
         });
         // Extracting the first variable defined
         var variable;
         if ( watcher.locals && watcher.locals.length === 1 ){
            variable = watcher.locals[0];
         }
         this.bindActions(function(newValue){
            if ( variable ) {
               variable.value.update(newValue);
            }
         })
         // !Important!
         // Return the watcher!
         return watcher;
      },
      bindActions : function(cb){
         var self = this;
			var nodeName = this.element.nodeName.toLowerCase();
			var elType = $(this.element).attr('type');
			if (nodeName === 'textarea'){
				elType = nodeName;
         }
			if (nodeName === 'select'){
				elType = nodeName;
         }
			if (nodeName === 'input' && !elType) {
				elType = 'text';
			}
			switch (elType) {
				case 'text':
				case 'email':
				case 'password':
				case 'textarea':
					this.element.addEventListener("keydown", function(evt) {
                  var _that = this;
						clearInterval(self.interval);
						self.interval = setTimeout(function() {
							cb($(_that).val())
						}, 50);
					}, false);
					break;
				case 'checkbox':
					this.element.addEventListener("click", function(evt) {
						cb(this.checked);
					});
					break;
				case 'select':
					$(this.element).bind('change', function() {
						var value = $(this).val();
						var cel = $(this).find("option:selected");
						if (cel.length) {
						}
					});
					break;
			}
      }
   });
   return WsVisible;
})
