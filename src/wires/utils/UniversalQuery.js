module wires.utils.UniversalQuery;

/**
 * Universal "jQuery"
 * For backend we use cheerio
 * For Browser jQuery to Zepto
 */
export class {
   static init(html) {
      html = "<div><div>" + html + "</div></div>";
      if (isNode) {
         var cheerio = require("cheerio");
         var $ = cheerio.load(html)
         return $("div").first();
      }
      if (!window.$) {
         console.error("jQuery or Zepto is required!");
      }
      return window.$(html).find("div").first();
   }
}
