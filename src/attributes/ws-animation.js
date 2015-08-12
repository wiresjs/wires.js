(function(){
   domain.service("attrs.ws-animation", ['TagAttribute', '$evaluate', '$projectAnimations'], function(TagAttribute, $evaluate, $projectAnimations){

      var WsAnimate = TagAttribute.extend({
         create : function(){

            var self = this;
            var data = $evaluate(self.attr, {
               scope: self.scope,
               element: self.element,
               target: this.scope,
               watchVariables: false
            });

            if ( data.str ){
               this.animationType = data.str;
               var animation;
               var el = $(this.element);
               if ( ( animation = $projectAnimations[this.animationType] )){
                  if ( _.isPlainObject(animation)){
                     if ( animation.onCreate){
                        animation.onCreate.bind(self.element)();
                     }
                     if (animation.onDestroy){
                        // Set destroy animation for element
                        self.element.$destroy = animation.onDestroy;
                     }
                     if (animation.animate){
                        self.element.$animate = animation.animate;
                     }
                  }
               }
            }
         }
      });
      return WsAnimate;
   });
})();
