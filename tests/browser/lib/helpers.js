(function(scope) {
   var Helpers = {
      initView: function(tpl, scope) {
         return function(done) {
            $('#root').empty();
            realm.require(['wires.compiler.JSONifier', 'wires.core.Schema'], function(ViewCompiler, Schema) {
               var contents = ViewCompiler.htmlString(document.querySelector(tpl).innerHTML);

               Schema.inflate({
                  target: document.querySelector('#root'),
                  scope: scope,
                  locals: {},
                  schema: contents
               });

               done();
            }).catch(done)
         }
      },
      init: function(tpl, scope) {
         return function(done) {
            $('#root').empty();
            realm.require(['wires.compiler.JSONifier', 'wires.core.Schema'], function(ViewCompiler, Schema) {
               var contents = ViewCompiler.htmlString(tpl);
               Schema.inflate({
                  target: document.querySelector('#root'),
                  scope: scope,
                  locals: {},
                  schema: contents
               });

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
