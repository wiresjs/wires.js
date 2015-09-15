domain.service("TagAttribute", ['GarbageCollector', '$evaluate'], function(GarbageCollector, $evaluate) {
   var TagAttribute = GarbageCollector.extend({
      initialize: function(opts, item) {
         this.attr = opts.attr;
         this.name = opts.name;
         this.scope = opts.scope;
         this.element = opts.element;
         this.item = item;
      },
      create: function() {
         this.attribute = document.createAttribute(this.name);

         this.element.setAttributeNode(this.attribute);
         this.watcher = this.startWatching();
      },
      getVariableValue: function() {
         if (this.initialValue && this.initialValue.locals[0]) {
            return this.initialValue.locals[0].value.value;
         }
         return this.initialValue;
      },
      onValue: function(data) {
         this.attribute.value = data.str;
      },
      startWatching: function() {
         var self = this;

         this.initialValue = $evaluate(this.attr, {
            scope: this.scope,
            changed: function(data) {
               // If we have a custom listener
               if (self.onExpression) {
                  if (data.expressions && data.expressions.length > 0) {
                     self.onExpression.bind(self)(data.expressions[0]);
                  } else {
                     self.onExpression.bind(self)();
                  }
               } else {
                  if (self.onValue) {
                     self.onValue.bind(self)(data);
                  }
               }
            }

         });
         return this.initialValue;
      }
   });
   return TagAttribute;
});
