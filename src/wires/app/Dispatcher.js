"use realm";

import Schema from wires.core;
import Schema as runtimeSchemas from wires.runtime;
import lodash as _ from utils;
import PushState from wires.app;

var $rootRoute;

var url2Method = function(url) {
   return "on" + url[0].toUpperCase() + url.slice(1, url.length);
}

class Dispatcher {

   /**
    * constructor -
    * Subscribes to changes (Should be initialated only once)
    *
    * @return {type}  description
    */
   constructor() {
      var self = this;
      this.states = {};
      this.urls = [];

      PushState.subscribe(function() {
         self.changed();
      });
   }

   /**
    * storeEssentials - stores information into the "route" object
    * Creats a hidden proprety
    * @param  {type} obj  description
    * @param  {type} data description
    * @return {type}      description
    */
   storeEssentials(obj, data) {
      if (!obj.$$router) {
         Object.defineProperty(obj, "$$router", {
            enumerable: false,
            value: data
         });
         return obj.$$router;
      } else {

         _.each(data, function(v, k) {

            obj.$$router[k] = v;
         });
      }
      return obj.$$router;
   }

   assign(route) {
      if (!$rootRoute) {
         $rootRoute = route;
      }
      this.changed();
   }

   /**
    * getEssentials - gets information from an object
    *
    * @param  {type} obj description
    * @return {type}     description
    */
   getEssentials(obj) {
      return obj.$$router || {};
   }

   /**
    * getPaths - Retrevies paths
    *
    * @return {type}  description
    */
   getPaths() {
      var path = window.location.pathname;
      return path.split("/")
   }

   getFullURL() {
      return window.location.href;
   }

   /**
    * register - description
    *
    * @param  {type} element description
    * @param  {type} route   description
    * @return {type}         description
    */
   register(element, route) {
      var self = this;

      var essentials = self.storeEssentials(route, {
         element: element
      });
      var nextIndex = essentials.index + 1;
      var path = this.paths[essentials.index + 1];
      element.removeChildren(); // Clean up
      if (!path) {
         return;
      }
      var method = route[url2Method(path)];
      if (_.isFunction(method)) {
         var data = this.evaluate(route, method);
         if (data.schema) {
            return element.inflate(data.schema);
         }
         if (data.instance) {
            var result = self.initializeRoute(data.instance, nextIndex)
            return element.inflate(result.schema, data.instance);
         }
      }

   }

   /**
    * changed - description
    *
    * @return {type}  description
    */
   changed() {
      var self = this;
      this.paths = this.getPaths();

      if (!this.root) { // initial run
         self.urls = this.paths;
         return this.createRoot();
      }
      // on navigation
      var changedRoute;
      _.each(this.paths, function(path, index) {
         if (self.urls[index] !== path && changedRoute === undefined) {
            changedRoute = index;
         }
      });
      //console.log(self.fullURL !== self.getFullURL())
      if (changedRoute === undefined && self.paths.length !== self.urls.length) {
         changedRoute = _.findLastIndex(this.paths);
      }

      if (changedRoute > -1) {
         var route = self.states[changedRoute - 1];
         if (route !== undefined) {
            if (route.$$router) {
               self.register(route.$$router.element, route);
            }
         }
      }
      self.fullURL = self.getFullURL();
      self.urls = this.paths;
   }

   /**
    * initializeRoute - description
    *
    * @param  {type} route     description
    * @param  {type} nextIndex description
    * @return {type}           description
    */
   initializeRoute(route, nextIndex) {
      var self = this;
      self.storeEssentials(route, {
         index: nextIndex,
         dispatcher: self
      });
      self.states[nextIndex] = route;
      return this.evaluate(route, route.initialize);
   }

   /**
    * createRoot - description
    *
    * @return {type}  description
    */
   createRoot() {
      var self = this;
      this.root = new $rootRoute();
      self.storeEssentials(this.root, {
         index: 0,
         dispatcher: self
      });
      self.states[0] = this.root;
      var data = this.evaluate(this.root, this.root.initialize);
      if (data.schema) {
         Schema.inflate({
            schema: data.schema,
            target: document.querySelector('body'),
            scope: self.root
         })
      }
   }

   /**
    * evaluate - checks the response
    *
    * @param  {type} result description
    * @return {type}        description
    */
   evaluate(route, method) {
      var index = route.$$router.index;
      var result = method.apply(route)
      console.log(result)
      var view;
      if (_.isString(result)) {
         if (!runtimeSchemas[result]) {
            throw {
               message: result + " is not found in schemas!"
            }
         }
         return {
            type: "schema",
            schema: runtimeSchemas[result]
         }
      } else {
         return {
            type: "route",
            instance: result
         }
      }
      return {};
   }
}

let dispatcher = new Dispatcher();
export dispatcher;
