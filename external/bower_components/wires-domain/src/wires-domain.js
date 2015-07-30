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
         var self = this;
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

            return self.each(args, function(item){
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
                  return self.require.apply(self, currentArgs)
               } else {
                  return argService;
               }
            }).then(function(results){
               delete self;
               return target.apply(instance || results, results);
            }).then(resolve).catch(reject);
         })
         return resultPromise;
      },
      isServiceRegistered: function(name) {
         return services[name] !== undefined;
      },
      each: function(args, cb) {
         return new Promise(function(resolve, reject){
            var callbacks = [];
            var results = [];
            var isObject = _.isPlainObject(args);
            var index = -1;
            var iterate = function(){
               index++;
               if ( index < _.size(args) ){
                  var key;
                  var value;
                  if (isObject){
                     key = _.keys(args)[index];
                     value = args[key];
                  } else {
                     key = index;
                     value = args[index];
                  }
                  var res = cb.call(cb, value, key);
                  if ( res instanceof Promise ){
                     res.then(function(a){
                        results.push(a)
                        iterate();
                     }).catch(reject)
                  } else {
                     results.push(res)
                     iterate();
                  }
               } else {
                  return resolve(results)
               }
            }
            iterate();
         })
      }
   }
})(window)
