var logger = require("log4js").getLogger("domain");
var _ = require("lodash");
var Promise = require('promise');
var Class = require('wires-class');
var async = require('async');
var Promise = require("promise");


//Extract parameter names from a function
var getParamNames = function(func) {
   var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
   var ARGUMENT_NAMES = /([^\s,]+)/g;
   var fnStr = func.toString().replace(STRIP_COMMENTS, '');
   var result = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
   if (result === null)
      result = [];
   return result;
}

// Extracts arguments and defined target for the require function
var getInputArguments = function(args) {
   var out = {};
   out.localServices = {};
   if (args.length > 0) {
      out.source = args[0];
      out.target = args[0];
      if (_.isPlainObject(args[0])) {
         var opts = args[0];
         out.target = opts.target
         out.source = opts.source
         out.instance = opts.instance
      }
      // call(func, callback)
      if (args.length > 1) {
         var argsDefined = _.isString(args[0]) || _.isArray(args[0])
         if (argsDefined && _.isFunction(args[1])) {
            out.source = _.isString(args[0]) ? [args[0]] : args[0]
            out.target = args[1]
         } else {
            if (_.isFunction(args[1])) {
               out.callReady = args[1];
            }
            if (_.isPlainObject(args[1])) {
               out.localServices = args[1];
            }
         }
      }
      // call(func, {locals}, calback)
      if (args.length === 3) {
         if (_.isPlainObject(args[1])) {
            out.localServices = args[1];
         }
         if (_.isFunction(args[2])) {
            out.callReady = args[2]
         }
      }
   }
   out.target = out.target || function() {}
   out.source = out.source ? out.source : out.target;
   out.callReady = out.callReady || function() {};
   return out;
}

// Register local services
// Will be available only on rest service construct


var Require = {
   // Factory constructor
   // Class is used for creating an instance with following resolution
   Factory: Class.extend({
      init: function() {},
   }, {
      __domain_factory__: true
   }),
   // register new service
   service: function(name, handler) {
      global.__wires_services__ = global.__wires_services__ || {};
      global.__wires_services__[name] = handler;
   },
   // Depricated method
   register: function() {
      this.service.apply(this, arguments)
   },
   isServiceRegistered: function(name) {
      return global.__wires_services__ && global.__wires_services__[name] !== undefined;
   },
   construct: function(avialableServices, fr, done) {

      var domainModelInstance = new fr();

      this.require({
         source: fr.prototype.init,
         target: domainModelInstance["init"],
         instance: domainModelInstance
      }, avialableServices).then(function(result) {
         done(null, domainModelInstance)
      }).catch(function(e) {
         done(e);
      });
   },
   promise: function(cb) {
      return new Promise(cb);
   },
   // domain require
   require: function() {
      var data = getInputArguments(arguments);
      var localServices = data.localServices;

      var variables = _.isArray(data.source) ? data.source : getParamNames(data.source);
      var target = data.target;
      var callReady = data.callReady;
      var instance = data.instance;
      var globalServices = global.__wires_services__;
      var self = this;

      return new Promise(function(resolve, reject) {
         var args = [];
         var avialableServices = _.merge(localServices, globalServices);
         for (var i in variables) {
            var variableName = variables[i];
            if (!avialableServices[variableName]) {
               logger.fatal("Error while injecting variable '" + variableName + "' into function \n" + data
                  .source.toString());
               return reject({
                  status: 500,
                  message: "Service with name '" + variableName + "'' was not found "
               });
            }
            args.push(avialableServices[variableName]);
         }
         var results = [];
         async.eachSeries(args, function(argService, next) {
            if (_.isFunction(argService)) {
               self.require(argService, localServices).then(function(r) {
                  results.push(r)
                  next(null);
               }).catch(function(e) {
                  next(e);
               });
            } else {
               results.push(argService);
               next();
            }
         }, function(err) {
            if (err) {
               // Globally if error happenes, stop it here, before calling function
               return reject(err);
            }
            // Resolving promises if defined
            var fr;
            try {
               fr = target.apply(instance || results, results);
            } catch (e) {
               logger.info(e);
               return reject(e)
            }
            if (_.isObject(fr)) {
               // Check special property of a function to destinuish if it's out guy
               var isDomainModel = fr.__domain_factory__;
               if (isDomainModel) {

                  // Construct model and init it
                  self.construct(avialableServices, fr, function(err, newinstance) {
                     if (err) {
                        return reject(err);
                     } else {

                        return resolve(newinstance);
                     }
                  });
               } else {
                  var isPromise = _.isFunction(fr["then"]) && _.isFunction(fr["catch"]);

                  if (isPromise) {
                     fr.then(function(res) {
                        return resolve(res);
                     });
                     fr.catch(function(e) {
                        logger.info(e);
                        return reject(e);
                     })
                  } else {
                     return resolve(fr);
                  }
               }
            } else {
               return resolve(fr);
            };
         });
      });
   }
}


module.exports = Require;
