var isarray=_.isArray;!function(){function e(e){for(var t,i=[],r=0,o=0,a="";null!=(t=f.exec(e));){var s=t[0],c=t[1],u=t.index;if(a+=e.slice(o,u),o=u+s.length,c)a+=c[1];else{a&&(i.push(a),a="");var h=t[2],l=t[3],p=t[4],d=t[5],v=t[6],m=t[7],g="+"===v||"*"===v,w="?"===v||"*"===v,y=h||"/",$=p||d||(m?".*":"[^"+y+"]+?");i.push({name:l||r++,prefix:h||"",delimiter:y,optional:w,repeat:g,pattern:n($)})}}return o<e.length&&(a+=e.substr(o)),a&&i.push(a),i}function t(e){return e.replace(/([.+*?=^!:${}()[\]|\/])/g,"\\$1")}function n(e){return e.replace(/([=!:$\/()])/g,"\\$1")}function i(e,t){return e.keys=t,e}function r(e){return e.sensitive?"":"i"}function o(e,t){var n=e.source.match(/\((?!\?)/g);if(n)for(var r=0;r<n.length;r++)t.push({name:r,prefix:null,delimiter:null,optional:!1,repeat:!1,pattern:null});return i(e,t)}function a(e,t,n){for(var o=[],a=0;a<e.length;a++)o.push(u(e[a],t,n).source);var s=new RegExp("(?:"+o.join("|")+")",r(n));return i(s,t)}function s(t,n,r){for(var o=e(t),a=c(o,r),s=0;s<o.length;s++)"string"!=typeof o[s]&&n.push(o[s]);return i(a,n)}function c(e,n){n=n||{};for(var i=n.strict,o=n.end!==!1,a="",s=e[e.length-1],c="string"==typeof s&&/\/$/.test(s),u=0;u<e.length;u++){var f=e[u];if("string"==typeof f)a+=t(f);else{var h=t(f.prefix),l=f.pattern;f.repeat&&(l+="(?:"+h+l+")*"),l=f.optional?h?"(?:"+h+"("+l+"))?":"("+l+")?":h+"("+l+")",a+=l}}return i||(a=(c?a.slice(0,-2):a)+"(?:\\/(?=$))?"),a+=o?"$":i&&c?"":"(?=\\/|$)",new RegExp("^"+a,r(n))}function u(e,t,n){return t=t||[],isarray(t)?n||(n={}):(n=t,t=[]),e instanceof RegExp?o(e,t,n):isarray(e)?a(e,t,n):s(e,t,n)}window.pathToRegexp=u;var f=new RegExp(["(\\\\.)","([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^()])+)\\))?|\\(((?:\\\\.|[^()])+)\\))([+*?])?|(\\*))"].join("|"),"g")}();var Wires=Wires||{};!function(){var e=function(e,t){var n,i=this;n=e&&_.has(e,"constructor")?e.constructor:function(){return i.apply(this,arguments)},_.extend(n,i,t);var r=function(){this.constructor=n};return r.prototype=i.prototype,n.prototype=new r,e&&_.extend(n.prototype,e),n.__super__=i.prototype,n.prototype.__parent__=function(e,t){n.__super__[e].apply(n.prototype,t)},n},t=function(e,t){this.initialize&&this.initialize.apply(this,arguments)};t.extend=e,Wires.Class=t}(),function t(e,n,i){function r(a,s){if(!n[a]){if(!e[a]){var c="function"==typeof require&&require;if(!s&&c)return c(a,!0);if(o)return o(a,!0);var u=new Error("Cannot find module '"+a+"'");throw u.code="MODULE_NOT_FOUND",u}var f=n[a]={exports:{}};e[a][0].call(f.exports,function(t){var n=e[a][1][t];return r(n?n:t)},f,f.exports,t,e,n,i)}return n[a].exports}for(var o="function"==typeof require&&require,a=0;a<i.length;a++)r(i[a]);return r}({1:[function(e,t,n){function i(){}var r=t.exports={};r.nextTick=function(){var e="undefined"!=typeof window&&window.setImmediate,t="undefined"!=typeof window&&window.postMessage&&window.addEventListener;if(e)return function(e){return window.setImmediate(e)};if(t){var n=[];return window.addEventListener("message",function(e){var t=e.source;if((t===window||null===t)&&"process-tick"===e.data&&(e.stopPropagation(),n.length>0)){var i=n.shift();i()}},!0),function(e){n.push(e),window.postMessage("process-tick","*")}}return function(e){setTimeout(e,0)}}(),r.title="browser",r.browser=!0,r.env={},r.argv=[],r.on=i,r.addListener=i,r.once=i,r.off=i,r.removeListener=i,r.removeAllListeners=i,r.emit=i,r.binding=function(e){throw new Error("process.binding is not supported")},r.cwd=function(){return"/"},r.chdir=function(e){throw new Error("process.chdir is not supported")}},{}],2:[function(e,t,n){"use strict";function i(e){function t(e){return null===c?void f.push(e):void a(function(){var t=c?e.onFulfilled:e.onRejected;if(null===t)return void(c?e.resolve:e.reject)(u);var n;try{n=t(u)}catch(i){return void e.reject(i)}e.resolve(n)})}function n(e){try{if(e===h)throw new TypeError("A promise cannot be resolved with itself.");if(e&&("object"==typeof e||"function"==typeof e)){var t=e.then;if("function"==typeof t)return void o(t.bind(e),n,i)}c=!0,u=e,s()}catch(r){i(r)}}function i(e){c=!1,u=e,s()}function s(){for(var e=0,n=f.length;n>e;e++)t(f[e]);f=null}if("object"!=typeof this)throw new TypeError("Promises must be constructed via new");if("function"!=typeof e)throw new TypeError("not a function");var c=null,u=null,f=[],h=this;this.then=function(e,n){return new h.constructor(function(i,o){t(new r(e,n,i,o))})},o(e,n,i)}function r(e,t,n,i){this.onFulfilled="function"==typeof e?e:null,this.onRejected="function"==typeof t?t:null,this.resolve=n,this.reject=i}function o(e,t,n){var i=!1;try{e(function(e){i||(i=!0,t(e))},function(e){i||(i=!0,n(e))})}catch(r){if(i)return;i=!0,n(r)}}var a=e("asap");t.exports=i},{asap:4}],3:[function(e,t,n){"use strict";function i(e){this.then=function(t){return"function"!=typeof t?this:new r(function(n,i){o(function(){try{n(t(e))}catch(r){i(r)}})})}}var r=e("./core.js"),o=e("asap");t.exports=r,i.prototype=r.prototype;var a=new i(!0),s=new i(!1),c=new i(null),u=new i(void 0),f=new i(0),h=new i("");r.resolve=function(e){if(e instanceof r)return e;if(null===e)return c;if(void 0===e)return u;if(e===!0)return a;if(e===!1)return s;if(0===e)return f;if(""===e)return h;if("object"==typeof e||"function"==typeof e)try{var t=e.then;if("function"==typeof t)return new r(t.bind(e))}catch(n){return new r(function(e,t){t(n)})}return new i(e)},r.all=function(e){var t=Array.prototype.slice.call(e);return new r(function(e,n){function i(o,a){try{if(a&&("object"==typeof a||"function"==typeof a)){var s=a.then;if("function"==typeof s)return void s.call(a,function(e){i(o,e)},n)}t[o]=a,0===--r&&e(t)}catch(c){n(c)}}if(0===t.length)return e([]);for(var r=t.length,o=0;o<t.length;o++)i(o,t[o])})},r.reject=function(e){return new r(function(t,n){n(e)})},r.race=function(e){return new r(function(t,n){e.forEach(function(e){r.resolve(e).then(t,n)})})},r.prototype["catch"]=function(e){return this.then(null,e)}},{"./core.js":2,asap:4}],4:[function(e,t,n){(function(e){function n(){for(;r.next;){r=r.next;var e=r.task;r.task=void 0;var t=r.domain;t&&(r.domain=void 0,t.enter());try{e()}catch(i){if(c)throw t&&t.exit(),setTimeout(n,0),t&&t.enter(),i;setTimeout(function(){throw i},0)}t&&t.exit()}a=!1}function i(t){o=o.next={task:t,domain:c&&e.domain,next:null},a||(a=!0,s())}var r={task:void 0,next:null},o=r,a=!1,s=void 0,c=!1;if("undefined"!=typeof e&&e.nextTick)c=!0,s=function(){e.nextTick(n)};else if("function"==typeof setImmediate)s="undefined"!=typeof window?setImmediate.bind(window,n):function(){setImmediate(n)};else if("undefined"!=typeof MessageChannel){var u=new MessageChannel;u.port1.onmessage=n,s=function(){u.port2.postMessage(0)}}else s=function(){setTimeout(n,0)};t.exports=i}).call(this,e("_process"))},{_process:1}],5:[function(e,t,n){"function"!=typeof Promise.prototype.done&&(Promise.prototype.done=function(e,t){var n=arguments.length?this.then.apply(this,arguments):this;n.then(null,function(e){setTimeout(function(){throw e},0)})})},{}],6:[function(e,t,n){e("asap");"undefined"==typeof Promise&&(Promise=e("./lib/core.js"),e("./lib/es6-extensions.js")),e("./polyfill-done.js")},{"./lib/core.js":2,"./lib/es6-extensions.js":3,"./polyfill-done.js":5,asap:4}]},{},[6]),function(e){function t(e){var t=/((\/\/.*$)|(\/\*[\s\S]*?\*\/))/gm,n=/([^\s,]+)/g,i=e.toString().replace(t,""),r=i.slice(i.indexOf("(")+1,i.indexOf(")")).match(n);return null===r&&(r=[]),r}var n={};e.domain={constructModel:function(e,t,n){var i=new t;this.require({source:t.prototype.init,target:i.init,instance:i},e).then(function(e){n(null,i)})["catch"](function(e){n(e)})},getInputArguments:function(e){var t={};if(t.localServices={},e.length>0){if(t.source=e[0],t.target=e[0],_.isPlainObject(e[0])){var n=e[0];t.target=n.target,t.source=n.source,t.instance=n.instance}if(e.length>1){var i=_.isString(e[0])||_.isArray(e[0]);i?(t.source=_.isArray(e[0])?e[0]:_.isString(e[0])?[e[0]]:e[0],_.isFunction(e[1])&&(t.target=e[1]),_.isFunction(e[2])&&(t.target=e[2])):(_.isFunction(e[1])&&(t.callReady=e[1]),_.isPlainObject(e[1])&&(t.localServices=e[1]))}3===e.length&&(_.isPlainObject(e[1])&&(t.localServices=e[1]),_.isFunction(e[2])&&(t.callReady=e[2]))}return t.target=t.target||function(){},t.source=t.source?t.source:t.target,t.callReady=t.callReady||function(){},t},service:function(){this.register.apply(this,arguments)},register:function(e,t,i){var r=null,o=t;_.isArray(t)&&(r=t,o=i),n[e]={target:o,args:r}},requirePackage:function(e){var t={};return this.each(n,function(n,i){var r=i.split(".")[0];return r===e?domain.require([i],function(e){t[i]=e}):void 0}).then(function(){return t})},require:function(){var e=this.getInputArguments(arguments),i=this,r=e.localServices,o=_.isArray(e.source)?e.source:t(e.source),a=e.target,s=(e.callReady,e.instance),c=n,i=this,u=new Promise(function(t,n){var u=[],f=_.merge(r,c);for(var h in o){var l=(o[h],o[h]);if(!f[l])return console.error("Error while injecting variable '"+l+"' into function \n"+e.source.toString()),n({status:500,message:"Service with name '"+l+"' was not found "});u.push(f[l])}return i.each(u,function(e){var t=e.target,n=e.args;if(_.isFunction(t)){var o=[];return o=n?[n,r,t]:[t,r],i.require.apply(i,o)}return t}).then(function(e){return delete i,a.apply(s||e,e)}).then(t)["catch"](n)});return u},isServiceRegistered:function(e){return void 0!==n[e]},each:function(e,t){return new Promise(function(n,i){var r=[],o=_.isPlainObject(e),a=-1,s=function(){if(a++,!(a<_.size(e)))return n(r);var c,u;o?(c=_.keys(e)[a],u=e[c]):(c=a,u=e[a]);var f=t.call(t,u,c);f instanceof Promise?f.then(function(e){r.push(e),s()})["catch"](i):(r.push(f),s())};s()})}}}(window),function(){RegExp.prototype.execAll=function(e){for(var t=null,n=new Array;t=this.exec(e);){var r=[];for(i in t)parseInt(i)==i&&r.push(t[i]);n.push(r)}return n}}(),function(){window.isMobile=!1,(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4)))&&(window.isMobile=!0);var e=1;Object.defineProperty(Object.prototype,"__uniqueId",{writable:!0}),Object.defineProperty(Object.prototype,"uniqueId",{get:function(){return void 0==this.__uniqueId&&(this.__uniqueId=e++),this.__uniqueId}})}(),function(){Object.defineProperty(Object.prototype,"watch",{enumerable:!1,configurable:!0,writable:!1,value:function(e,t){var n=this[e],i=n,r=function(){return i},o=function(r){return n=i,i=t.call(this,e,n,r)};delete this[e]&&Object.defineProperty(this,e,{get:r,set:o,enumerable:!0,configurable:!0})}}),Object.defineProperty(Object.prototype,"unwatch",{enumerable:!1,configurable:!0,writable:!1,value:function(e){var t=this[e];delete this[e],this[e]=t}})}(),function(){domain.service("$evaluate",["$watch","$pathObject","$exec"],function(e,t,n){return function(i,r){var r=r||[],o=r.scope||{},a=r.target,s=r.changed,c=void 0!==r.watchVariables?r.watchVariables:!0,u=[],f=function(e,r){var c=i.tpl,f=[],h=[];_.each(i.vars,function(e,i){var r;e.p?(path=t(e.p,o),r=path.value,h.push({path:e.p,value:path})):e.e&&(r=n.expression(e.e,o,a),f.push({str:e.e,value:r})),r=void 0===r?"":r,c=c.split(i).join(r)});for(var l in i.funcs){var p=i.funcs[l],d=t(p.p,o).value;if(_.isFunction(d)){var v=n.func(p.f,o,a);c=c.split(l).join(void 0!==v?v:"")}else c=c.split(l).join("")}var m={str:c,expressions:f,locals:h,detach:function(){_.each(u,function(e){e.remove()})}};return _.isFunction(s)&&s(m),m};if(c){var h={},l=function(e){_.each(e,function(e){if(e.p){var t=e.p.join(".");h[t]||(h[t]=e)}e.e&&l(e.v)})};l(i.vars),_.each(h,function(t){var n=e(t.p,o,function(e,n){_.defer(function(){f(t.p.join("."),n)})});n&&u.push(n)})}var p=f();return p}})}(),function(){var _cache={},getFunctionFromString=function(stringFunction){var userFunc;return _cache[stringFunction]?userFunc=_cache[stringFunction]:(userFunc=eval("(function($, target){ return "+stringFunction+"})"),_cache[stringFunction]=userFunc),_cache[stringFunction]};domain.service("$exec",["$pathObject"],function(e){return{func:function(e,t,n){var i=getFunctionFromString(e),r=i.bind(t)(t,n);return r},expression:function(e,t,n){var i=getFunctionFromString(e),r=i.bind(t)(t,n);return r}}})}(),function(){domain.service("$loadView",function(){return function(e){return new Promise(function(t,n){return t(window.__wires_views__[e]?window.__wires_views__[e]:[])})}})}(),function(){domain.service("$pathObject",function(){return function(e,t){_.isArray(e)||(e=e.split("."));var n=t,i=null;return _.each(e,function(t,r){e.length-1===r?i=t:void 0!==n[t]?n=n[t]:(n[t]={},n=n[t])}),{update:function(e){return n[i]=e,e},value:n[i],property:i,instance:n}}})}(),function(){domain.service("$run",["TagNode","TextNode","Repeater","Conditional"],function(e,t,n,i){var r=function(o){var o=o||{},a=o.structure||[],s=o.target||document.querySelector("section"),c=o.scope||{},u=function(o,a){_.each(o,function(o){var s;if(1===o.t&&(s=new t(o,c),s.create(a)),2===o.t){s=new e(o,c);{s.create(a)}o.c&&u(o.c,s)}if(3===o.t){new n({run:r,item:o,parent:a,scope:c})}if(4===o.t){new i({run:r,item:o,parent:a,scope:c})}})},f=(document.createElement("div"),o.parentNode||new e(s));f.element||(f.element=s),u(a,f)};return r})}(),function(){domain.service("$watch",["$pathObject","$array"],function(e,t){return function(n,i,r){var o=e(n,i),a=o.instance,s=o.property;return a.$watchers||(a.$watchers={}),_.isObject(a)||!_.isString(s)?(_.isArray(a)&&(a=t(a)),a.$watchers[s]||(a.$watchers[s]=[]),r&&a.$watchers[s].push(r),1===a.$watchers[s].length&&a.watch(s,function(e,t,n){return _.each(a.$watchers[s],function(e){e(t,n)}),n}),{remove:function(){var e=a.$watchers[s].indexOf(r);a.$watchers[s].splice(e,1),delete r},removeAll:function(){a.unwatch(s),delete a.$watchers}}):void 0}})}(),function(){domain.service("$restEndPoint",function(){return function(e,t){var t=t||{},n=e.split("/"),i=[];return _.each(n,function(e){var n=e.match(/:(.+)/);n?t.hasOwnProperty(n[1])&&i.push(t[n[1]]):i.push(e)}),i.join("/")}})}(),function(){var e;domain.service("$customAttributes",function(){return new Promise(function(t,n){return e?t(e):void domain.requirePackage("attrs").then(function(n){return e=n,t(e)})})})}(),function(){domain.service("$form",function(){return function(){var e={};return e.$getAttrs=function(){var e={};return _.each(this,function(t,n){n.match(/^(\$|_)/)||(e[n]=t)}),e},e.$reset=function(){_.each(this,function(e,t){t.match(/^(\$|_)/)||(this[t]=void 0)},this)},e}})}(),function(){var e;domain.service("$history",function(){if(e)return e;var t=Wires.Class.extend({initialize:function(){var e=this;this.events={},window.onpopstate=function(){e.trigger("change")}},trigger:function(e){_.isArray(this.events[e])&&_.each(this.events[e],function(e){e()})},on:function(e,t){this.events[e]||(this.events[e]=[]),this.events[e].push(t)},go:function(e){var t={url:e};history.pushState(t,e,e),this.trigger("change")}});return e=new t})}(),function(){domain.register("$http",function(){return{_request:function(e,t,n,i,r){var o={url:t,contentType:"application/json; charset=UTF-8",method:e,data:JSON.stringify(n),dataType:"json"};"GET"===e&&(o.data=n);var a=$.ajax(o);a.always(function(e,t){return e.status?r({status:e.status,message:e.responseJSON||e.statusText}):i(e)})},"delete":function(e,t){var n=this;return new Promise(function(i,r){n._request("DELETE",e,t,function(e){i(e)},function(e){r(e)})})},getHTML:function(e){return new Promise(function(t,n){$.get(e,function(e){return e=e.replace(/(\r\n|\n|\r)/gm,""),t(e)})})},get:function(e,t){var n=this;return new Promise(function(i,r){n._request("GET",e,t,function(e){i(e)},function(e){r(e)})})},post:function(e,t){var n=this;return new Promise(function(i,r){n._request("POST",e,t,function(e){i(e)},function(e){r(e)})})},put:function(e,t){var n=this;return new Promise(function(i,r){n._request("PUT",e,t,function(e){i(e)},function(e){r(e)})})}}})}(),function(){var e=0;domain.service("$load",["$queryString","$loadView","$run"],function(t,n,i){return{component:function(e,t){},controller:function(r,o){var o=(window.location.url,o||{}),a=o.parent,s=t();o.params&&(s=_.merge(s,o.params));var c={$params:{target:s}};return o.injections&&_.each(o.injections,function(e,t){c[t]={target:e}}),domain.require([r],c,function(t){if(e++,_.isArray(t)&&!(t.length<2)){var r=t[0].match(/^([^\s]+)(\s*->\s*([^\s]+))?/i),o=t[1];if(r){var s=r[1],c=r[3]||"section",u=null;if(u=a&&a.element?$(a.element).find(c)[0]:document.querySelector(c),!u)throw{message:"Can't find a target "};for(var f=new o;u.firstChild;)u.removeChild(u.firstChild);return n(s).then(function(e){return i({structure:e,target:u,scope:f}),{scope:f,element:u}})}}})}}})}(),function(){domain.service("$queryString",function(){var e=function(){for(var e={},t=window.location.search.substring(1),n=t.split("&"),i=0;i<n.length;i++){var r=n[i].split("=");if("undefined"==typeof e[r[0]])e[r[0]]=decodeURIComponent(r[1]);else if("string"==typeof e[r[0]]){var o=[e[r[0]],decodeURIComponent(r[1])];e[r[0]]=o}else e[r[0]].push(decodeURIComponent(r[1]))}return e};return e})}(),function(){var e=Wires.Class.extend({initialize:function(){this.states=[],this.loaded=!1},set:function(e,t,n){this.route=e,this.controller=t,this.states=n},getControllerPath:function(){return"controllers."+this.controller},matches:function(){var e,t=window.location.pathname,n=[],i=pathToRegexp(this.route,n),r={};return(e=i.exec(t))?(_.each(n,function(t,n){r[t.name]=e[n+1]}),r):void 0}}),t=new e;domain.register("$router",["$load","$queryString","$loadView","$run","$history"],function(n,i,r,o,a){return{add:function(){var e=this.state.apply(this,arguments);t.states.push(e)},state:function(t,n,i){var r=new e;return r.set.apply(r,arguments),r},_start:function(e){var t=this;_.each(e.states,function(e){var n;return(n=e.matches())?(t.stack.push(e),e.states&&t._start(e),!1):void 0})},loadStates:function(e){var t,i=((new Date).getTime(),this);return i.historyStack=i.historyStack||[],domain.each(e,function(r,o){var a=i.historyStack[o],s=o+1===e.length;return a&&!s&&a.route===r.route?void(t=r.parent):n.controller(r.getControllerPath(),{parent:t}).then(function(e){r.loaded=!0,r.parent=e,t=e})}).then(function(e){i.historyStack=[],_.each(i.stack,function(e){i.historyStack.push(e)}),i.stack=[]})["catch"](function(e){console.error(e||e.stack)})},start:function(){var e=this;e.stack=[],e._start(t),e.loadStates(e.stack),a.on("change",function(n){e.stack=[],e._start(t),e.loadStates(e.stack)})}}})}(),function(){domain.service("Conditional",["TagNode","$pathObject","$array","$watch","$evaluate"],function(e,t,n,i,r){return Wires.Class.extend({initialize:function(t){var n=this;this.item=t.item,this.run=t.run,this.parent=t.parent,this.scope=t.scope;var i=n.item.c[0];this.element=document.createComment(" if "),this.parent.addChild(this),this.watchers=r(this.item.z,{scope:n.scope,element:{},target:{},changed:function(t){if(t.expressions&&t.expressions.length>0){var r=t.expressions[0].value;if(r){if(void 0===n.parentElement){var o=new e(i,n.scope);o.create(),n.parentElement=o.element,n.run({structure:i.c||[],parentNode:o,scope:n.scope}),n.element.parentNode.insertBefore(o.element,n.element.nextSibling)}}else n.parentElement&&($(n.parentElement).remove(),n.parentElement=void 0)}}})}})})}(),domain.service("Repeater",["TagNode","$pathObject","$array","$watch"],function(e,t,n,i){return Wires.Class.extend({initialize:function(e){this.item=e.item,this.run=e.run,this.parent=e.parent,this.scope=e.scope;var r=this.item.v;if(!r.vars)throw{error:"Repeater expects variables! e.g $item in items"};if(2!==_.keys(r.vars).length)throw{error:"Repeater expects 2 variables. Scope key and Target Array (e.g $item in items)"};this.scopeKey=r.vars.$_v0.p.join(""),i(r.vars.$_v1.p,this.scope,function(e,t){throw{message:"You can't assign a new array. Use "+r.vars.$_v1.p+".$removeAll() instead"}});var o=t(r.vars.$_v1.p,this.scope),a=o.value?o.value:o.update([]);this.array=n(a),this.element=document.createComment("repeat "+this.scopeKey),this.parent.addChild(this),this.parent.addChild(this),this.assign()},assign:function(){this.watchers=this.array.$watch(this.onEvent.bind(this)),this._arrayElements=[],this.createInitialElements()},createInitialElements:function(){var e=this;_.each(this.array,function(t){e.addItem(t)})},addItem:function(t){var n=this.item.i[0],i={parent:this.scope,index:this._arrayElements.length};i[this.scopeKey]=t;var r=new e(n,i);r.create();var o=this.element,a=this._arrayElements.length;a>0&&(o=this._arrayElements[a-1]);var s=o.node?o.node.element:o;s.parentNode.insertBefore(r.element,s.nextSibling),this._arrayElements.push({node:r,localScope:i}),this.run({structure:n.c||[],parentNode:r,scope:i})},removeItem:function(e,t){for(var n=e;e+t>n;n++)if(this._arrayElements[n]){var i=this._arrayElements[n].node.element;$(i).remove()}this._arrayElements.splice(e,t),_.each(this._arrayElements,function(e,t){e.localScope.index=t})},onEvent:function(e,t,n){"push"===e&&this.addItem(t),"splice"===e&&this.removeItem(t,n)}})}),domain.service("TagAttribute",["$evaluate"],function(e){var t=Wires.Class.extend({initialize:function(e){this.attr=e.attr,this.name=e.name,this.scope=e.scope,this.element=e.element},create:function(){this.attribute=document.createAttribute(this.name),this.element.setAttributeNode(this.attribute),this.watcher=this.startWatching()},onValue:function(e){this.attribute.value=e.str},startWatching:function(){var t=this;return e(this.attr,{scope:this.scope,changed:function(e){t.onExpression?e.expressions&&e.expressions.length>0?t.onExpression(e.expressions[0]):t.onExpression():t.onValue&&t.onValue(e)}})}});return t}),domain.service("$tagAttrs",["TagAttribute","$evaluate","$customAttributes"],function(e,t,n){return{create:function(t,i,r){var o=[];return _.each(t.a,function(t,a){var s,c="attrs."+a,u={scope:i,attr:t,name:a,element:r};s=n[c]?new n[c](u):new e(u),s?(s.create(),o.push(s)):console.log("no attr",c)}),o}}}),domain.service("TagNode",["$tagAttrs"],function(e){return Wires.Class.extend({initialize:function(e,t){this.item=e,this.scope=t,this.children=[]},create:function(e,t){return this.element=document.createElement(this.item.n),this.element.$scope=this.scope,this.element.$tag=this,e&&e.addChild(this),this.startWatching(),this.element},addChild:function(e){$(this.element).append(e.element),this.children.push(e)},startWatching:function(){var t=this;this.attributes=e.create(this.item,this.scope,this.element);var n=function(){_.each(t.attributes,function(e){e.watcher&&e.watcher.detach(),_.isFunction(e.detach)&&e.detach()}),_.each(t.children,function(e){e.watchers&&(e.watchers.detach(),delete e),e.onRemove&&e.onRemove(),delete e}),$(t.element).unbind(),t.element.removeEventListener("DOMNodeRemovedFromDocument",n),delete t.attributes,delete t.children,delete t.element.$scope,delete t.element.$tag,delete t.element,delete n};t.element.addEventListener("DOMNodeRemovedFromDocument",n)}})}),function(){var e=1;domain.service("TextNode",["$evaluate"],function(t){return Wires.Class.extend({initialize:function(e,t){this.item=e,this.scope=t},onDetach:function(){},create:function(n){var i=this;this.firstLoad=!0;var r=watcher=t(this.item.d,{scope:this.scope,changed:function(t){e++,i.firstLoad===!1&&(i.element.nodeValue=t.str),i.firstLoad=!1}});return this.watchers=r,this.element=document.createTextNode(r.str),n&&n.addChild(this),this.element}})})}(),function(){domain.service("$array",["$http","$resource","$restEndPoint"],function(e,t,n){return function(i,r){var o,a;_.isArray(i)?(a=i,o=r||{}):(a=[],o=_.isPlainObject(i)?i:{});var s=o.endpoint;if(_.isString(i)&&(s=i),a.$watch)return a;var c=[],u=function(){var e=arguments;_.each(c,function(t){t&&t.apply(null,e)})};return a.$watch=function(e){return c.push(e),{detach:function(){var t=c.indexOf(e);c.splice(t,1),delete e}}},a.$removeAll=function(){a.splice(0,a.length)},a.$empty=function(){this.$removeAll()},a.$destroy=function(){a.$removeAll(),_.each(c,function(e){delete e}),c=void 0,delete a},a.$fetch=function(i){var r=this;return new Promise(function(i,o){var a=a||{};if(!s)throw{message:"Can't fetch without the endpoint!"};var c=n(s,a);return e.get(c,a).then(function(e){return r.$removeAll(),_.each(e,function(e){r.push(t(e,{endpoint:s,array:r}))}),i(r)})["catch"](o)})},a.$add=function(){var i=this,r=_.flatten(arguments);return new Promise(function(o,c){return domain.each(r,function(t){var i=_.isFunction(t.$getAttrs)?t.$getAttrs():i;if(t.$err&&(t.$err=void 0),s){var r=n(s,i);return e.post(r,i)}return t}).then(function(e){return _.each(e,function(e){a.push(t(e,{endpoint:s,array:i}))}),o(e)})["catch"](function(e){return _.each(r,function(t){t.$err=e.message&&e.message.message?e.message.message:e}),c(e)})})},a.size=a.length,a.push=function(e){var e=_.isFunction(e.$getAttrs)?e.$getAttrs():e,t=Array.prototype.push.apply(this,[e]);return u("push",e),a.size=a.length,t},a.splice=function(e,t){u("splice",e,t);var n=Array.prototype.splice.apply(this,arguments);return a.size=a.length,n},a.$remove=function(e){return _.isObject(e)&&(e=this.indexOf(e)),this.splice(e,1)},a}})}(),function(){domain.service("$resource",["$restEndPoint","$http"],function(t,n){return function(i,r){var o,a,s={};_.isObject(i)&&(o=i||{},s=r||{},a=s.endpoint),_.isString(i)&&(a=i,o={});var c=s.array;return o.$reset=function(){_.each(this,function(e,t){t.match(/^(\$|_)/)||(this[t]=void 0)},this)},o.$fetch=function(e){return new Promise(function(i,r){if(a){var s=e||{},c=t(a,s);n.get(c,s).then(function(e){return _.each(e,function(e,t){o[t]=e}),i(o)})["catch"](function(e){return r(e)})}})},o.$remove=function(){return new Promise(function(i,r){if(a){var s=t(a,o);n["delete"](s).then(function(){return c&&c.$remove(o),o.$reset(),i()})["catch"](function(){return r(e)})}else if(c)return c.$remove(o),i()})},o}})}(),function(){domain.service("attrs.ws-click",["TagAttribute","$evaluate"],function(e,t){var n=e.extend({create:function(){var e=this,n=function(i){{var r=i.originalEvent?i.originalEvent.target:i.target;t(e.attr,{scope:e.scope,element:r,target:r.$scope,watchVariables:!1})}delete n,i.preventDefault()},i=window.isMobile?"touchend":"click";$(this.element).bind(i,n)}});return n})}(),function(){var e=navigator.userAgent.toLowerCase().indexOf("firefox")>-1;domain.service("attrs.ws-drag",["TagAttribute","$evaluate"],function(t,n){var i=t.extend({create:function(){var t=this,i=function(e){var i=e.e.originalEvent?e.e.originalEvent.target:e.e.target;e.target=i.$scope,e.element=i;n(t.attr,{scope:t.scope,target:e,watchVariables:!1})},r=window.isMobile;$(this.element).bind(r?"touchstart":"mousedown",function(t){e&&t.preventDefault();var n={x:t.clientX,y:t.clientY};i({e:t,coords:n,type:"start"}),$(this).bind(r?"touchmove":"mousemove",function(e){var t=n.x-e.clientX,r=n.y-e.clientY,o={x:t,y:r,dy:0>r?"down":"up",dx:0>t?"right":"left"};i({e:e,coords:o,type:"move"})}),$(this).bind(r?"touchend touchleave touchcancel":"mouseup",function(t){e&&t.preventDefault(),i({e:t,type:"stop"}),$(this).unbind("mouseup mousemove")})})}});return i})}(),function(){domain.service("attrs.ws-href",["TagAttribute","$history"],function(e,t){var n=e.extend({create:function(){this.watcher=this.startWatching()},onValue:function(e){if(e&&e.str){var n=e.str;"A"===this.element.nodeName&&$(this.element).attr("href",n),$(this.element).click(function(e){e.preventDefault(),t.go(n)})}}});return n})}(),function(){domain.service("attrs.ws-submit",["TagAttribute","$evaluate"],function(e,t){var n=e.extend({create:function(){var e=this;$(this.element).submit(function(n){try{var i=n.originalEvent;t(e.attr,{scope:e.scope,element:i.target,target:i.target.$scope,watchVariables:!1})}catch(i){console.error(i.stack||i)}i.preventDefault()})}});return n})}(),function(){domain.service("attrs.ws-value",["TagAttribute","$evaluate"],function(e,t){var n=e.extend({create:function(){this.watcher=this.startWatching()},startWatching:function(){var e,n=this,i=!1,r=t(this.attr,{scope:this.scope,changed:function(e){i===!1&&n.setValue(e.str),i=!1}});return r.locals&&1===r.locals.length&&(e=r.locals[0]),this.bindActions(function(t){e&&(i=!0,e.value.update(t))}),r},setValue:function(e){$(this.element).val(e)},bindActions:function(e){var t=this,n=this.element.nodeName.toLowerCase(),i=$(this.element).attr("type");switch("textarea"===n&&(i=n),"select"===n&&(i=n),"input"!==n||i||(i="text"),i){case"text":case"email":case"password":case"textarea":this.element.addEventListener("keydown",function(n){var i=this;clearInterval(t.interval),t.interval=setTimeout(function(){e($(i).val())},50)},!1);break;case"checkbox":this.element.addEventListener("click",function(t){e(this.checked)});break;case"select":$(this.element).bind("change",function(){var e=($(this).val(),$(this).find("option:selected"));e.length})}}});return n})}(),function(){domain.service("attrs.ws-visible",["TagAttribute"],function(e){var t=e.extend({create:function(){this.watcher=this.startWatching()},onExpression:function(e){e&&(e.value?$(this.element).show(0):$(this.element).hide(0))}});return t})}(),domain.service("controllers.Kukka",function(e,t,n,i){return["kukka.html",function(){window.ctrl=this}]});