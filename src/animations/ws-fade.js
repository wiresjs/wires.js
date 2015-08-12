domain.service("animations.ws-fade", function(){
   return {
      animate : function(){
         $(this).velocity({ rotateX: 90}).velocity({ rotateX: 1});
      },
      onCreate : function(){
         var el = $(this);
         el
            .css("opacity", 0)
            .show()
            .velocity({ opacity: 1},{  duration: 400 });
      },
      onDestroy : function(){

         var el = $(this);
         return new Promise(function(resolve, reject){
            el.velocity({ opacity: 0},{  duration: 400, complete : resolve});
         });
      }
   };
});
