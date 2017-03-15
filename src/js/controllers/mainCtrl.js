;
(function() {
'use strict';

	angular
		.module('datepicker')
		.controller('mainController', mainController);

	mainController.inject = ['$scope'];
	function mainController($scope) {
		var vm = this;
		
		vm.dateNow = new Date();
		vm.day = vm.dateNow.getDate();
		vm.month = vm.dateNow.getMonth();
		vm.year = vm.dateNow.getFullYear();
		vm.curruntMonth = new Date(vm.year, vm.month).getMonth();
		vm.firstDayOfMonth = new Date(vm.year, vm.curruntMonth).getDay();
		vm.curruntYear = new Date(vm.year, vm.month).getFullYear();
		vm.monthLength = new Date(vm.year, vm.curruntMonth+1, 0).getDate();
		vm.ms = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']

		vm.changeMonth = function(operator){			
			if(operator === '+') vm.month++;
			else vm.month--;

			vm.curruntMonth = new Date(vm.year, vm.month).getMonth();
			vm.curruntYear = new Date(vm.year, vm.month).getFullYear();
			vm.firstDayOfMonth = new Date(vm.year, vm.curruntMonth).getDay();
			vm.monthLength = new Date(vm.year, vm.curruntMonth+1, 0).getDate();
				
			createMonthArr();
		}

		function createMonthArr(){
			var week = [];
			var currentDay = vm.firstDayOfMonth;
			var iterations = vm.monthLength + vm.firstDayOfMonth;
			vm.weeks = []

			if(vm.curruntMonth === 0 && currentDay === 0) vm.firstDayOfMonth = currentDay =  6;

			for (var date = 1; date <= vm.monthLength; date++) {
				if(date !== 1) {
					week.push(date);
					if (vm.monthLength === date) vm.weeks.push(week);
					if (currentDay !== 6) currentDay++;
					else newWeek();
				} else {
					if(currentDay === 6) {
						week[vm.firstDayOfMonth] = 1;
						newWeek();
					} else week[vm.firstDayOfMonth-1] = 1;
				} 
			}
			function newWeek(){
				vm.weeks.push(week);
				week=[];
				currentDay = 0;
			}
		}
		$scope.$watch(angular.bind(this, function () {
// 			this.firstDayOfMonth = new Date(this.year, this.month).getDay();
// 			this.monthLength = new Date(this.year, this.month+1, 0).getDate();
// 			this.curruntMonth = new Date(this.year, this.month).getMonth();
//  console.log("this.curruntMonth ", this.curruntMonth);
// 			this.curruntYear = new Date(this.year, this.month).getFullYear();
//  console.log("this.curruntYear ", this.curruntYear);
		}))
		createMonthArr();
	}
})();

