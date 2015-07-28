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
         console.log("initial structure", dom)
         var preCompileAttrs = function(_attrs) {
               var attrs = {};
               _.each(_attrs, function(value, key) {
                  attrs[key] = $preCompile(value);
               });
               return attrs;
            }
            // Converting DOM from the library to something more compact
            // This will be used on the backend
         var loadLevel = function(list) {
            var res = [];
            _.each(list, function(_item) {
               var item;
               if (_item.type === "text") {
                  item = {
                     type: _item.type,
                     data: $preCompile(_item.data)
                  }
                  res.push(item);
               }
               if (_item.type === "tag") {

                  item = {
                     type: _item.type,
                     name: _item.name
                  }
                  if (_item.attribs) {
                     if (_item.attribs["ws-repeat"]) {
                        item.target = $preCompile(_item.attribs["ws-repeat"])
                        delete _item.attribs["ws-repeat"];
                        delete item.name;
                        item.type = "repeater";
                        var it = {
                           type: "tag",
                           name: _item.name,
                        }

                        if (_item.attribs) it.attrs = preCompileAttrs(_item.attribs);
                        if (_item.children) it.children = loadLevel(_item.children)
                        item.it = [it]
                        res.push(item);
                     } else {
                        if ( _item.attribs ) item.attrs = preCompileAttrs(_item.attribs);
                        if (_item.children)  item.children = loadLevel(_item.children);
                        res.push(item);
                     }
                  } else {
                     if (_item.children)  item.children = loadLevel(_item.children);
                     res.push(item);
                  }
               }
            });
            return res;
         }
         return loadLevel(dom);
      });
   }
})
