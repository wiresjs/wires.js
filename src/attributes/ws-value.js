(function() {
   domain.service("attrs.ws-value", ['TagAttribute', '$evaluate'], function(TagAttribute, $evaluate) {
      var WsVisible = TagAttribute.extend({
         // Overriding default method
         // (we don't need to create an attribute for this case)
         create: function() {
            this.watcher = this.startWatching();
         },
         startWatching: function() {
            var self = this;
            var selfCheck = false;
            // Binding variable
            var watcher = $evaluate(this.attr, {
               scope: this.scope,
               changed: function(data) {

                  if (selfCheck === false) {
                     self.setValue(data.str);
                  }
                  selfCheck = false;

               }
            });

            // Extracting the first variable defined
            this.variable;
            if (watcher.locals && watcher.locals.length === 1) {
               this.variable = watcher.locals[0];
            }
            // store variable to the element
            this.element.$variable = this.variable;

            this.bindActions(function(newValue) {
                  if (self.variable) {
                     selfCheck = true;

                     self.variable.value.update(newValue);
                  }
               })
               // !Important!
               // Return the watcher!
            return watcher;
         },
         setValue: function(v) {
            $(this.element).val(v);
         },
         bindActions: function(cb) {
            var self = this;
            var nodeName = this.element.nodeName.toLowerCase();
            var elType = $(this.element).attr('type');
            if (nodeName === 'textarea') {
               elType = nodeName;
            }
            if (nodeName === 'select') {
               elType = nodeName;
            }
            if (nodeName === 'option') {
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
                     var target = this.$checked;

                     if ( _.isArray(target.value) ){

                        var currValue = self.variable.value.value;
                        var index = target.value.indexOf(currValue);

                        if ( this.checked ){
                           if ( index === - 1 ){
                              target.value.push(currValue);
                           }
                        } else {
                           // Removing value from an array
                           if ( index > - 1 ){
                              target.value.splice(index, 1)
                           }
                        }

                     } else {
                        self.variable.value.update(this.checked)
                     }
                  });
                  break;
               case 'option':

               break;
               case 'select':
                  $(this.element).change(function() {
                     var value = self.detectSelectValue();
                     cb(value);
                  });
                  _.defer(function(){
                     // If we have set the variable beforehand
                     if ( self.variable.value.value !== undefined){
                        self.setValue(self.variable.value.value);
                     } else {
                        // In Any other case
                        // we should update variable with first option
                        var firstValue = self.detectSelectValue(true)
                        self.variable.value.update(firstValue);
                     }
                  });
                  break;
            }
         },
         detectSelectValue: function(first) {
            var value;
            $(this.element).find(first ? "option:first" : "option:selected").each(function() {

               var el = this;
               var tag = this.$tag;
               // in case of option
               var storedVariable = this.$variable;
               if ( storedVariable ){
                  value = storedVariable.value.value
               } else {
                  // Checking the value from simple attribute "value"
                  _.each(tag.attributes, function(attr) {
                     if (attr.name === "value") {
                        value = $(el).val();
                     }
                  });
                  // if value is stil undefined
                  // try to get it from html
                  if (value === undefined) {
                     value = $(el).html();
                  }
               }

            });
            return value;
         },
      });
      return WsVisible;
   })

})();
