"use realm";
import lodash as _ from utils;

class Router {
   constructor(config) {
      this.package = config.package || '';

   }

   setupUserURL(url) {
      this.userURL = url;
   }

   /**
    * getURLSnippets - description
    *
    * @return {type}  description
    */
   getURLSnippets() {
      var data = (this.userURL || window.location.pathname).split("/");
      data = data.splice(1, data.length);
      if (data.length === 1) {
         return [];
      }
      return data;
   }

   /**
    * root - description
    *
    * @param  {type} data   description
    * @param  {type} states description
    * @return {type}        description
    */
   root(data, states) {
      this.root = this.state("/", data, states);
      return this;
   }

   /**
    * state - description
    *
    * @param  {type} path   description
    * @param  {type} data   description
    * @param  {type} states description
    * @return {type}        description
    */
   state(path, data, states) {
      let arr = data.split(/\s+->\s+/);
      let ctrl = arr[0];

      ctrl = (this.package ? this.package + "." : '') + ctrl;

      let view = arr[1];
      return {
         ctrl: ctrl,
         view: view,
         path: path,
         states: states
      }
   }

   start() {
      var url = this.getURLSnippets();
      console.log(url)
      console.log(this.root);
   }
}

export Router;
