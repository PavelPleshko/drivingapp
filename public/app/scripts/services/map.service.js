'use strict';
angular.module('drivingApp')
	.factory('GoogleApiService',[function(){
		
		var service = {};
		service.API_KEY = 'AIzaSyBuHiDWtkKuLHrIMX9vG2T3BOUeawGd6Jk';
		service.places = {
			from:null,
			to:null
		};

		service.initAutocompleteForInput = function(inputId){
			service.inputEl = document.getElementById(inputId);
			service.autocomplete = new google.maps.places.Autocomplete(service.inputEl);

		}

		service.destroyAutocomplete = function(){
			service.inputEl = null;
			service.autocomplete = null;
		}

		service.pushPlacesData = function(from,to){
			if(from && to){
				this.places.from = from;
				this.places.to = to;
			}
			console.log(this.places);
		}

		service.getDirections = function(origin,destination){
		var directionsService = new google.maps.DirectionsService();
		var coordsA = [origin.geometry.location.lat(),origin.geometry.location.lng()].join(',');
		var coordsB = [destination.geometry.location.lat(),destination.geometry.location.lng()].join(',');
		var directionsRequest = {
		  origin: coordsA,
		  destination:coordsB,
		  travelMode: google.maps.DirectionsTravelMode.DRIVING,
		  unitSystem: google.maps.UnitSystem.METRIC
		};
		return new Promise((resolve,reject)=>{
			directionsService.route(
			  directionsRequest,
			  function(response, status){	 
			  		if(status == google.maps.DirectionsStatus.OK){
			  			resolve(response);
			  		}else{
			  			reject("Couldnt get the given route. Please try again later.");
			  		}
			  	})
		  });
		}



		return service;
	}])