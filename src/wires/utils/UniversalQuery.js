"use realm";

/**
 * Universal "jQuery"
 * For backend we use cheerio
 * For Browser jQuery to Zepto
 */
export class {
   static init(html) {
      html = "<div>" + html + "</div>";
      if (isNode) {
         var cheerio = require("cheerio");
         var $ = cheerio.load(html)
         return $("div").first();
      }
      if (!window.$) {
         console.error("jQuery or Zepto is required!");
      }
      var first = window.$("<div>" + html + "</div>").find("div:first");

      return first;
   }
}
