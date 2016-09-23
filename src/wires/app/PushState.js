"use realm";

import Query from wires.app;
import lodash as _ from utils;

var subscriptions = [];

class PushState {

   static _createQueryString(data) {
      var stringData = [];
      _.each(data, function(value, k) {
         stringData.push(k + "=" + encodeURI(value))
      });
      var str = stringData.join("&");
      if (stringData.length > 0) {
         str = "?" + str;
      }
      return str;
   }
   static subscribe(cb) {
      subscriptions.push(cb);

   }
   static changed() {
      _.each(subscriptions, function(cb) {
         cb();
      });
   }

   static redirect(url) {
      History.set(url);
   }

   static get(item) {
      var q = Query.get();
      if (item) {
         return q[item];
      }
      return q;
   }

   static _changeState(a) {
      var stateObj = {
         url: a
      };
      history.pushState(stateObj, a, a);
      PushState.changed();
   }

   static force(data, userUrl) {
      this._changeState((userUrl || window.location.pathname) + this._createQueryString(data));
   }

   static merge(data, userUrl) {
      if (_.isPlainObject(data)) {
         var current = Query.get();
         var params = _.merge(current, data);
         var url = (userUrl || window.location.pathname) + this._createQueryString(params);
         this._changeState(url);
      }
   }
}
const $window = $isBackend ? {} : window;

$window.onpopstate = function(state) {
   PushState.changed();
}

export PushState;
