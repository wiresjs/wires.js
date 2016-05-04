(function(scope) {

   var useSchema = function(name, scope) {

      return function(done) {
         $('#root').html('');
         return realm.require(['wires.runtime.Schema', 'wires.core.Schema'], function(userSchema, Schema) {
            if (userSchema[name]) {
               Schema.inflate({
                  target: document.querySelector('#root'),
                  scope: scope,
                  locals: {},
                  schema: userSchema[name]
               });
               done();
            } else {
               done("Template '" + name + "' is not compiled!")
            }
         }).catch(function(e) {
            console.log(e.stack)
         })
      }
   }

   var takeScreenshot = function() {

      if (window.callPhantom) {
         var date = new Date()
         var filename = "screenshots/" + date.getTime()
         console.log("Taking screenshot " + filename)
         callPhantom({
            'screenshot': filename
         })
      }

   }

   var check = function(t) {
      return new Promise(function(resolve, reject) {
         setTimeout(function() {
            var element = $(t);

            var assert = function(message) {
               var text = _.flatten(arguments).join(' ');

               throw text
            }
            return resolve({
               html: function(html) {

                  var got = $(element).html();
                  if (html !== got) {
                     assert("Expected", html, " got:", got)
                  }
               },
               exists: function(shouldBeThere) {

                  var isUndefined = element[0] === undefined;

                  if (shouldBeThere === true && isUndefined) {
                     return assert("Element should exist")
                  }
                  if (shouldBeThere === false && !isUndefined) {

                     return assert("Element should not exist")
                  }
               },
               hidden: function(shouldBeHidden) {
                  var isVisible = element[0].style.display !== "none";
                  if (shouldBeHidden && isVisible) {
                     return assert("Element should be hidden")
                  }
                  if (!shouldBeHidden && !isVisible) {
                     return assert("Element should not be hidden")
                  }
               },
               attr: function(name, expected) {
                  var got = element.attr(name);

                  if (expected !== got) {
                     assert("Expected", expected, " got:", got)
                  }
               }
            })
         }, 30);
      })
   }

   scope.check = check;
   scope.useSchema = useSchema;
})(this)
