'use strict';

/* Controllers */

var phonecatApp = angular.module('phonecatApp', []);

phonecatApp.controller('PhoneListCtrl', function($scope, $interval) {

   $scope.index = 2;
   $scope.user = {
      name: "Pekka",
      age: 20
   }
   $scope.width = 20;
   $scope.height = 20;
   setInterval(function() {
      $scope.index++;
      $scope.$apply();
   }, 500)

});
