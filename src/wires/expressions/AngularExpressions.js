module wires.expressions.AngularExpressions;

import AngularExpressionParser from wires.expressions;
import lodash as _ from utils;
var parse = AngularExpressionParser;
var filters = {};
var Lexer = parse.Lexer;
var Parser = parse.Parser;
var lexer = new Lexer({});
var parser = new Parser(lexer, function getFilter(name) {
   return filters[name];
});

/**
 * Compiles src and returns a function that executes src on a target object.
 * The compiled function is cached under compile.cache[src] to speed up further calls.
 *
 * @param {string} src
 * @returns {function}
 */
function compile(src) {
   var cached;

   if (typeof src !== "string") {
      throw new TypeError("src must be a string, instead saw '" + typeof src + "'");
   }

   if (!compile.cache) {
      return parser.parse(src);
   }

   cached = compile.cache[src];

   if (!cached) {
      cached = compile.cache[src] = parser.parse(src);
   }

   return cached;
}

function extract(src) {
   if (typeof src !== "string") {
      throw new TypeError("src must be a string, instead saw '" + typeof src + "'");
   }
   var tokens = parser.tokenize(src);
   var variables = {}
   var nested = false;
   var latest;
   for (var i in tokens) {
      var item = tokens[i];

      if (_.isString(item.text) && item.text.match(/[a-z0-9\.$]+/i)) {

         if (nested) {
            if (latest) {
               if (item.string) {
                  latest.str = item.string
               } else {
                  latest.nested = {};
                  latest.nested[item.text] = {};
                  latest = latest.nested[item.text];
               }
               nested = false;
            }
         } else {
            if (!item.json) {
               latest = variables[item.text] = {};
            }

         }
      }
      if (item.text === "[") {
         nested = true;
      }
   }
   return variables;
}

/**
 * A cache containing all compiled functions. The src is used as key.
 * Set this on false to disable the cache.
 *
 * @type {object}
 */
compile.cache = {};

export {
   Lexer: Lexer,
   Parser: Parser,
   extract: extract,
   compile: compile,
   filters: filters
}
