var cheerio = require("cheerio");

var el1 = cheerio('<div></div>');
var el2 = cheerio('<p></p>');
//console.log(el.addClass('test'))
el1.append(el2);

el2.text('hello');
console.log(el2.children());
