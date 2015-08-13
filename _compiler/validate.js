var _ = require('lodash');
var jsep = require("jsep");

// Validate syntax parser
// Without a key:
// minLength(1), maxLength(2), email
// With key
// email -> minLength(1), maxLength(2), email
var validate = function(str) {

   var funcs = [];
   try {
      var parse_tree = jsep(str);

      // flatten the tree
      var elements = [];
      if (parse_tree.type === "Compound") {
         elements = parse_tree.body;
      }
      if (parse_tree.type === "Identifier" || parse_tree.type === "CallExpression") {
         elements = [parse_tree];
      }
      _.each(elements, function(element) {
         if (element.type === "CallExpression") {
            funcs.push({
               n: element.callee.name,
               a: _.pluck(element.arguments, 'value')
            });
         }
         if (element.type === "Identifier") {
            funcs.push({
               n: element.name
            });
         }
      });
   } catch (e) {
      console.error("Error while parsing " + str);
      console.error(e);
   }
   return funcs;
};
module.exports = validate;
