(function(scope) {
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
                  if (shouldBeThere && isUndefined) {
                     return assert("Element should exist")
                  }
                  if (!shouldBeThere && !isUndefined) {
                     return assert("Element should not exist")
                  }
               }
            })
         }, 50);
      })
   }
   scope.check = check;
})(this)
