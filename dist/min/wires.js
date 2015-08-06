var isarray=_.isArray;!function(){function e(e){for(var t,i=[],r=0,a=0,o="";null!=(t=l.exec(e));){var s=t[0],c=t[1],u=t.index;if(o+=e.slice(a,u),a=u+s.length,c)o+=c[1];else{o&&(i.push(o),o="");var h=t[2],f=t[3],p=t[4],v=t[5],d=t[6],m=t[7],g="+"===d||"*"===d,w="?"===d||"*"===d,y=h||"/",b=p||v||(m?".*":"[^"+y+"]+?");i.push({name:f||r++,prefix:h||"",delimiter:y,optional:w,repeat:g,pattern:n(b)})}}return a<e.length&&(o+=e.substr(a)),o&&i.push(o),i}function t(e){return e.replace(/([.+*?=^!:${}()[\]|\/])/g,"\\$1")}function n(e){return e.replace(/([=!:$\/()])/g,"\\$1")}function i(e,t){return e.keys=t,e}function r(e){return e.sensitive?"":"i"}function a(e,t){var n=e.source.match(/\((?!\?)/g);if(n)for(var r=0;r<n.length;r++)t.push({name:r,prefix:null,delimiter:null,optional:!1,repeat:!1,pattern:null});return i(e,t)}function o(e,t,n){for(var a=[],o=0;o<e.length;o++)a.push(u(e[o],t,n).source);var s=new RegExp("(?:"+a.join("|")+")",r(n));return i(s,t)}function s(t,n,r){for(var a=e(t),o=c(a,r),s=0;s<a.length;s++)"string"!=typeof a[s]&&n.push(a[s]);return i(o,n)}function c(e,n){n=n||{};for(var i=n.strict,a=n.end!==!1,o="",s=e[e.length-1],c="string"==typeof s&&/\/$/.test(s),u=0;u<e.length;u++){var l=e[u];if("string"==typeof l)o+=t(l);else{var h=t(l.prefix),f=l.pattern;l.repeat&&(f+="(?:"+h+f+")*"),f=l.optional?h?"(?:"+h+"("+f+"))?":"("+f+")?":h+"("+f+")",o+=f}}return i||(o=(c?o.slice(0,-2):o)+"(?:\\/(?=$))?"),o+=a?"$":i&&c?"":"(?=\\/|$)",new RegExp("^"+o,r(n))}function u(e,t,n){return t=t||[],isarray(t)?n||(n={}):(n=t,t=[]),e instanceof RegExp?a(e,t,n):isarray(e)?o(e,t,n):s(e,t,n)}window.pathToRegexp=u;var l=new RegExp(["(\\\\.)","([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^()])+)\\))?|\\(((?:\\\\.|[^()])+)\\))([+*?])?|(\\*))"].join("|"),"g")}();var Wires=Wires||{};!function(){var e=function(e,t){var n,i=this;n=e&&_.has(e,"constructor")?e.constructor:function(){return i.apply(this,arguments)},_.extend(n,i,t);var r=function(){this.constructor=n};return r.prototype=i.prototype,n.prototype=new r,e&&_.extend(n.prototype,e),n.__super__=i.prototype,n.prototype.__parent__=function(e,t){n.__super__[e].apply(n.prototype,t)},n},t=function(e,t){this.initialize&&this.initialize.apply(this,arguments)};t.extend=e,Wires.Class=t}(),function t(e,n,i){function r(o,s){if(!n[o]){if(!e[o]){var c="function"==typeof require&&require;if(!s&&c)return c(o,!0);if(a)return a(o,!0);var u=new Error("Cannot find module '"+o+"'");throw u.code="MODULE_NOT_FOUND",u}var l=n[o]={exports:{}};e[o][0].call(l.exports,function(t){var n=e[o][1][t];return r(n?n:t)},l,l.exports,t,e,n,i)}return n[o].exports}for(var a="function"==typeof require&&require,o=0;o<i.length;o++)r(i[o]);return r}({1:[function(e,t,n){function i(){}var r=t.exports={};r.nextTick=function(){var e="undefined"!=typeof window&&window.setImmediate,t="undefined"!=typeof window&&window.postMessage&&window.addEventListener;if(e)return function(e){return window.setImmediate(e)};if(t){var n=[];return window.addEventListener("message",function(e){var t=e.source;if((t===window||null===t)&&"process-tick"===e.data&&(e.stopPropagation(),n.length>0)){var i=n.shift();i()}},!0),function(e){n.push(e),window.postMessage("process-tick","*")}}return function(e){setTimeout(e,0)}}(),r.title="browser",r.browser=!0,r.env={},r.argv=[],r.on=i,r.addListener=i,r.once=i,r.off=i,r.removeListener=i,r.removeAllListeners=i,r.emit=i,r.binding=function(e){throw new Error("process.binding is not supported")},r.cwd=function(){return"/"},r.chdir=function(e){throw new Error("process.chdir is not supported")}},{}],2:[function(e,t,n){"use strict";function i(e){function t(e){return null===c?void l.push(e):void o(function(){var t=c?e.onFulfilled:e.onRejected;if(null===t)return void(c?e.resolve:e.reject)(u);var n;try{n=t(u)}catch(i){return void e.reject(i)}e.resolve(n)})}function n(e){try{if(e===h)throw new TypeError("A promise cannot be resolved with itself.");if(e&&("object"==typeof e||"function"==typeof e)){var t=e.then;if("function"==typeof t)return void a(t.bind(e),n,i)}c=!0,u=e,s()}catch(r){i(r)}}function i(e){c=!1,u=e,s()}function s(){for(var e=0,n=l.length;n>e;e++)t(l[e]);l=null}if("object"!=typeof this)throw new TypeError("Promises must be constructed via new");if("function"!=typeof e)throw new TypeError("not a function");var c=null,u=null,l=[],h=this;this.then=function(e,n){return new h.constructor(function(i,a){t(new r(e,n,i,a))})},a(e,n,i)}function r(e,t,n,i){this.onFulfilled="function"==typeof e?e:null,this.onRejected="function"==typeof t?t:null,this.resolve=n,this.reject=i}function a(e,t,n){var i=!1;try{e(function(e){i||(i=!0,t(e))},function(e){i||(i=!0,n(e))})}catch(r){if(i)return;i=!0,n(r)}}var o=e("asap");t.exports=i},{asap:4}],3:[function(e,t,n){"use strict";function i(e){this.then=function(t){return"function"!=typeof t?this:new r(function(n,i){a(function(){try{n(t(e))}catch(r){i(r)}})})}}var r=e("./core.js"),a=e("asap");t.exports=r,i.prototype=r.prototype;var o=new i(!0),s=new i(!1),c=new i(null),u=new i(void 0),l=new i(0),h=new i("");r.resolve=function(e){if(e instanceof r)return e;if(null===e)return c;if(void 0===e)return u;if(e===!0)return o;if(e===!1)return s;if(0===e)return l;if(""===e)return h;if("object"==typeof e||"function"==typeof e)try{var t=e.then;if("function"==typeof t)return new r(t.bind(e))}catch(n){return new r(function(e,t){t(n)})}return new i(e)},r.all=function(e){var t=Array.prototype.slice.call(e);return new r(function(e,n){function i(a,o){try{if(o&&("object"==typeof o||"function"==typeof o)){var s=o.then;if("function"==typeof s)return void s.call(o,function(e){i(a,e)},n)}t[a]=o,0===--r&&e(t)}catch(c){n(c)}}if(0===t.length)return e([]);for(var r=t.length,a=0;a<t.length;a++)i(a,t[a])})},r.reject=function(e){return new r(function(t,n){n(e)})},r.race=function(e){return new r(function(t,n){e.forEach(function(e){r.resolve(e).then(t,n)})})},r.prototype["catch"]=function(e){return this.then(null,e)}},{"./core.js":2,asap:4}],4:[function(e,t,n){(function(e){function n(){for(;r.next;){r=r.next;var e=r.task;r.task=void 0;var t=r.domain;t&&(r.domain=void 0,t.enter());try{e()}catch(i){if(c)throw t&&t.exit(),setTimeout(n,0),t&&t.enter(),i;setTimeout(function(){throw i},0)}t&&t.exit()}o=!1}function i(t){a=a.next={task:t,domain:c&&e.domain,next:null},o||(o=!0,s())}var r={task:void 0,next:null},a=r,o=!1,s=void 0,c=!1;if("undefined"!=typeof e&&e.nextTick)c=!0,s=function(){e.nextTick(n)};else if("function"==typeof setImmediate)s="undefined"!=typeof window?setImmediate.bind(window,n):function(){setImmediate(n)};else if("undefined"!=typeof MessageChannel){var u=new MessageChannel;u.port1.onmessage=n,s=function(){u.port2.postMessage(0)}}else s=function(){setTimeout(n,0)};t.exports=i}).call(this,e("_process"))},{_process:1}],5:[function(e,t,n){"function"!=typeof Promise.prototype.done&&(Promise.prototype.done=function(e,t){var n=arguments.length?this.then.apply(this,arguments):this;n.then(null,function(e){setTimeout(function(){throw e},0)})})},{}],6:[function(e,t,n){e("asap");"undefined"==typeof Promise&&(Promise=e("./lib/core.js"),e("./lib/es6-extensions.js")),e("./polyfill-done.js")},{"./lib/core.js":2,"./lib/es6-extensions.js":3,"./polyfill-done.js":5,asap:4}]},{},[6]),function(e){function t(e){var t=/((\/\/.*$)|(\/\*[\s\S]*?\*\/))/gm,n=/([^\s,]+)/g,i=e.toString().replace(t,""),r=i.slice(i.indexOf("(")+1,i.indexOf(")")).match(n);return null===r&&(r=[]),r}var n={};e.domain={constructModel:function(e,t,n){var i=new t;this.require({source:t.prototype.init,target:i.init,instance:i},e).then(function(e){n(null,i)})["catch"](function(e){n(e)})},getInputArguments:function(e){var t={};if(t.localServices={},e.length>0){if(t.source=e[0],t.target=e[0],_.isPlainObject(e[0])){var n=e[0];t.target=n.target,t.source=n.source,t.instance=n.instance}if(e.length>1){var i=_.isString(e[0])||_.isArray(e[0]);i?(t.source=_.isArray(e[0])?e[0]:_.isString(e[0])?[e[0]]:e[0],_.isFunction(e[1])&&(t.target=e[1]),_.isFunction(e[2])&&(t.target=e[2])):(_.isFunction(e[1])&&(t.callReady=e[1]),_.isPlainObject(e[1])&&(t.localServices=e[1]))}3===e.length&&(_.isPlainObject(e[1])&&(t.localServices=e[1]),_.isFunction(e[2])&&(t.callReady=e[2]))}return t.target=t.target||function(){},t.source=t.source?t.source:t.target,t.callReady=t.callReady||function(){},t},service:function(){this.register.apply(this,arguments)},register:function(e,t,i){var r=null,a=t;_.isArray(t)&&(r=t,a=i),n[e]={target:a,args:r}},requirePackage:function(e){var t={};return this.each(n,function(n,i){var r=i.split(".")[0];return r===e?domain.require([i],function(e){t[i]=e}):void 0}).then(function(){return t})},require:function(){var e=this.getInputArguments(arguments),i=this,r=e.localServices,a=_.isArray(e.source)?e.source:t(e.source),o=e.target,s=(e.callReady,e.instance),c=n,i=this,u=new Promise(function(t,n){var u=[],l=_.merge(r,c);for(var h in a){var f=(a[h],a[h]);if(!l[f])return console.error("Error while injecting variable '"+f+"' into function \n"+e.source.toString()),n({status:500,message:"Service with name '"+f+"' was not found "});u.push(l[f])}return i.each(u,function(e){var t=e.target,n=e.args;if(_.isFunction(t)){var a=[];return a=n?[n,r,t]:[t,r],i.require.apply(i,a)}return t}).then(function(e){return delete i,o.apply(s||e,e)}).then(t)["catch"](n)});return u},isServiceRegistered:function(e){return void 0!==n[e]},each:function(e,t){return new Promise(function(n,i){var r=[],a=_.isPlainObject(e),o=-1,s=function(){if(o++,!(o<_.size(e)))return n(r);var c,u;a?(c=_.keys(e)[o],u=e[c]):(c=o,u=e[o]);var l=t.call(t,u,c);l instanceof Promise?l.then(function(e){r.push(e),s()})["catch"](i):(r.push(l),s())};s()})}}}(window),function(){RegExp.prototype.execAll=function(e){for(var t=null,n=new Array;t=this.exec(e);){var r=[];for(i in t)parseInt(i)==i&&r.push(t[i]);n.push(r)}return n}}(),function(){window.isMobile=!1,(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4)))&&(window.isMobile=!0);var e=1;Object.defineProperty(Object.prototype,"__uniqueId",{writable:!0}),Object.defineProperty(Object.prototype,"uniqueId",{get:function(){return void 0==this.__uniqueId&&(this.__uniqueId=e++),this.__uniqueId}})}(),function(){Object.defineProperty(Object.prototype,"watch",{enumerable:!1,configurable:!0,writable:!1,value:function(e,t){var n=this[e],i=n,r=function(){return i},a=function(r){return n=i,i=t.call(this,e,n,r)};delete this[e]&&Object.defineProperty(this,e,{get:r,set:a,enumerable:!0,configurable:!0})}}),Object.defineProperty(Object.prototype,"unwatch",{enumerable:!1,configurable:!0,writable:!1,value:function(e){var t=this[e];delete this[e],this[e]=t}})}(),function(){domain.service("$evaluate",["$watch","$pathObject","$exec","$proxy"],function(e,t,n,i){return function(r,a){var a=a||[],o=a.scope||{},s=a.target,c=a.changed,u=void 0!==a.watchVariables?a.watchVariables:!0,l=[],h=function(){var e=r.tpl,a=[],u=[];_.each(r.vars,function(i,r){var c;i.p?(path=t(i.p,o),c=path.value,u.push({path:i.p,value:path})):i.e&&(c=n.expression(i.e,o,s),a.push({str:i.e,value:c})),c=void 0===c?"":c,e=e.split(r).join(c)});for(var h in r.x){var f=r.x[h],p=i.exec(f,o);e=e.split(h).join(p)}for(var h in r.funcs){var v=r.funcs[h],d=t(v.p,o).value;if(_.isFunction(d)){var m=n.func(v.f,o,s);e=e.split(h).join(void 0!==m?m:"")}else e=e.split(h).join("")}var g={str:e,expressions:a,locals:u,detach:function(){_.each(l,function(e){e.remove()})}};return _.isFunction(c)&&c(g),g};if(u){var f={},p=function(e){_.each(e,function(e){if(e.p){var t=e.p.join(".");f[t]||(f[t]=e)}e.e&&p(e.v)})};p(r.vars),_.each(r.x,function(t){var n=i.getProxy(t);if(n){var r=e("_changed",n,function(e,t){h()});l.push(r)}}),_.each(f,function(t){var n=e(t.p,o,function(e,t){_.defer(function(){h()})});n&&l.push(n)})}return h()}})}(),function(){var _cache={},getFunctionFromString=function(stringFunction){var userFunc;return _cache[stringFunction]?userFunc=_cache[stringFunction]:(userFunc=eval("(function($, target){ return "+stringFunction+"})"),_cache[stringFunction]=userFunc),_cache[stringFunction]};domain.service("$exec",["$pathObject"],function(e){return{func:function(e,t,n){var i=getFunctionFromString(e),r=i.bind(t)(t,n);return r},expression:function(e,t,n){var i=getFunctionFromString(e),r=i.bind(t)(t,n);return r}}})}(),function(){domain.service("$loadView",function(){return function(e){return new Promise(function(t,n){return t(window.__wires_views__[e]?window.__wires_views__[e]:[])})}})}(),function(){domain.service("$pathObject",function(){return function(e,t){_.isArray(e)||(e=e.split("."));var n=t,i=null;return _.each(e,function(t,r){e.length-1===r?i=t:void 0!==n[t]?n=n[t]:(n[t]={},n=n[t])}),{update:function(e){return n[i]=e,e},value:n[i],property:i,instance:n}}})}(),function(){var e={};domain.service("$proxy",["$projectProxies"],function(t){return{getProxy:function(n){var i=n.n,r=t[i];if(r){var a=e[i];return a||(a=e[i]=new r),a}},exec:function(e,t){var n=this.getProxy(e);return n?n.get(e.k,t):""}}})}(),function(){domain.service("$run",["TagNode","TextNode","Repeater","Conditional"],function(e,t,n,i){var r=function(a){var a=a||{},o=a.structure||[],s=a.target||document.querySelector("section"),c=a.scope||{},u=function(a,o){_.each(a,function(a){var s;if(1===a.t&&(s=new t(a,c),s.create(o)),2===a.t){s=new e(a,c);{s.create(o)}a.c&&u(a.c,s)}if(3===a.t){new n({run:r,item:a,parent:o,scope:c})}if(4===a.t){new i({run:r,item:a,parent:o,scope:c})}})},l=a.parentNode||new e(s);l.element||l.setElement(s),u(o,l)};return r})}(),function(){domain.service("$watch",["$pathObject","$array","$projectProxies"],function(e,t,n){return function(n,i,r){var a=e(n,i),o=a.instance,s=a.property;return o.$watchers||(o.$watchers={}),_.isArray(o)&&(o=t(o)),_.isObject(o)||!_.isString(s)?(o.$watchers[s]||(o.$watchers[s]=[]),r&&o.$watchers[s].push(r),1===o.$watchers[s].length&&o.watch(s,function(e,t,n){return _.each(o.$watchers[s],function(e){e(t,n)}),n}),{remove:function(){var e=o.$watchers[s].indexOf(r);o.$watchers[s].splice(e,1),delete r},removeAll:function(){o.unwatch(s),delete o.$watchers}}):void 0}})}(),function(){domain.service("$restEndPoint",function(){return function(e,t){var t=t||{},n=e.split("/"),i=[];return _.each(n,function(e){var n=e.match(/:(.+)/);n?t.hasOwnProperty(n[1])&&i.push(t[n[1]]):i.push(e)}),i.join("/")}})}(),function(){var e;domain.service("$customAttributes",function(){return new Promise(function(t,n){return e?t(e):void domain.requirePackage("attrs").then(function(n){return e=n,t(e)})})})}(),function(){domain.service("$form",function(){return function(){var e={};return e.$getAttrs=function(){var e={};return _.each(this,function(t,n){n.match(/^(\$|_)/)||(e[n]=t)}),e},e.$reset=function(){_.each(this,function(e,t){t.match(/^(\$|_)/)||(_.isArray(this[t])?this[t].$removeAll():this[t]=void 0)},this)},e}})}(),function(){var e;domain.service("$history",function(){if(e)return e;var t=Wires.Class.extend({initialize:function(){var e=this;this.events={},window.onpopstate=function(){e.trigger("change")}},trigger:function(e){_.isArray(this.events[e])&&_.each(this.events[e],function(e){e()})},on:function(e,t){this.events[e]||(this.events[e]=[]),this.events[e].push(t)},go:function(e){var t={url:e};history.pushState(t,e,e),this.trigger("change")}});return e=new t})}(),function(){domain.register("$http",function(){return{_request:function(e,t,n,i,r){var a={url:t,contentType:"application/json; charset=UTF-8",method:e,data:JSON.stringify(n),dataType:"json"};"GET"===e&&(a.data=n);var o=$.ajax(a);o.always(function(e,t){return"success"!==t?r({status:e.status,message:e.responseJSON||e.statusText}):i(e)})},"delete":function(e,t){var n=this;return new Promise(function(i,r){n._request("DELETE",e,t,function(e){i(e)},function(e){r(e)})})},getHTML:function(e){return new Promise(function(t,n){$.get(e,function(e){return e=e.replace(/(\r\n|\n|\r)/gm,""),t(e)})})},get:function(e,t){var n=this;return new Promise(function(i,r){n._request("GET",e,t,function(e){i(e)},function(e){r(e)})})},post:function(e,t){var n=this;return new Promise(function(i,r){n._request("POST",e,t,function(e){i(e)},function(e){r(e)})})},put:function(e,t){var n=this;return new Promise(function(i,r){n._request("PUT",e,t,function(e){i(e)},function(e){r(e)})})}}})}(),function(){var e=0;domain.service("$load",["$queryString","$loadView","$run"],function(t,n,i){return{component:function(e,t){},controller:function(r,a){var a=(window.location.url,a||{}),o=a.parent,s=t();a.params&&(s=_.merge(s,a.params));var c={$params:{target:s}};return a.injections&&_.each(a.injections,function(e,t){c[t]={target:e}}),domain.require([r],c,function(t){if(e++,_.isArray(t)&&!(t.length<2)){var r=t[0].match(/^([^\s]+)(\s*->\s*([^\s]+))?/i),a=t[1];if(r){var s=r[1],c=r[3]||"section",u=null;if(u=o&&o.element?$(o.element).find(c)[0]:document.querySelector(c),!u)throw{message:"Can't find a target "};var l=new a;for(u.$tag&&u.$tag.detachAllEvents&&u.$tag.detachAllEvents();u.firstChild;)u.removeChild(u.firstChild);return n(s).then(function(e){return i({structure:e,target:u,scope:l}),{scope:l,element:u}})}}})}}})}(),function(){var e;domain.service("$projectProxies",function(){return e?e:new Promise(function(t,n){domain.requirePackage("proxies").then(function(n){return e={},_.each(n,function(t,n){var i=n.slice(8,n.length);e[i]=t}),t(e)})})})}(),function(){domain.service("$queryString",function(){var e=function(){for(var e={},t=window.location.search.substring(1),n=t.split("&"),i=0;i<n.length;i++){var r=n[i].split("=");if("undefined"==typeof e[r[0]])e[r[0]]=decodeURIComponent(r[1]);else if("string"==typeof e[r[0]]){var a=[e[r[0]],decodeURIComponent(r[1])];e[r[0]]=a}else e[r[0]].push(decodeURIComponent(r[1]))}return e};return e})}(),function(){var e=Wires.Class.extend({initialize:function(){this.states=[],this.loaded=!1},set:function(e,t,n){this.route=e,this.controller=t,this.states=n},getControllerPath:function(){return"controllers."+this.controller},matches:function(){var e,t=window.location.pathname,n=[],i=pathToRegexp(this.route,n),r={};return(e=i.exec(t))?(_.each(n,function(t,n){r[t.name]=e[n+1]}),r):void 0}}),t=new e;domain.register("$router",["$load","$queryString","$loadView","$run","$history"],function(n,i,r,a,o){return{add:function(){var e=this.state.apply(this,arguments);t.states.push(e)},state:function(t,n,i){var r=new e;return r.set.apply(r,arguments),r},_start:function(e){var t=this;_.each(e.states,function(e){var n;return(n=e.matches())?(t.stack.push(e),e.states&&t._start(e),!1):void 0})},loadStates:function(e){var t,i=((new Date).getTime(),this);return i.historyStack=i.historyStack||[],domain.each(e,function(r,a){var o=i.historyStack[a],s=a+1===e.length;return o&&!s&&o.route===r.route?void(t=r.parent):n.controller(r.getControllerPath(),{parent:t}).then(function(e){r.loaded=!0,r.parent=e,t=e})}).then(function(e){i.historyStack=[],_.each(i.stack,function(e){i.historyStack.push(e)}),i.stack=[]})["catch"](function(e){console.error(e||e.stack)})},start:function(){var e=this;e.stack=[],e._start(t),e.loadStates(e.stack),o.on("change",function(n){e.stack=[],e._start(t),e.loadStates(e.stack)})}}})}(),function(){domain.service("Conditional",["TagNode","$pathObject","$array","$watch","$evaluate","$pathObject"],function(e,t,n,i,r,t){return Wires.Class.extend({initialize:function(n){var i=this;this.item=n.item,this.run=n.run,this.parent=n.parent,this.scope=n.scope;var a=i.item.c[0];if(this.attachedScopePath,a.a&&a.a["ws-bind"]){var o=a.a["ws-bind"];if(_.values(o.vars).length>0){var s=_.values(o.vars)[0];this.attachedScopePath=s.p}}this.element=document.createComment(" if "),this.parent.addChild(this),this.watchers=r(this.item.z,{scope:i.scope,element:{},target:{},changed:function(n){if(n.expressions&&n.expressions.length>0){var r=n.expressions[0].value;if(r){if(void 0===i.parentElement){var o=i.scope;i.attachedScopePath&&(o=t(i.attachedScopePath,o).value);var s=new e(a,o);s.create(),i.parentElement=s.element,i.run({structure:a.c||[],parentNode:s,scope:o}),i.element.parentNode.insertBefore(s.element,i.element.nextSibling)}}else i.parentElement&&($(i.parentElement).remove(),i.parentElement=void 0)}}})}})})}(),function(){domain.service("Proxy",function(){return Wires.Class.extend({initialize:function(){this.callbacks=[],this._changed=1,this.init()},init:function(){},update:function(){this._changed=1},addCallback:function(e,t){var n=e.bind({proxy:this,path:t});this.callbacks.push(n),n(null,this.get(t))},get:function(e){}},{name:"ss"})})}(),domain.service("Repeater",["TagNode","$pathObject","$array","$watch"],function(e,t,n,i){return Wires.Class.extend({initialize:function(e){var r=this;this.item=e.item,this.run=e.run,this.parent=e.parent,this.scope=e.scope;var a=this.item.v;if(!a.vars)throw{error:"Repeater expects variables! e.g $item in items"};if(2!==_.keys(a.vars).length)throw{error:"Repeater expects 2 variables. Scope key and Target Array (e.g $item in items)"};this.scopeKey=a.vars.__v0.p.join(""),i(a.vars.__v1.p,this.scope,function(e,t){r.array=n(t),r.element||(r.element=document.createComment("repeat "+r.scopeKey),r.parent.addChild(r)),r.assign()});var o=t(a.vars.__v1.p,this.scope),s=o.value?o.value:o.update([]);this.array=n(s),this.element=document.createComment("repeat "+this.scopeKey),this.parent.addChild(this),this.assign()},assign:function(){this.watchers=this.array.$watch(this.onEvent.bind(this)),this._arrayElements=[],this.createInitialElements()},createInitialElements:function(){var e=this;_.each(this.array,function(t){e.addItem(t)})},addItem:function(t){var n=this.item.i[0],i={parent:this.scope,index:this._arrayElements.length};i[this.scopeKey]=t;var r=new e(n,i);r.create();var a=this.element,o=this._arrayElements.length;o>0&&(a=this._arrayElements[o-1]);var s=a.node?a.node.element:a;s.parentNode.insertBefore(r.element,s.nextSibling),this._arrayElements.push({node:r,localScope:i}),this.element.$scope=i,this.element.$tag=self,this.run({structure:n.c||[],parentNode:r,scope:i})},removeItem:function(e,t){for(var n=e;e+t>n;n++)if(this._arrayElements[n]){var i=this._arrayElements[n].node.element;$(i).remove()}this._arrayElements.splice(e,t),_.each(this._arrayElements,function(e,t){e.localScope.index=t})},onEvent:function(e,t,n){"push"===e&&this.addItem(t),"splice"===e&&this.removeItem(t,n)}})}),domain.service("TagAttribute",["$evaluate"],function(e){var t=Wires.Class.extend({initialize:function(e){this.attr=e.attr,this.name=e.name,this.scope=e.scope,this.element=e.element},create:function(){this.attribute=document.createAttribute(this.name),this.element.setAttributeNode(this.attribute),this.watcher=this.startWatching()},onValue:function(e){this.attribute.value=e.str},startWatching:function(){var t=this;return e(this.attr,{scope:this.scope,changed:function(e){t.onExpression?e.expressions&&e.expressions.length>0?t.onExpression.bind(t)(e.expressions[0]):t.onExpression.bind(t)():t.onValue&&t.onValue.bind(t)(e)}})}});return t}),domain.service("$tagAttrs",["TagAttribute","$evaluate","$customAttributes"],function(e,t,n){return{create:function(t,i,r){var a=[];return _.each(t.a,function(t,o){var s,c="attrs."+o,u={scope:i,attr:t,name:o,element:r};s=n[c]?new n[c](u):new e(u),s?(s.create(),a.push(s)):console.log("no attr",c)}),a}}}),domain.service("TagNode",["$tagAttrs"],function(e){return Wires.Class.extend({initialize:function(e,t){this.item=e,this.scope=t,this.children=[];var n=this;this.detachAllEvents=function(){_.each(n.attributes,function(e){e.watcher&&(_.isArray(e.watcher)?_.each(e.watcher,function(e){e.detach()}):e.watcher.detach()),_.isFunction(e.detach)&&e.detach()}),_.each(n.children,function(e){e.watchers&&(e.watchers.detach(),delete e),e.onRemove&&e.onRemove(),delete e}),$(n.element).unbind(),n.element&&n.element.removeEventListener("DOMNodeRemovedFromDocument",n.detachAllEvents),delete n.attributes,delete n.children,n.element&&(delete n.element.$scope,delete n.element.$tag),delete n.element}},setElement:function(e){this.element=e,this.element.$scope=this.scope,this.element.$tag=this},create:function(e){return this.setElement(document.createElement(this.item.n)),e&&e.addChild(this),this.startWatching(),this.element},addChild:function(e){$(this.element).append(e.element),this.children.push(e)},attachGarbageCollector:function(){this.element.addEventListener("DOMNodeRemovedFromDocument",this.detachAllEvents)},startWatching:function(){this.attributes=e.create(this.item,this.scope,this.element),this.attachGarbageCollector()}})}),function(){var e=1;domain.service("TextNode",["$evaluate"],function(t){return Wires.Class.extend({initialize:function(e,t){this.item=e,this.scope=t},onDetach:function(){},create:function(n){var i=this;this.firstLoad=!0;var r=watcher=t(this.item.d,{scope:this.scope,changed:function(t){e++,i.firstLoad===!1&&(i.element.nodeValue=t.str),i.firstLoad=!1}});return this.watchers=r,this.element=document.createTextNode(r.str),n&&n.addChild(this),this.element}})})}(),function(){domain.service("$array",["$http","$resource","$restEndPoint"],function(e,t,n){return function(i,r){var a,o;_.isArray(i)?(o=i,a=r||{}):(o=[],a=_.isPlainObject(i)?i:{});var s=a.endpoint;if(_.isString(i)&&(s=i),o.$watch)return o;var c=[],u=function(){var e=arguments;_.each(c,function(t){t&&t.apply(null,e)})};return o.$watch=function(e){return c.push(e),{detach:function(){var t=c.indexOf(e);c.splice(t,1),delete e}}},o.$removeAll=function(){o.splice(0,o.length)},o.$empty=function(){this.$removeAll()},o.$destroy=function(){o.$removeAll(),_.each(c,function(e){delete e}),c=void 0,delete o},o.$fetch=function(i){var r=this;return new Promise(function(i,a){var o=o||{};if(!s)throw{message:"Can't fetch without the endpoint!"};var c=n(s,o);return e.get(c,o).then(function(e){return r.$removeAll(),_.each(e,function(e){r.push(t(e,{endpoint:s,array:r}))}),i(r)})["catch"](a)})},o.$add=function(){var i=this,r=_.flatten(arguments);return new Promise(function(a,c){return domain.each(r,function(t){var i=_.isFunction(t.$getAttrs)?t.$getAttrs():i;if(t.$err&&(t.$err=void 0),s){var r=n(s,i);return e.post(r,i)}return t}).then(function(e){return _.each(e,function(e){o.push(t(e,{endpoint:s,array:i}))}),a(e)})["catch"](function(e){return _.each(r,function(t){t.$err=e.message&&e.message.message?e.message.message:e}),c(e)})})},o.size=o.length,o.push=function(e){var e=_.isFunction(e.$getAttrs)?e.$getAttrs():e,t=Array.prototype.push.apply(this,[e]);return u("push",e),o.size=o.length,t},o.splice=function(e,t){u("splice",e,t);var n=Array.prototype.splice.apply(this,arguments);return o.size=o.length,n},o.$remove=function(e){return _.isObject(e)&&(e=this.indexOf(e)),this.splice(e,1)},o}})}(),function(){domain.service("$resource",["$restEndPoint","$http"],function(t,n){return function(i,r){var a,o,s={};_.isObject(i)&&(a=i||{},s=r||{},o=s.endpoint),_.isString(i)&&(o=i,a={});var c=s.array;return a.$reset=function(){_.each(this,function(e,t){t.match(/^(\$|_)/)||(this[t]=void 0)},this)},a.$fetch=function(e){return new Promise(function(i,r){if(o){var s=e||{},c=t(o,s);n.get(c,s).then(function(e){return _.each(e,function(e,t){a[t]=e}),i(a)})["catch"](function(e){return r(e)})}})},a.$remove=function(){return new Promise(function(i,r){if(o){var s=t(o,a);n["delete"](s).then(function(){return c&&c.$remove(a),a.$reset(),i()})["catch"](function(){return r(e)})}else if(c)return c.$remove(a),i()})},a}})}(),function(){domain.service("attrs.ws-checked",["TagAttribute","$array"],function(e,t){var n=e.extend({create:function(){var e=this.element.$variable;e&&(this.currentValue=e.value.value),this.watcher=[],this.watcher.push(this.startWatching()),this.arrayWatcher=!1},onValue:function(e){var n=this;if(this.selfUpdate===!0)return void(this.selfUpdate=!1);var i=e.locals[0].value,r=e.locals[0].value.value;if(this.element.$checked=i,_.isArray(r)){if(r=t(r),this.arrayWatcher||(this.watcherCreated=!0,this.arrayWatcher=r.$watch(function(e,t,i){var a;if("splice"===e)for(var o=t;i>=o;o++){var s=r[o];s===n.currentValue&&n.element.checked===!0&&(n.element.checked=!1)}else if(n.currentValue===t){var a=r.indexOf(t)>-1;n.element.checked=a}}),n.watcher.push(n.arrayWatcher)),this.currentValue){var a=r.indexOf(this.currentValue)>-1;this.element.checked=a?!0:!1}}else this.selfUpdate=!0,i.update(r?!0:!1)}});return n})}(),function(){domain.service("attrs.ws-class",["TagAttribute"],function(e){var t=e.extend({create:function(){this.watcher=this.startWatching()},onExpression:function(e){var t=$(this.element);e&&_.isPlainObject(e.value)&&_.each(e.value,function(e,n){e?t.hasClass(n)||t.addClass(n):t.removeClass(n)})}});return t})}(),function(){domain.service("attrs.ws-click",["TagAttribute","$evaluate"],function(e,t){var n=e.extend({create:function(){var e=this,n=function(i){{var r=i.originalEvent?i.originalEvent.target:i.target;t(e.attr,{scope:e.scope,element:r,target:r.$scope,watchVariables:!1})}delete n,i.preventDefault()},i=window.isMobile?"touchend":"click";$(this.element).bind(i,n)}});return n})}(),function(){var e=navigator.userAgent.toLowerCase().indexOf("firefox")>-1;domain.service("attrs.ws-drag",["TagAttribute","$evaluate"],function(t,n){var i=t.extend({create:function(){var t=this,i=function(e){var i=e.e.originalEvent?e.e.originalEvent.target:e.e.target;e.target=i.$scope,e.element=i;n(t.attr,{scope:t.scope,target:e,watchVariables:!1})},r=window.isMobile;$(this.element).bind(r?"touchstart":"mousedown",function(t){e&&t.preventDefault();var n={x:t.clientX,y:t.clientY};i({e:t,coords:n,type:"start"}),$(this).bind(r?"touchmove":"mousemove",function(e){var t=n.x-e.clientX,r=n.y-e.clientY,a={x:t,y:r,dy:0>r?"down":"up",dx:0>t?"right":"left"};i({e:e,coords:a,type:"move"})}),$(this).bind(r?"touchend touchleave touchcancel":"mouseup",function(t){e&&t.preventDefault(),i({e:t,type:"stop"}),$(this).unbind("mouseup mousemove")})})}});return i})}(),function(){domain.service("attrs.ws-href",["TagAttribute","$history"],function(e,t){var n=e.extend({create:function(){this.watcher=this.startWatching()},onValue:function(e){if(e&&e.str){var n=e.str;"A"===this.element.nodeName&&$(this.element).attr("href",n),$(this.element).click(function(e){e.preventDefault(),t.go(n)})}}});return n})}(),function(){domain.service("attrs.ws-submit",["TagAttribute","$evaluate"],function(e,t){
var n=e.extend({create:function(){var e=this;$(this.element).submit(function(n){try{var i=n.originalEvent;t(e.attr,{scope:e.scope,element:i.target,target:i.target.$scope,watchVariables:!1})}catch(i){console.error(i.stack||i)}i.preventDefault()})}});return n})}(),function(){domain.service("attrs.ws-value",["TagAttribute","$evaluate"],function(e,t){var n=e.extend({create:function(){this.watcher=this.startWatching()},startWatching:function(){var e=this,n=!1,i=t(this.attr,{scope:this.scope,changed:function(t){n===!1&&e.setValue(t.str),n=!1}});return this.variable,i.locals&&1===i.locals.length&&(this.variable=i.locals[0]),this.element.$variable=this.variable,this.bindActions(function(t){e.variable&&(n=!0,e.variable.value.update(t))}),i},setValue:function(e){$(this.element).val(e)},bindActions:function(e){var t=this,n=this.element.nodeName.toLowerCase(),i=$(this.element).attr("type");switch("textarea"===n&&(i=n),"select"===n&&(i=n),"option"===n&&(i=n),"input"!==n||i||(i="text"),i){case"text":case"email":case"password":case"textarea":this.element.addEventListener("keydown",function(n){var i=this;clearInterval(t.interval),t.interval=setTimeout(function(){e($(i).val())},50)},!1);break;case"checkbox":this.element.addEventListener("click",function(e){var n=this.$checked;if(_.isArray(n.value)){var i=t.variable.value.value,r=n.value.indexOf(i);this.checked?-1===r&&n.value.push(i):r>-1&&n.value.splice(r,1)}else t.variable.value.update(this.checked)});break;case"option":break;case"select":$(this.element).change(function(){var n=t.detectSelectValue();e(n)}),_.defer(function(){if(void 0!==t.variable.value.value)$(t.element).find("option").each(function(e,n){n.$variable&&n.$variable.value.value===t.variable.value.value&&(n.selected=!0)});else{var e=t.detectSelectValue(!0);t.variable.value.update(e)}})}},detectSelectValue:function(e){var t;return $(this.element).find(e?"option:first":"option:selected").each(function(){var e=this,n=this.$tag,i=this.$variable;i?t=i.value.value:(_.each(n.attributes,function(n){"value"===n.name&&(t=$(e).val())}),void 0===t&&(t=$(e).html()))}),t}});return n})}(),function(){domain.service("attrs.ws-visible",["TagAttribute"],function(e){var t=e.extend({create:function(){this.watcher=this.startWatching()},onExpression:function(e){e&&(e.value?$(this.element).show(0):$(this.element).hide(0))}});return t})}();