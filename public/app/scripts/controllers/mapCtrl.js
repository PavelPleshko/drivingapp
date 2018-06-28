'use strict';

angular.module('drivingApp')
.controller('MapCtrl',['$scope','$rootScope','$location','GoogleApiService','selectedRoute',
	function($scope,$rootScope,$location,googleApiService,selectedRoute){
	$scope.from;
	$scope.to;
	$scope.distance;
	$scope.duration;
	$scope.selectedRoute;
	var map;

	$scope.goBack= function(){
		$rootScope.back();
	};

	var initDirections = function(from,to){

		getMapAndInit(from);
		let directionsDisplay = new google.maps.DirectionsRenderer();
	
		directionsDisplay.setMap(map);
		googleApiService.getDirections(from,to).then(function(data){
			let distanceDetails = data.routes[0].legs[0];
			$scope.distance = distanceDetails.distance.text;
			$scope.duration = distanceDetails.duration.text;
			$scope.$digest();
			directionsDisplay.setDirections(data);
		})
	};

	function getMapAndInit(from){
			var pointAStart = getCenter(from);
		let options = {
			zoom:9,
			center: pointAStart,
		}
		let mapElement = document.getElementById('distance_map');
		map = new google.maps.Map(mapElement,options);
	}



	function getPlacesDetails(selectedRoute,placeService){
		return new Promise((resolve,reject)=>{
			let placeA;
			let placeB;

			placeService.getDetails({placeId:selectedRoute.from.place_id},function(place,status){
				placeA = place;
				if(placeA && placeB){
					resolve({from:placeA,to:placeB});
				}
			});
			placeService.getDetails({placeId:selectedRoute.to.place_id},function(place,status){
				placeB = place;
				if(placeA && placeB){
					resolve({from:placeA,to:placeB});
				}
			});
		})
			

	}

	function getCenter(from){
		let coords = from.geometry.location;
		if(typeof coords.lat == 'function'){
			return {
			lat:coords.lat(),
			lng:coords.lng()
			}
		}else{
			return {
			lat:coords.lat,
			lng:coords.lng
		}
		}
		
	}
var onInit = function(){
		
		if(selectedRoute){
			console.log('ITS HERE',selectedRoute);
			getMapAndInit(selectedRoute.from);
			let placeService = new google.maps.places.PlacesService(map);

			getPlacesDetails(selectedRoute,placeService).then((data)=>{
				$scope.from = data.from;
	    		$scope.to = data.to;
	    		 initDirections($scope.from,$scope.to);
	    		 $scope.$digest();
			})

			
		}else{
			$scope.from = googleApiService.places.from;
	  	    $scope.to = googleApiService.places.to;

	  	    initDirections($scope.from,$scope.to);
		}
		
		
	}
	onInit();

}])