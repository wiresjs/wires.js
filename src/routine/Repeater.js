domain.service("Repeater", ['TagNode','$pathObject', '$array', '$watch','GarbageCollector'],
   function(TagNode,$pathObject, $array, $watch, GarbageCollector ){
   return GarbageCollector.extend({
      initialize : function(opts){
         var self = this;
         this.item = opts.item;
         this.run = opts.run;
         this.parent =  opts.parent;
         this.scope = opts.scope;

         var targetVars = this.item.v;

         if ( !targetVars.vars){
            throw { error : "Repeater expects variables! e.g $item in items"}
         }

         if ( _.keys(targetVars.vars).length !== 2 ){
            throw { error : "Repeater expects 2 variables. Scope key and Target Array (e.g $item in items)"}
         }
         this.scopeKey = targetVars.vars.__v0.p.join('');

         // Watch current array (in case if someone overrides is)
         // This should not happen
         // But just in case we should check this case
         $watch(targetVars.vars.__v1.p, this.scope, function(oldArray, newvalue){

            self.array = $array(newvalue);
            if ( !self.element){
               self.element = document.createComment('repeat ' + self.scopeKey);
               self.parent.addChild(self);
            }
            self.assign();
         });


         // Getting the target array
         var arrayPath = $pathObject(targetVars.vars.__v1.p, this.scope);

         var array = arrayPath.value ? arrayPath.value : arrayPath.update([]);

         // Attempting to create wires object array
         this.array = $array(array);

         // Create a placeholder
         this.element = document.createComment('repeat ' + this.scopeKey);
         this.parent.addChild(this);
         this.assign();
      },
      assign : function(){
         this.watchers = this.array.$watch(this.onEvent.bind(this));
         this._arrayElements = [];
         this.createInitialElements();
      },
      createInitialElements : function(){
         var self = this;
         _.each(this.array, function(element){
            self.addItem(element);
         });
      },
      detach : function(){
         _.each(this._arrayElements, function(item){
            if ( item.node.element && item.node.element.$tag){
               item.node.element.$tag.gc();
            }
         });
         this._arrayElements.splice(0,this._arrayElements.length);
      },
      addItem : function(arrayItem){

         var parentDom = this.item.i[0];

         //Creating new scope with parent variable
         var localScope = {
            parent : this.scope,
            index  : this._arrayElements.length
         };
         localScope[this.scopeKey] = arrayItem;

         var parentNode = new TagNode(parentDom, localScope);
         parentNode.create();

         // Checking the element we need to insert after
         var afterElement = this.element;
         var index = this._arrayElements.length;
         if ( index > 0 ){
            afterElement = this._arrayElements[index-1];
         }

         // Appending element
         var cNode = afterElement.node ? afterElement.node.element : afterElement;
         cNode.parentNode.insertBefore(parentNode.element, cNode.nextSibling);
         //$(parentNode.element).insertAfter((afterElement.node ? afterElement.node.element : afterElement ) )

         this._arrayElements.push({ node : parentNode, localScope : localScope} );
         this.element.$scope = localScope;
         this.element.$tag = self;
         //Running children
         this.run({
            structure   : parentDom.c || [],
            parentNode  : parentNode,
            scope       : localScope
         });
      },
      removeItem : function(index, howmany){
         // Removing elements from the DOM

         for (var i = index; i < index + howmany; i++) {

            if ( this._arrayElements[i] ){
                var el = this._arrayElements[i].node.element;
                el.$tag.gc();
            }
			}
         this._arrayElements.splice(index, howmany);
         // Reset indexes for items
         _.each(this._arrayElements, function(item, index){
            item.localScope.index = index;
         });
      },
      onEvent : function(event, target, howmany){
         if ( event === 'push'){
            this.addItem(target);
         }
         if ( event === 'splice'){
            this.removeItem(target, howmany);
         }
      }
   });
});
