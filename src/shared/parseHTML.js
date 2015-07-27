domain.service("$domFromString", function() {
   return function(str) {
      return new Promise(function(resolve, reject) {
         var handler = new Tautologistics.NodeHtmlParser.DefaultHandler(function(error, dom) {
            if (error) {
               return reject(error);
            } else {
               return resolve(dom);
            }
         });
         var parser = new Tautologistics.NodeHtmlParser.Parser(handler);
         parser.parseComplete(str);
      })
   }
});

domain.service("$parseHTML", ['$domFromString', '$preCompile'], function($domFromString, $preCompile) {
   return function(str) {
      return $domFromString(str).then(function(dom) {


         // Converting DOM from the library to something more compact
         // This will be used on the backend
         var loadLevel = function(list) {
            var res = [];
            _.each(list, function(_item) {
               var item;
               if (_item.type === "text") {
                  item = {
                     type : _item.type,
                     data : $preCompile(_item.data)
                  }
               }
               if (_item.type === "tag") {
                  item = {
                     type : _item.type,
                     name : _item.name
                  }
                  if ( _item.attribs ){
                     // prepare attrs
                     item.attrs = {};
                     _.each(_item.attribs, function(value, key){
                        item.attrs[key] = $preCompile(value);
                     })

                  }
               }
               if (_item.children) {
                  if ( item ){
                     var children = loadLevel(_item.children);
                     item.children = children;
                  }
               }
               if ( item ){
                  res.push(item);
               }
            });
            return res;
         }
         return loadLevel(dom);
      });
   }
})
