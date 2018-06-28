'use strict';

angular.module('drivingApp')
  .controller('MainCtrl', ['$scope','$location','GoogleApiService','LocalStorageService',function ($scope,$location,googleApi,localStorageService) {

  	$scope.savedRoutesTitle='Saved routes';
  	 $scope.autocomplete;
  	 $scope.place_from;
  	 $scope.place_to;
  	 $scope.history=[];

    var autocompleteListener;

  	$scope.initializeAutocomplete = function(event){
  		let targetId = event.target.id;
  		this.destroyAutocomplete();
  		googleApi.initAutocompleteForInput(targetId);
  		 this.autocomplete = googleApi.autocomplete;
  		autocompleteListener = google.maps.event.addListener(this.autocomplete,'place_changed',
  			placeChanged.bind(this,targetId));
  	};

  	$scope.destroyAutocomplete = function(){
  		googleApi.destroyAutocomplete();
  	}

  	$scope.submitForm = function(value){
  		if(this.place_to && this.place_from){
  			googleApi.pushPlacesData(this.place_from,this.place_to);
  			localStorageService.setItem({from:this.place_from,to:this.place_to});
  			$location.path("new/map");
  		}
  	};

  	$scope.removeRoute = function(routeId){
  		localStorageService.removeItem(routeId);
  		getItemsFromStorage();
  	}

  	$scope.goToDetails = function(routeId){
  		let path = '/map/'+routeId;
  		$location.path(path);
  	}

  	function getItemsFromStorage(){
  		$scope.history = localStorageService.getItems();
  	}

  	function placeChanged(targetId){
  		let place = this.autocomplete.getPlace();
  		if(targetId.includes('from')){
  			this.place_from = place;
  		}else if(targetId.includes('to')){
  			this.place_to = place;
  		}
  	}

  	var onInit = function(){
  		getItemsFromStorage();
  	}

  	onInit();
  }]);
