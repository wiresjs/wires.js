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
   var increment = function() {
      if ($scope.width > 500) {
         $scope.width = 20;
         $scope.height = 20;
      }
      $scope.width++;
      $scope.height++;
      $scope.$apply();

   }
   var c = function() {
      requestAnimationFrame(function() {
         increment();
         c();
      });
   }
   c();

});
