'use strict'

mainController = ($scope, $filter) ->
	vm = this
	setCurrentMonthPrams = ->
		vm.currentMonth = new Date(vm.year, vm.month).getMonth()
		vm.currentYear = new Date(vm.year, vm.month).getFullYear()
		vm.firstDayOfMonth = new Date(vm.year, vm.currentMonth).getDay()
		vm.monthLength = new Date(vm.year, vm.currentMonth+1, 0).getDate()
	
	setSelectedDateText = ->
		vm.selectedDateTextFormat1 = 
			$filter('date')(vm.selectedDate, 'd / ') + 
			vm.months[vm.selectedDate.getMonth()][1] + 
			$filter('date')(vm.selectedDate, ' / yyyy')
		vm.selectedDateTextFormat2 = 
			$filter('date')(vm.selectedDate, 'd ') + 
			vm.months[vm.selectedDate.getMonth()][1] + 
			$filter('date')(vm.selectedDate, ' yyyy ')
		
	createMonthArr = ->
		week = []
		currentDay = vm.firstDayOfMonth
		iterations = vm.monthLength + vm.firstDayOfMonth
		vm.weeks = []

		newWeek = ->
			vm.weeks.push(week)
			week=[]
			currentDay = 0

		if vm.currentMonth is 0 and currentDay is 0 
			vm.firstDayOfMonth = currentDay = 6
			
		for date in [1..vm.monthLength]
			if date isnt 1
				week.push(date)
				if vm.monthLength is date
					week[6] = ''
					vm.weeks.push(week)
				if currentDay isnt 6 then currentDay++
				else newWeek()
			else
				if currentDay is 6
					week[vm.firstDayOfMonth] = 1
					newWeek()
				else week[vm.firstDayOfMonth-1] = 1
		console.log("vm.weeks ", vm.weeks)

	vm.dateNow = vm.selectedDate = new Date()
	vm.day = vm.dateNow.getDate()
	vm.month = vm.dateNow.getMonth()
	vm.year = vm.dateNow.getFullYear()		
	vm.time = $filter('date')(vm.dateNow, 'HH:mm')
	vm.days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
	vm.months = [
		['Январь', 'Января']
		['Февраль', 'Февраля']
		['Март', 'Марта']
		['Апрель', 'Апреля']
		['Май', 'Мая']
		['Июнь', 'Июня']
		['Июль', 'Июля']
		['Август', 'Августа']
		['Сентябрь', 'Сентября']
		['Октябрь', 'Октября']
		['Ноябрь', 'Ноября']
		['Декабрь', 'Декабря']
	]
	setSelectedDateText()
	setCurrentMonthPrams()

	vm.changeMonth = (operator) ->
		if operator is '+' then vm.month++
		else vm.month--
		setCurrentMonthPrams()
		createMonthArr()
	
	vm.selectDate = (e, date) ->
		if not date then return
		vm.selectedDate = new Date(
			vm.currentYear, 
			vm.currentMonth, 
			date, 
			vm.dateNow.getHours(), 
			vm.dateNow.getMinutes()
		)
		setSelectedDateText()
		angular.element(document.querySelectorAll('.selected-date')).removeClass('selected-date')
		angular.element(e.target).addClass('selected-date')	

	vm.showSelectedDate = (date) =>
		return (
			vm.selectedDate.getMonth() is vm.currentMonth and
			vm.selectedDate.getFullYear() is vm.currentYear and
			vm.selectedDate.getDate() is date
		)
	
	vm.setMainDate = ->
		vm.mainDate = vm.selectedDateTextFormat2 + vm.time 
		vm.isActive = false

	createMonthArr()

angular
	.module('datepicker')
	.controller('mainController', mainController)

mainController.inject = ['$scope', '$filter']