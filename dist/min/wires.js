var isarray=_.isArray;!function(){function t(t){for(var e,i=[],r=0,o=0,a="";null!=(e=l.exec(t));){var s=e[0],c=e[1],u=e.index;if(a+=t.slice(o,u),o=u+s.length,c)a+=c[1];else{a&&(i.push(a),a="");var f=e[2],h=e[3],p=e[4],d=e[5],v=e[6],m=e[7],g="+"===v||"*"===v,w="?"===v||"*"===v,y=f||"/",b=p||d||(m?".*":"[^"+y+"]+?");i.push({name:h||r++,prefix:f||"",delimiter:y,optional:w,repeat:g,pattern:n(b)})}}return o<t.length&&(a+=t.substr(o)),a&&i.push(a),i}function e(t){return t.replace(/([.+*?=^!:${}()[\]|\/])/g,"\\$1")}function n(t){return t.replace(/([=!:$\/()])/g,"\\$1")}function i(t,e){return t.keys=e,t}function r(t){return t.sensitive?"":"i"}function o(t,e){var n=t.source.match(/\((?!\?)/g);if(n)for(var r=0;r<n.length;r++)e.push({name:r,prefix:null,delimiter:null,optional:!1,repeat:!1,pattern:null});return i(t,e)}function a(t,e,n){for(var o=[],a=0;a<t.length;a++)o.push(u(t[a],e,n).source);var s=new RegExp("(?:"+o.join("|")+")",r(n));return i(s,e)}function s(e,n,r){for(var o=t(e),a=c(o,r),s=0;s<o.length;s++)"string"!=typeof o[s]&&n.push(o[s]);return i(a,n)}function c(t,n){n=n||{};for(var i=n.strict,o=n.end!==!1,a="",s=t[t.length-1],c="string"==typeof s&&/\/$/.test(s),u=0;u<t.length;u++){var l=t[u];if("string"==typeof l)a+=e(l);else{var f=e(l.prefix),h=l.pattern;l.repeat&&(h+="(?:"+f+h+")*"),h=l.optional?f?"(?:"+f+"("+h+"))?":"("+h+")?":f+"("+h+")",a+=h}}return i||(a=(c?a.slice(0,-2):a)+"(?:\\/(?=$))?"),a+=o?"$":i&&c?"":"(?=\\/|$)",new RegExp("^"+a,r(n))}function u(t,e,n){return e=e||[],isarray(e)?n||(n={}):(n=e,e=[]),t instanceof RegExp?o(t,e,n):isarray(t)?a(t,e,n):s(t,e,n)}window.pathToRegexp=u;var l=new RegExp(["(\\\\.)","([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^()])+)\\))?|\\(((?:\\\\.|[^()])+)\\))([+*?])?|(\\*))"].join("|"),"g")}();var Wires=Wires||{};!function(){var t=function(t,e){var n,i=this;n=t&&_.has(t,"constructor")?t.constructor:function(){return i.apply(this,arguments)},_.extend(n,i,e);var r=function(){this.constructor=n};return r.prototype=i.prototype,n.prototype=new r,t&&_.extend(n.prototype,t),n.__super__=i.prototype,n.prototype.__parent__=function(t,e){n.__super__[t].apply(n.prototype,e)},n},e=function(t,e){this.initialize&&this.initialize.apply(this,arguments)};e.extend=t,Wires.Class=e}(),function t(e,n,i){function r(a,s){if(!n[a]){if(!e[a]){var c="function"==typeof require&&require;if(!s&&c)return c(a,!0);if(o)return o(a,!0);var u=new Error("Cannot find module '"+a+"'");throw u.code="MODULE_NOT_FOUND",u}var l=n[a]={exports:{}};e[a][0].call(l.exports,function(t){var n=e[a][1][t];return r(n?n:t)},l,l.exports,t,e,n,i)}return n[a].exports}for(var o="function"==typeof require&&require,a=0;a<i.length;a++)r(i[a]);return r}({1:[function(t,e,n){function i(){}var r=e.exports={};r.nextTick=function(){var t="undefined"!=typeof window&&window.setImmediate,e="undefined"!=typeof window&&window.postMessage&&window.addEventListener;if(t)return function(t){return window.setImmediate(t)};if(e){var n=[];return window.addEventListener("message",function(t){var e=t.source;if((e===window||null===e)&&"process-tick"===t.data&&(t.stopPropagation(),n.length>0)){var i=n.shift();i()}},!0),function(t){n.push(t),window.postMessage("process-tick","*")}}return function(t){setTimeout(t,0)}}(),r.title="browser",r.browser=!0,r.env={},r.argv=[],r.on=i,r.addListener=i,r.once=i,r.off=i,r.removeListener=i,r.removeAllListeners=i,r.emit=i,r.binding=function(t){throw new Error("process.binding is not supported")},r.cwd=function(){return"/"},r.chdir=function(t){throw new Error("process.chdir is not supported")}},{}],2:[function(t,e,n){"use strict";function i(t){function e(t){return null===c?void l.push(t):void a(function(){var e=c?t.onFulfilled:t.onRejected;if(null===e)return void(c?t.resolve:t.reject)(u);var n;try{n=e(u)}catch(i){return void t.reject(i)}t.resolve(n)})}function n(t){try{if(t===f)throw new TypeError("A promise cannot be resolved with itself.");if(t&&("object"==typeof t||"function"==typeof t)){var e=t.then;if("function"==typeof e)return void o(e.bind(t),n,i)}c=!0,u=t,s()}catch(r){i(r)}}function i(t){c=!1,u=t,s()}function s(){for(var t=0,n=l.length;n>t;t++)e(l[t]);l=null}if("object"!=typeof this)throw new TypeError("Promises must be constructed via new");if("function"!=typeof t)throw new TypeError("not a function");var c=null,u=null,l=[],f=this;this.then=function(t,n){return new f.constructor(function(i,o){e(new r(t,n,i,o))})},o(t,n,i)}function r(t,e,n,i){this.onFulfilled="function"==typeof t?t:null,this.onRejected="function"==typeof e?e:null,this.resolve=n,this.reject=i}function o(t,e,n){var i=!1;try{t(function(t){i||(i=!0,e(t))},function(t){i||(i=!0,n(t))})}catch(r){if(i)return;i=!0,n(r)}}var a=t("asap");e.exports=i},{asap:4}],3:[function(t,e,n){"use strict";function i(t){this.then=function(e){return"function"!=typeof e?this:new r(function(n,i){o(function(){try{n(e(t))}catch(r){i(r)}})})}}var r=t("./core.js"),o=t("asap");e.exports=r,i.prototype=r.prototype;var a=new i(!0),s=new i(!1),c=new i(null),u=new i(void 0),l=new i(0),f=new i("");r.resolve=function(t){if(t instanceof r)return t;if(null===t)return c;if(void 0===t)return u;if(t===!0)return a;if(t===!1)return s;if(0===t)return l;if(""===t)return f;if("object"==typeof t||"function"==typeof t)try{var e=t.then;if("function"==typeof e)return new r(e.bind(t))}catch(n){return new r(function(t,e){e(n)})}return new i(t)},r.all=function(t){var e=Array.prototype.slice.call(t);return new r(function(t,n){function i(o,a){try{if(a&&("object"==typeof a||"function"==typeof a)){var s=a.then;if("function"==typeof s)return void s.call(a,function(t){i(o,t)},n)}e[o]=a,0===--r&&t(e)}catch(c){n(c)}}if(0===e.length)return t([]);for(var r=e.length,o=0;o<e.length;o++)i(o,e[o])})},r.reject=function(t){return new r(function(e,n){n(t)})},r.race=function(t){return new r(function(e,n){t.forEach(function(t){r.resolve(t).then(e,n)})})},r.prototype["catch"]=function(t){return this.then(null,t)}},{"./core.js":2,asap:4}],4:[function(t,e,n){(function(t){function n(){for(;r.next;){r=r.next;var t=r.task;r.task=void 0;var e=r.domain;e&&(r.domain=void 0,e.enter());try{t()}catch(i){if(c)throw e&&e.exit(),setTimeout(n,0),e&&e.enter(),i;setTimeout(function(){throw i},0)}e&&e.exit()}a=!1}function i(e){o=o.next={task:e,domain:c&&t.domain,next:null},a||(a=!0,s())}var r={task:void 0,next:null},o=r,a=!1,s=void 0,c=!1;if("undefined"!=typeof t&&t.nextTick)c=!0,s=function(){t.nextTick(n)};else if("function"==typeof setImmediate)s="undefined"!=typeof window?setImmediate.bind(window,n):function(){setImmediate(n)};else if("undefined"!=typeof MessageChannel){var u=new MessageChannel;u.port1.onmessage=n,s=function(){u.port2.postMessage(0)}}else s=function(){setTimeout(n,0)};e.exports=i}).call(this,t("_process"))},{_process:1}],5:[function(t,e,n){"function"!=typeof Promise.prototype.done&&(Promise.prototype.done=function(t,e){var n=arguments.length?this.then.apply(this,arguments):this;n.then(null,function(t){setTimeout(function(){throw t},0)})})},{}],6:[function(t,e,n){t("asap");"undefined"==typeof Promise&&(Promise=t("./lib/core.js"),t("./lib/es6-extensions.js")),t("./polyfill-done.js")},{"./lib/core.js":2,"./lib/es6-extensions.js":3,"./polyfill-done.js":5,asap:4}]},{},[6]),function(t){function e(t){var e=/((\/\/.*$)|(\/\*[\s\S]*?\*\/))/gm,n=/([^\s,]+)/g,i=t.toString().replace(e,""),r=i.slice(i.indexOf("(")+1,i.indexOf(")")).match(n);return null===r&&(r=[]),r}var n={};t.domain={constructModel:function(t,e,n){var i=new e;this.require({source:e.prototype.init,target:i.init,instance:i},t).then(function(t){n(null,i)})["catch"](function(t){n(t)})},getInputArguments:function(t){var e={};if(e.localServices={},t.length>0){if(e.source=t[0],e.target=t[0],_.isPlainObject(t[0])){var n=t[0];e.target=n.target,e.source=n.source,e.instance=n.instance}if(t.length>1){var i=_.isString(t[0])||_.isArray(t[0]);i?(e.source=_.isArray(t[0])?t[0]:_.isString(t[0])?[t[0]]:t[0],_.isFunction(t[1])&&(e.target=t[1]),_.isFunction(t[2])&&(e.target=t[2])):(_.isFunction(t[1])&&(e.callReady=t[1]),_.isPlainObject(t[1])&&(e.localServices=t[1]))}3===t.length&&(_.isPlainObject(t[1])&&(e.localServices=t[1]),_.isFunction(t[2])&&(e.callReady=t[2]))}return e.target=e.target||function(){},e.source=e.source?e.source:e.target,e.callReady=e.callReady||function(){},e},service:function(){this.register.apply(this,arguments)},register:function(t,e,i){var r=null,o=e;_.isArray(e)&&(r=e,o=i),n[t]={target:o,args:r}},requirePackage:function(t){var e={};return this.each(n,function(n,i){var r=i.split(".")[0];return r===t?domain.require([i],function(t){e[i]=t}):void 0}).then(function(){return e})},require:function(){var t=this.getInputArguments(arguments),i=this,r=t.localServices,o=_.isArray(t.source)?t.source:e(t.source),a=t.target,s=(t.callReady,t.instance),c=n,i=this,u=new Promise(function(e,n){var u=[],l=_.merge(r,c);for(var f in o){var h=(o[f],o[f]);if(!l[h])return console.error("Error while injecting variable '"+h+"' into function \n"+t.source.toString()),n({status:500,message:"Service with name '"+h+"' was not found "});u.push(l[h])}return i.each(u,function(t){var e=t.target,n=t.args;if(_.isFunction(e)){var o=[];return o=n?[n,r,e]:[e,r],i.require.apply(i,o)}return e}).then(function(t){return delete i,a.apply(s||t,t)}).then(e)["catch"](n)});return u},isServiceRegistered:function(t){return void 0!==n[t]},each:function(t,e){return new Promise(function(n,i){var r=[],o=_.isPlainObject(t),a=-1,s=function(){if(a++,!(a<_.size(t)))return n(r);var c,u;o?(c=_.keys(t)[a],u=t[c]):(c=a,u=t[a]);var l=e.call(e,u,c);l instanceof Promise?l.then(function(t){r.push(t),s()})["catch"](i):(r.push(l),s())};s()})}}}(window),function(){RegExp.prototype.execAll=function(t){for(var e=null,n=new Array;e=this.exec(t);){var r=[];for(i in e)parseInt(i)==i&&r.push(e[i]);n.push(r)}return n}}(),function(){window.isMobile=!1,(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4)))&&(window.isMobile=!0);var t=1;Object.defineProperty(Object.prototype,"__uniqueId",{writable:!0}),Object.defineProperty(Object.prototype,"uniqueId",{get:function(){return void 0==this.__uniqueId&&(this.__uniqueId=t++),this.__uniqueId}})}(),function(){Object.defineProperty(Object.prototype,"watch",{enumerable:!1,configurable:!0,writable:!1,value:function(t,e){var n=this[t],i=n,r=function(){return i},o=function(r){return n=i,i=e.call(this,t,n,r)};delete this[t]&&Object.defineProperty(this,t,{get:r,set:o,enumerable:!0,configurable:!0})}}),Object.defineProperty(Object.prototype,"unwatch",{enumerable:!1,configurable:!0,writable:!1,value:function(t){var e=this[t];delete this[t],this[t]=e}})}(),function(){domain.service("$evaluate",["$watch","$pathObject","$exec"],function(t,e,n){return function(i,r){var r=r||[],o=r.scope||{},a=r.target,s=r.changed,c=void 0!==r.watchVariables?r.watchVariables:!0,u=[],l=function(t,r){var c=i.tpl,l=[],f=[];_.each(i.vars,function(t,i){var r;t.p?(path=e(t.p,o),r=path.value,f.push({path:t.p,value:path})):t.e&&(r=n.expression(t.e,o,a),l.push({str:t.e,value:r})),r=void 0===r?"":r,c=c.split(i).join(r)});for(var h in i.funcs){var p=i.funcs[h],d=e(p.p,o).value;if(_.isFunction(d)){var v=n.func(p.f,o,a);c=c.split(h).join(void 0!==v?v:"")}else c=c.split(h).join("")}var m={str:c,expressions:l,locals:f,detach:function(){_.each(u,function(t){t.remove()})}};return _.isFunction(s)&&s(m),m};if(c){var f={},h=function(t){_.each(t,function(t){if(t.p){var e=t.p.join(".");f[e]||(f[e]=t)}t.e&&h(t.v)})};h(i.vars),_.each(f,function(e){var n=t(e.p,o,function(t,n){_.defer(function(){l(e.p.join("."),n)})});n&&u.push(n)})}var p=l();return p}})}(),function(){var _cache={},getFunctionFromString=function(stringFunction){var userFunc;return _cache[stringFunction]?userFunc=_cache[stringFunction]:(userFunc=eval("(function($, target){ return "+stringFunction+"})"),_cache[stringFunction]=userFunc),_cache[stringFunction]};domain.service("$exec",["$pathObject"],function(t){return{func:function(t,e,n){var i=getFunctionFromString(t),r=i.bind(e)(e,n);return r},expression:function(t,e,n){var i=getFunctionFromString(t),r=i.bind(e)(e,n);return r}}})}(),function(){domain.service("$loadView",function(){return function(t){return new Promise(function(e,n){return e(window.__wires_views__[t]?window.__wires_views__[t]:[])})}})}(),function(){domain.service("$pathObject",function(){return function(t,e){_.isArray(t)||(t=t.split("."));var n=e,i=null;return _.each(t,function(e,r){t.length-1===r?i=e:void 0!==n[e]?n=n[e]:(n[e]={},n=n[e])}),{update:function(t){return n[i]=t,t},value:n[i],property:i,instance:n}}})}(),function(){domain.service("$run",["TagNode","TextNode","Repeater"],function(t,e,n){var i=function(r){var r=r||{},o=r.structure||[],a=r.target||document.querySelector("section"),s=r.scope||{},c=function(r,o){_.each(r,function(r){var a;if(1===r.t&&(a=new e(r,s),a.create(o)),2===r.t){a=new t(r,s);{a.create(o)}r.c&&c(r.c,a)}if(3===r.t){new n({run:i,item:r,parent:o,scope:s})}})},u=(document.createElement("div"),r.parentNode||new t(a));u.element||(u.element=a),c(o,u)};return i})}(),function(){domain.service("$watch",["$pathObject","$array"],function(t,e){return function(n,i,r){var o=t(n,i),a=o.instance,s=o.property;return a.$watchers||(a.$watchers={}),_.isObject(a)||!_.isString(s)?(_.isArray(a)&&(a=e(a)),a.$watchers[s]||(a.$watchers[s]=[]),r&&a.$watchers[s].push(r),1===a.$watchers[s].length&&a.watch(s,function(t,e,n){return _.each(a.$watchers[s],function(t){t(e,n)}),n}),{remove:function(){var t=a.$watchers[s].indexOf(r);a.$watchers[s].splice(t,1),delete r},removeAll:function(){a.unwatch(s),delete a.$watchers}}):void 0}})}(),function(){var t;domain.service("$customAttributes",function(){return new Promise(function(e,n){return t?e(t):void domain.requirePackage("attrs").then(function(n){return t=n,e(t)})})})}(),function(){var t;domain.service("$history",function(){if(t)return t;var e=Wires.Class.extend({initialize:function(){var t=this;this.events={},window.onpopstate=function(){t.trigger("change")}},trigger:function(t){_.isArray(this.events[t])&&_.each(this.events[t],function(t){t()})},on:function(t,e){this.events[t]||(this.events[t]=[]),this.events[t].push(e)},go:function(t){var e={url:t};history.pushState(e,t,t),this.trigger("change")}});return t=new e})}(),function(){domain.register("$http",function(){return{_request:function(t,e,n,i,r){var o={url:e,contentType:"application/json; charset=UTF-8",method:t,data:JSON.stringify(n),dataType:"json"};"GET"===t&&(o.data=n);var a=$.ajax(o);a.always(function(t,e){return t.status?r({status:t.status,message:t.responseJSON||t.statusText}):i(t)})},"delete":function(t,e){var n=this;return new Promise(function(i,r){n._request("DELETE",t,e,function(t){i(t)},function(t){r(t)})})},getHTML:function(t){return new Promise(function(e,n){$.get(t,function(t){return t=t.replace(/(\r\n|\n|\r)/gm,""),e(t)})})},get:function(t,e){var n=this;return new Promise(function(i,r){n._request("GET",t,e,function(t){i(t)},function(t){r(t)})})},post:function(t,e){var n=this;return new Promise(function(i,r){n._request("POST",t,e,function(t){i(t)},function(t){r(t)})})},put:function(t,e){var n=this;return new Promise(function(i,r){n._request("PUT",t,e,function(t){i(t)},function(t){r(t)})})}}})}(),function(){var t=0;domain.service("$load",["$queryString","$loadView","$run"],function(e,n,i){return{component:function(t,e){},controller:function(r,o){var o=(window.location.url,o||{}),a=o.parent,s=e();o.params&&(s=_.merge(s,o.params));var c={$params:{target:s}};return o.injections&&_.each(o.injections,function(t,e){c[e]={target:t}}),domain.require([r],c,function(e){if(t++,_.isArray(e)&&!(e.length<2)){var r=e[0].match(/^([^\s]+)(\s*->\s*([^\s]+))?/i),o=e[1];if(r){var s=r[1],c=r[3]||"section",u=null;if(u=a&&a.element?$(a.element).find(c)[0]:document.querySelector(c),!u)throw{message:"Can't find a target "};for(var l=new o;u.firstChild;)u.removeChild(u.firstChild);return n(s).then(function(t){return i({structure:t,target:u,scope:l}),{scope:l,element:u}})}}})}}})}(),function(){domain.service("$queryString",function(){var t=function(){for(var t={},e=window.location.search.substring(1),n=e.split("&"),i=0;i<n.length;i++){var r=n[i].split("=");if("undefined"==typeof t[r[0]])t[r[0]]=decodeURIComponent(r[1]);else if("string"==typeof t[r[0]]){var o=[t[r[0]],decodeURIComponent(r[1])];t[r[0]]=o}else t[r[0]].push(decodeURIComponent(r[1]))}return t};return t})}(),function(){var t=Wires.Class.extend({initialize:function(){this.states=[],this.loaded=!1},set:function(t,e,n){this.route=t,this.controller=e,this.states=n},getControllerPath:function(){return"controllers."+this.controller},matches:function(){var t,e=window.location.pathname,n=[],i=pathToRegexp(this.route,n),r={};return(t=i.exec(e))?(_.each(n,function(e,n){r[e.name]=t[n+1]}),r):void 0}}),e=new t;domain.register("$router",["$load","$queryString","$loadView","$run","$history"],function(n,i,r,o,a){return{add:function(){var t=this.state.apply(this,arguments);e.states.push(t)},state:function(e,n,i){var r=new t;return r.set.apply(r,arguments),r},_start:function(t){var e=this;_.each(t.states,function(t){var n;return(n=t.matches())?(e.stack.push(t),t.states&&e._start(t),!1):void 0})},loadStates:function(t){var e,i=((new Date).getTime(),this);return i.historyStack=i.historyStack||[],domain.each(t,function(r,o){var a=i.historyStack[o],s=o+1===t.length;return a&&!s&&a.route===r.route?void(e=r.parent):n.controller(r.getControllerPath(),{parent:e}).then(function(t){r.loaded=!0,r.parent=t,e=t})}).then(function(t){i.historyStack=[],_.each(i.stack,function(t){i.historyStack.push(t)}),i.stack=[]})["catch"](function(t){console.error(t||t.stack)})},start:function(){var t=this;t.stack=[],t._start(e),t.loadStates(t.stack),a.on("change",function(n){t.stack=[],t._start(e),t.loadStates(t.stack)})}}})}(),domain.service("Repeater",["TagNode","$pathObject","$array"],function(t,e,n,i){return Wires.Class.extend({initialize:function(t){this.item=t.item,this.run=t.run,this.parent=t.parent,this.scope=t.scope;var i=this.item.v;if(!i.vars)throw{error:"Repeater expects variables! e.g $item in items"};if(2!==_.keys(i.vars).length)throw{error:"Repeater expects 2 variables. Scope key and Target Array (e.g $item in items)"};this.scopeKey=i.vars.$_v0.p.join("");var r=e(i.vars.$_v1.p,this.scope),o=r.value?r.value:r.update([]);this.array=n(o),this.element=document.createComment("repeat "+this.scopeKey),this.parent.addChild(this),this.watchers=this.array.$watch(this.onEvent.bind(this)),this._arrayElements=[],this.createInitialElements()},createInitialElements:function(){var t=this;_.each(this.array,function(e){t.addItem(e)})},addItem:function(e){var n=this.item.i[0],i={parent:this.scope,index:this._arrayElements.length};i[this.scopeKey]=e;var r=new t(n,i);r.create();var o=this.element,a=this._arrayElements.length;a>0&&(o=this._arrayElements[a-1]);var s=o.node?o.node.element:o;s.parentNode.insertBefore(r.element,s.nextSibling),this._arrayElements.push({node:r,localScope:i}),this.run({structure:n.c||[],parentNode:r,scope:i})},removeItem:function(t,e){for(var n=t;t+e>n;n++)if(this._arrayElements[n]){var i=this._arrayElements[n].node.element;$(i).remove()}this._arrayElements.splice(t,e),_.each(this._arrayElements,function(t,e){t.localScope.index=e})},onEvent:function(t,e,n){"push"===t&&this.addItem(e),"splice"===t&&this.removeItem(e,n)}})}),domain.service("TagAttribute",["$evaluate"],function(t){var e=Wires.Class.extend({initialize:function(t){this.attr=t.attr,this.name=t.name,this.scope=t.scope,this.element=t.element},create:function(){this.attribute=document.createAttribute(this.name),this.element.setAttributeNode(this.attribute),this.watcher=this.startWatching()},onValue:function(t){this.attribute.value=t.str},startWatching:function(){var e=this;return t(this.attr,{scope:this.scope,changed:function(t){e.onExpression?t.expressions&&t.expressions.length>0?e.onExpression(t.expressions[0]):e.onExpression():e.onValue&&e.onValue(t)}})}});return e}),domain.service("$tagAttrs",["TagAttribute","$evaluate","$customAttributes"],function(t,e,n){return{create:function(e,i,r){var o=[];return _.each(e.a,function(e,a){var s,c="attrs."+a,u={scope:i,attr:e,name:a,element:r};s=n[c]?new n[c](u):new t(u),s?(s.create(),o.push(s)):console.log("no attr",c)}),o}}}),domain.service("TagNode",["$tagAttrs"],function(t){return Wires.Class.extend({initialize:function(t,e){this.item=t,this.scope=e,this.children=[]},create:function(t,e){return this.element=document.createElement(this.item.n),this.element.$scope=this.scope,this.element.$tag=this,t&&t.addChild(this),this.startWatching(),this.element},addChild:function(t){$(this.element).append(t.element),this.children.push(t)},startWatching:function(){var e=this;this.attributes=t.create(this.item,this.scope,this.element),e.element.addEventListener("DOMNodeRemovedFromDocument",function(){_.each(e.attributes,function(t){t.watcher&&t.watcher.detach()}),_.each(e.children,function(t){t.watchers&&(t.watchers.detach(),delete t),t.onRemove&&t.onRemove(),delete t}),delete e.attributes,delete e.children,delete e.element.$scope,delete e.element.$tag,delete e.element})}})}),function(){var t=1;domain.service("TextNode",["$evaluate"],function(e){return Wires.Class.extend({initialize:function(t,e){this.item=t,this.scope=e},onDetach:function(){},create:function(n){var i=this;this.firstLoad=!0;var r=watcher=e(this.item.d,{scope:this.scope,changed:function(e){t++,i.firstLoad===!1&&(i.element.nodeValue=e.str),i.firstLoad=!1}});return this.watchers=r,this.element=document.createTextNode(r.str),n&&n.addChild(this),this.element}})})}(),domain.service("$array",function(){return function(t,e){var n,i;if(_.isArray(t)?(i=t,n=e||{}):(i=[],n=_.isPlainObject(e)?e:{}),i.$watch)return i;i.$arrayWatchers=[],i.$watch=function(t){return i.$arrayWatchers.push(t),{detach:function(){var e=i.$arrayWatchers.indexOf(t);i.$arrayWatchers.splice(e,1),delete t}}};var r=function(){var t=arguments;_.each(i.$arrayWatchers,function(e){e&&e.apply(null,t)})};return i.size=i.length,i.push=function(t){var e=Array.prototype.push.apply(this,arguments);return r("push",t),i.size=i.length,e},i.splice=function(t,e){r("splice",t,e);var n=Array.prototype.splice.apply(this,arguments);return i.size=i.length,n},i.$remove=function(t){return this.splice(t,1)},i.$add=function(t){return this.push(t)},i}}),domain.service("attrs.ws-click",["TagAttribute","$evaluate"],function(t,e){var n=t.extend({create:function(){var t=this,n=function(i){{var r=i.originalEvent?i.originalEvent.target:i.target;e(t.attr,{scope:t.scope,element:r,target:r.$scope,watchVariables:!1})}delete n,i.preventDefault()},i=window.isMobile?"touchend":"click";$(this.element).bind(i,n)}});return n}),domain.service("attrs.ws-drag",["TagAttribute","$evaluate"],function(t,e){var n=t.extend({create:function(){var t=this,n=function(n){var i=n.e.originalEvent?n.e.originalEvent.target:n.e.target;n.target=i.$scope,n.element=i;e(t.attr,{scope:t.scope,target:n,watchVariables:!1});event.preventDefault()},i=window.isMobile;$(this.element).bind(i?"touchstart":"mousedown",function(t){var e={x:t.clientX,y:t.clientY};n({e:t,coords:e,type:"start"}),$(this).bind(i?"touchmove":"mousemove",function(t){var i=e.x-t.clientX,r=e.y-t.clientY,o={x:i,y:r,dy:0>r?"down":"up",dx:0>i?"right":"left"};n({e:t,coords:o,type:"move"})}),$(this).bind(i?"touchend touchleave touchcancel":"mouseup",function(t){n({e:t,type:"stop"}),$(this).unbind("mouseup mousemove")})})}});return n}),domain.service("attrs.ws-href",["TagAttribute","$history"],function(t,e){var n=t.extend({create:function(){this.watcher=this.startWatching()},onValue:function(t){if(t&&t.str){var n=t.str;"A"===this.element.nodeName&&$(this.element).attr("href",n),$(this.element).click(function(t){t.preventDefault(),e.go(n)})}}});return n}),domain.service("attrs.ws-value",["TagAttribute","$evaluate"],function(t,e){var n=t.extend({create:function(){this.watcher=this.startWatching()},startWatching:function(){var t,n=e(this.attr,{scope:this.scope,changed:function(t){}});return n.locals&&1===n.locals.length&&(t=n.locals[0]),this.bindActions(function(e){t&&t.value.update(e)}),n},bindActions:function(t){var e=this,n=this.element.nodeName.toLowerCase(),i=$(this.element).attr("type");switch("textarea"===n&&(i=n),"select"===n&&(i=n),"input"!==n||i||(i="text"),i){case"text":case"email":case"password":case"textarea":this.element.addEventListener("keydown",function(n){var i=this;clearInterval(e.interval),e.interval=setTimeout(function(){t($(i).val())},50)},!1);break;case"checkbox":this.element.addEventListener("click",function(e){t(this.checked)});break;case"select":$(this.element).bind("change",function(){var t=($(this).val(),$(this).find("option:selected"));t.length})}}});return n}),domain.service("attrs.ws-visible",["TagAttribute"],function(t){var e=t.extend({create:function(){this.watcher=this.startWatching()},onExpression:function(t){t&&(t.value?$(this.element).show(0):$(this.element).hide(0))}});return e});