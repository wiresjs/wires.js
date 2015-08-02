var _ = require('lodash');
var Model = require("wires-mongo");
var domain = require('wires-domain');
var Promise = require('promise')


domain.service("User", function() {

   var User = Model.extend({
      collection: "user",
      schema: {
         _id: {},
         name: {
            required: true
         }
      }
   })
   return User;
})
