var pathToRegexp = require('path-to-regexp');
var _ = require('lodash');
var Require = require('./_require');
var Promise = require("promise");
var logger = require("log4js").getLogger("domain");
var Promise = require("promise");

var RestFul = [];

var getResourceCandidate = function(resources, startIndex, url) {
   for (var i = startIndex; i < resources.length; i++) {
      var item = resources[i];
      var keys = [];
      var re = pathToRegexp(item.path, keys);
      params = re.exec(url);
      if (params) {
         return {
            params: params,
            keys: keys,
            handler: item.handler,
            nextIndex: i + 1
         }
      }
   }
}

// Register local services
// Will be available only on rest service construct
var restLocalServices = function(info, params, req, res) {
   var services = {
         $req: req,
         $res: res,
         $params: params,
         // Next function tries to get next
         $next: function() {
            return function() {
               var resources = RestFul;
               var data = getResourceCandidate(resources, info.nextIndex, req.path);
               if (data) {
                  return callCurrentResource(data, req, res)
               }
            }
         }
      }
      // Helper to validate required arguments
   var required = function() {
         var err;
         _.each(arguments, function(item) {
            if (_.isString(item)) {
               if (!this[item]) {
                  return err = {
                     status: 400,
                     message: item + " is required"
                  }
               }
            }
            // If it's a dictionary with options
            if (_.isPlainObject(item)) {
               _.each(item, function(funcValidate, k) {
                  // Assume k - is query's argument
                  // v should be a function
                  if (_.isFunction(funcValidate) && _.isString(k)) {
                     this[k] = funcValidate(this[k])
                  }
               }, this);
            }
         }, this);

         if (err) {
            throw err;
         }
      }
      // Body
   services.$body = {
         require: required.bind(req.body),
         attrs: req.body,
         getAttributes: function() {
            return req.body;
         }
      }
      // Query
   services.$query = {
         require: required.bind(req.query),
         attrs: req.query,
         getAttributes: function() {
            return req.query;
         }
      }
      // Assertion codes
   services.$assert = {
      bad_request: function(message) {
         throw {
            status: 400,
            message: message || "Bad request"
         }
      },
      unauthorized: function(message) {
         throw {
            status: 401,
            message: message || "Unauthorized"
         }
      },
      not_found: function(message) {
         throw {
            status: 404,
            message: message || "Not Found"
         }
      }
   }
   return services;
}

var callCurrentResource = function(info, req, res) {
   // Extract params
   var mergedParams = {};
   var params = info.params;
   var handler = info.handler;

   _.each(info.keys, function(data, index) {
      var i = index + 1;
      if (params[i] !== null && params[i] !== undefined) {
         var parameterValue = params[i];
         if (parameterValue.match(/^\d{1,4}$/)) {
            parameterValue = parseInt(parameterValue);
         }
         mergedParams[data.name] = parameterValue;
      }
   });


   // Define method name
   var method = req.method.toLowerCase();

   // Allow to define free style method for access
   if (mergedParams.action) {
      method = mergedParams.action;
   }


   // Define parse options
   var parseOptions;

   if (_.isPlainObject(handler)) {
      if (handler[method]) {
         parseOptions = {
            source: handler[method],
            target: handler[method],
            instance: handler
         }
      }
   }

   if (_.isFunction(handler)) {
      parseOptions = handler;
   }

   // If there is nothing to execute
   if (!parseOptions) {
      return res.status(501).send({
         error: 501,
         message: "Not implemented"
      })
   }

   Require.require(parseOptions, restLocalServices(info, mergedParams, req, res)).then(function(result) {
      if (result !== undefined) {
         res.send(result);
      }
   }).catch(function(e) {
      var err = {
         status: 500,
         message: "Error"
      };
      if (_.isObject(e)) {
         err.status = e.status || 500;
         err.message = e.message || "Error";
         if (e.details) {
            err.details = e.details;
         }
      }
      res.status(err.status).send(err);
      logger.fatal(e.stack || e)
   });
}
var express = function(req, res, next) {
   var resources = RestFul;
   var data = getResourceCandidate(resources, 0, req.path);
   if (!data) {
      return next();
   }
   return callCurrentResource(data, req, res)
}

var Path = function() {
   var handlers = [];
   var path;
   _.each(arguments, function(item) {
      if (!path) {
         path = item
      } else {
         handlers.push(item);
      }
   });
   _.each(handlers, function(handler) {
      RestFul.push({
         path: path,
         handler: handler
      });
   });
}

module.exports = {
   express: function() {
      return express;
   },
   path: Path
}
