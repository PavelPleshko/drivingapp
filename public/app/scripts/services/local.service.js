	'use strict';
angular.module('drivingApp')
	.factory('LocalStorageService',[function(){
	
		var service = {};
		var key = 'drive_trip';
		
		service.getItems = function(){
			let items = JSON.parse(localStorage.getItem(key));
			if(!items){
				return [];
			}else{
				return items;
			}
		}

		service.setItem = function(item){
			let items = this.getItems();
			let id = (items.length+1) || 1;

			item.id = id;
			console.log(items);
			if(!items.length){
				localStorage.setItem(key,JSON.stringify([item]));
			}else{
				items.push(item);
				localStorage.setItem(key,[JSON.stringify(items)]);
			}
		}

		service.getItem = function(itemId){
			let items = this.getItems();
			let item = items.find(function(itemSingle){
				return itemSingle.id == itemId;
			})
			if(item){
				return item;
			}else{
				return null;
			}
		}

			service.removeItem = function(id){
			let items = this.getItems();
			if(items.length){
				items = items.filter(function(item){
					return item.id != id;
				});
				localStorage.setItem(key,[JSON.stringify(items)]);
			}
		}




		return service;
	}])