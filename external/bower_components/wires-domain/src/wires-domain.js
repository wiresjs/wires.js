(function(w) {

   function getParamNames(func) {
      var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
      var ARGUMENT_NAMES = /([^\s,]+)/g;
      var fnStr = func.toString().replace(STRIP_COMMENTS, '');
      var result = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
      if (result === null)
         result = [];
      return result;
   }
   var services = {};
   w.domain = {
      constructModel: function(avialableServices, functionResult, done) {
         var domainModelInstance = new functionResult();
         this.require({
            source: functionResult.prototype.init,
            target: domainModelInstance["init"],
            instance: domainModelInstance
         }, avialableServices).then(function(result) {
            done(null, domainModelInstance)
         }).catch(function(e) {
            done(e);
         })
      },
      getInputArguments: function(args) {
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
               if (argsDefined) {
                  if (_.isArray(args[0])) {
                     out.source = args[0];
                  } else {
                     out.source = _.isString(args[0]) ? [args[0]] : args[0]
                  }
                  if ( _.isFunction(args[1]) ){
                     out.target = args[1]
                  }
                  if ( _.isFunction(args[2]) ){
                     out.target = args[2]
                  }
               } else {

                  if (_.isFunction(args[1])) {
                     out.callReady = args[1];
                  }
                  if (_.isPlainObject(args[1])) {
                     out.localServices = args[1];
                  }
               }
            }
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

      },
      service : function(){
         this.register.apply(this, arguments);
      },
      register: function(name, arg1, arg2) {
         var localArgs = null;
         var target = arg1;
         if (_.isArray(arg1)) {
            localArgs = arg1;
            target = arg2;
         }
         services[name] = {
            target: target,
            args: localArgs
         }
      },
      requirePackage : function(name){
         var _packageServices = {}
         return this.each(services, function(service, serviceName){
            var _package = serviceName.split(".")[0]
            if ( _package === name){
               return domain.require([serviceName], function(serviceInstance){
                  _packageServices[serviceName] = serviceInstance
               })
            }
         }).then(function(){
            return _packageServices;
         })
      },
      require: function() {
         var data = this.getInputArguments(arguments);

         var localServices = data.localServices;
         var variables = _.isArray(data.source) ? data.source : getParamNames(data.source);
         var target = data.target;
         var callReady = data.callReady;
         var instance = data.instance;
         var globalServices = services;
         var self = this;
         var resultPromise = new Promise(function(resolve, reject) {
            var args = [];

            var avialableServices = _.merge(localServices, globalServices);
            for (var i in variables) {
               var v = variables[i];

               var variableName = variables[i];


               if (!avialableServices[variableName]) {
                  console.error("Error while injecting variable '" + variableName + "' into function \n" +
                     data.source.toString());
                  return reject({
                     status: 500,
                     message: "Service with name '" + variableName + "' was not found "
                  });
               }

               args.push(avialableServices[variableName]);

            }
            var results = [];
            async.eachSeries(args, function(item, next) {

               var argService = item.target;
               var requiredArgs = item.args;
               if (_.isFunction(argService)) {
                  var promised;
                  var currentArgs = [];
                  if (requiredArgs) {
                     currentArgs = [requiredArgs, localServices, argService ]
                  } else {
                     currentArgs = [argService, localServices]
                  }
                  self.require.apply(self, currentArgs).then(function(r) {
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
               var functionResult;
               try {
                  functionResult = target.apply(instance || results, results);
               } catch (e) {
                  console.error(e.stack || e);
                  return reject(e)
               }

               if (_.isObject(functionResult)) {
                  // Check special property of a function to destinuish if it's out guy
                  var isDomainModel = functionResult.__domain_factory__;

                  if (isDomainModel) {

                     // Construct model and init it
                     self.constructModel(avialableServices, functionResult, function(err,
                        newinstance) {
                        if (err) {
                           return reject(err);
                        } else {
                           return resolve(newinstance);
                        }
                     });
                  } else {
                     var isPromise = _.isFunction(functionResult["then"]) && _.isFunction(
                        functionResult["catch"]);
                     if (isPromise) {
                        functionResult.then(function(res) {
                           return resolve(res);
                        }).catch(function(e) {
                           console.info(e);
                           return reject(e);
                        })
                     } else {
                        return resolve(functionResult);
                     }
                  }
               } else {
                  return resolve(functionResult);
               };
            });
         })
         return resultPromise;
      },
      isServiceRegistered: function(name) {
         return services[name] !== undefined;
      },
      each: function(arr, cb) {
         return new Promise(function(resolve, reject) {
            var promises = [];
            _.each(arr, function(v, k) {
               promises.push(function(callback) {
                  var cbRes;
                  try {
                     cbRes = cb(v, k);
                  } catch (e) {
                     return callback(e, null)
                  }
                  if (cbRes instanceof Promise) {
                     cbRes.then(function(r) {
                        callback(null, r);
                     }).catch(function(e) {
                        callback(e);
                     })
                  } else {
                     callback(null, cbRes);
                  }
               });
            });
            async.series(promises, function(err, results) {
               if (err) {
                  return reject(err);
               } else {
                  return resolve(results);
               }
            })
         });
      }
   }
})(window)
