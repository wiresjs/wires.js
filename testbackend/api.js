var _ = require('lodash');
var domain = require('wires-domain');
var Promise = require('promise')

domain.path("/api/user/:id?",{
   get : function(User, $params){
      if ($params.id){
         return User.find($params.id).required().first();
      }
      return User.find().all();
   },
   post : function($body, User){
      console.log($body)
      return new User($body).save();
   },
   put : function($body,$params, User){
      return User.find($params.id).required().first().then(function(record){
         return record.set($body).save();
      })
   },
   delete : function($body,$params, User){
      return User.find($params.id).required().first().then(function(record){
         return record.remove();
      })
   }
})
