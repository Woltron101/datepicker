;
(function() {
'use strict';

	angular
		.module('datepicker')
		.controller('mainController', mainController);

	mainController.inject = ['$scope', '$filter'];
	function mainController($scope, $filter) {
		var vm = this;
		
		vm.dateNow = vm.selectedDate = new Date();
		vm.day = vm.dateNow.getDate();
		vm.month = vm.dateNow.getMonth();
		vm.year = vm.dateNow.getFullYear();		
		vm.time = $filter('date')(vm.dateNow, 'HH:mm');
		vm.days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
		vm.months = [
			['Январь', 'Января'],
			['Февраль', 'Февраля'],
			['Март', 'Марта'],
			['Апрель', 'Апреля'],
			['Май', 'Мая'],
			['Июнь', 'Июня'],
			['Июль', 'Июля'],
			['Август', 'Августа'],
			['Сентябрь', 'Сентября'],
			['Октябрь', 'Октября'],
			['Ноябрь', 'Ноября'],
			['Декабрь', 'Декабря']
		];
		setSelectedDateText();
		setCurrentMonthPrams();

// TODO rename month to Ru
		vm.changeMonth = function(operator){			
			if(operator === '+') vm.month++;
			else vm.month--;
			setCurrentMonthPrams();
			createMonthArr();
		}
		
		vm.selectDate = function(e, date){
			if(!date) return;
			vm.selectedDate = new Date(
				vm.currentYear, 
				vm.currentMonth, 
				date, 
				vm.dateNow.getHours(), 
				vm.dateNow.getMinutes()
			);
			setSelectedDateText();
			angular.element(document.querySelectorAll('.selected-date')).removeClass('selected-date');
			angular.element(e.target).addClass('selected-date');
		}

		vm.showSelectedDate = function(date){
			return (
				vm.selectedDate.getMonth() === vm.currentMonth &&
				vm.selectedDate.getFullYear() === vm.currentYear &&
				vm.selectedDate.getDate() === date
			)
		}
		
		vm.setMainDate = function(){
			vm.mainDate = vm.selectedDateTextFormat2 + vm.time; 
			vm.isActive = false;
		}

		function createMonthArr(){
			var week = [];
			var currentDay = vm.firstDayOfMonth;
			var iterations = vm.monthLength + vm.firstDayOfMonth;
			vm.weeks = []

			if(vm.currentMonth === 0 && currentDay === 0) vm.firstDayOfMonth = currentDay =  6;

			for (var date = 1; date <= vm.monthLength; date++) {
				if(date !== 1) {
					week.push(date);
					if (vm.monthLength === date) {
						week[6] = '';
						vm.weeks.push(week);
					}
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
		
		function setCurrentMonthPrams(){
			vm.currentMonth = new Date(vm.year, vm.month).getMonth();
			vm.currentYear = new Date(vm.year, vm.month).getFullYear();
			vm.firstDayOfMonth = new Date(vm.year, vm.currentMonth).getDay();
			vm.monthLength = new Date(vm.year, vm.currentMonth+1, 0).getDate();
		}
		
		function setSelectedDateText(){
			vm.selectedDateTextFormat1 = 
				$filter('date')(vm.selectedDate, 'd / ') + 
				vm.months[vm.selectedDate.getMonth()][1] + 
				$filter('date')(vm.selectedDate, ' / yyyy');
			vm.selectedDateTextFormat2 = 
				$filter('date')(vm.selectedDate, 'd ') + 
				vm.months[vm.selectedDate.getMonth()][1] + 
				$filter('date')(vm.selectedDate, ' yyyy ');
		}

		createMonthArr();
	}
})();