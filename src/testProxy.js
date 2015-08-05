(function(){
   domain.service("proxies.lng", ['Proxy'],function(Proxy){
      return Proxy.extend({
         init : function(){
         //   console.log("init called")
            var self = this;

            setInterval(function(){
               self.update();
            },1000)
         },
         get : function(key){
            //console.log("requested...", new Date().getTime())
            return "time is " + new Date().getTime();
         }
      })
   })
})();
