domain.service("controllers.Kukka", function($array, $form, $resource, $restEndPoint) {
   return ['kukka.html', function() {

      this.doSomething = function(){
         alert(1)
      }
      window.ctrl = this;
      ctrl.users = [{name : "ivan"}, {name : "samuli"}]
      this.testData = {
         some : {
            name : "Ololo"
         }
      }
   }]
})
