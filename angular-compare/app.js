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
   $scope.showMe = function() {
      this.show_me = true;
   }
   $scope.hideMe = function() {
      this.show_me = false;
   }

   this.user = {
      name: "Pekka",
      age: 20
   }
   $scope.doSomething = function() {
      alert(1);
   }

   var b = function() {
         window.requestAnimationFrame(function() {
            $scope.index++;

            $scope.$apply();

            b()

         })
      }
      //b();

});
