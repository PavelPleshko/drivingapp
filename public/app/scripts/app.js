'use strict';


var drivingApp = angular
  .module('drivingApp', [
    'ngRoute','templates'
  ])
  .config(function ($routeProvider,$locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
        .when('/new/map', {
        templateUrl: 'views/map.html',
        controller: 'MapCtrl',
        controllerAs: 'map',
        resolve:{
           selectedRoute:[function(googleService,localStorageService){

            return null;
          }
          ]
        }
      })
       .when('/map/:id', {
        templateUrl: 'views/map.html',
        controller: 'MapCtrl',
        controllerAs: 'map',
        resolve:{
          selectedRoute:[
          'LocalStorageService','$route','$location',function(localStorageService,$route,$location){
            var drive_route = localStorageService.getItem($route.current.params.id);
            console.log('MAAP',drive_route);
            if(!drive_route){
              $location.path('/');
            }
            return drive_route;
          }
          ]
        }
      })
      .otherwise({
        redirectTo: '/'
      });

        $locationProvider
      .html5Mode({
        enabled:true,
        requireBase:false
      });
  });
  




drivingApp.run(['$rootScope','$location',function ($rootScope, $location) {

    var history = [];
 $rootScope.$on('$routeChangeSuccess', function() {
        history.push($location.$$path);
    });

    $rootScope.back = function () {
        var prevUrl = history.length > 1 ? history.splice(-2)[0] : "/";
        $location.path(prevUrl);
    };


  }]);