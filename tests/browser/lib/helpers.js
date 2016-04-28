(function(scope) {
   var Helpers = {
      initView: function(tpl, scope) {
         return function(done) {
            $('#root').empty();
            realm.require(['wires.compiler.JSONifier', 'wires.core.Universe'], function(ViewCompiler, Universe) {
               var contents = ViewCompiler.htmlString(document.querySelector(tpl).innerHTML);
               Universe.inflate(contents, scope, {}, document.querySelector('#root'));

               done();
            }).catch(done)
         }
      },
      init: function(tpl, done) {
         return function(done) {
            $('#root').empty();
            realm.require(['wires.compiler.JSONifier', 'wires.core.Universe'], function(ViewCompiler, Universe) {
               var contents = ViewCompiler.htmlString(tpl);
               Universe.inflate(contents, scope, {}, document.querySelector('#root'));

               done();
            }).catch(done)
         }
      },
      takeScreenshot: function() {

         if (window.callPhantom) {
            var date = new Date()
            var filename = "screenshots/" + date.getTime()
            console.log("Taking screenshot " + filename)
            callPhantom({
               'screenshot': filename
            })
         }

      }
   }
   scope.Helpers = Helpers;
})(this)
