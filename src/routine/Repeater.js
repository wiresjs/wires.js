domain.service("Repeater", ['TagNode','$pathObject', '$array'],
   function(TagNode,$pathObject, $array, $run){
   return Wires.Class.extend({
      initialize : function(opts){
         var self = this;
         this.item = opts.item;
         this.run = opts.run;
         this.parent =  opts.parent;
         this.scope = opts.scope;

         var targetVars = this.item.target;
         if ( !targetVars.vars){
            throw { error : "Repeater expects variables! e.g $item in items"}
         }

         if ( _.keys(targetVars.vars).length !== 2 ){
            throw { error : "Repeater expects 2 variables. Scope key and Target Array (e.g $item in items)"}
         }
         this.scopeKey = targetVars.vars.$_v0.p.join('');

         // Getting the target array
         var arrayPath = $pathObject(targetVars.vars.$_v1.p, this.scope)

         var array = arrayPath.value ? arrayPath.value : arrayPath.update([]);

         // Attempting to create wires object array
         this.array = $array(array);

         // Create a placeholder
         this.element = document.createComment('repeat ' + this.scopeKey);

         this.parent.addChild(this)

         this.watchers = this.array.$watch(this.onEvent.bind(this));

         this._arrayElements = [];
         this.createInitialElements();
      },
      createInitialElements : function(){
         var self = this;
         _.each(this.array, function(element){
            self.addItem(element);
         })
      },
      addItem : function(arrayItem){

         var parentDom = this.item.it[0];

         //Creating new scope with parent variable
         var localScope = {
            parent : this.scope,
            index  : this._arrayElements.length
         }
         localScope[this.scopeKey] = arrayItem

         var parentNode = new TagNode(parentDom, localScope);
         parentNode.create();

         // Checking the element we need to insert after
         var afterElement = this.element;
         var index = this._arrayElements.length;
         if ( index > 0 ){
            afterElement = this._arrayElements[index-1]
         }

         // Appending element
         $(parentNode.element).insertAfter((afterElement.node ? afterElement.node.element : afterElement ) )
         this._arrayElements.push({ node : parentNode, localScope : localScope} )

         //Running children
         this.run({
            structure   : parentDom.children || [],
            parentNode  : parentNode,
            scope       : localScope
         });
      },
      removeItem : function(index, howmany){
         // Removing elements from the DOM

         for (var i = index; i < index + howmany; i++) {

            if ( this._arrayElements[i] ){
                var el = this._arrayElements[i].node.element;
                // removing the actual dom element
                $(el).remove();
            }
			}
         this._arrayElements.splice(index, howmany)
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
            this.removeItem(target, howmany)
         }
      }
   })
})
