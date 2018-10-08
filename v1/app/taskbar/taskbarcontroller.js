(function () {
	angular.module('taskbar')
	.controller('taskbarController', taskbarController);

	taskbarController.$inject = ['taskman', 'windowService', '$timeout'];

	function taskbarController (taskman, windowService, $timeout) {
		var vm = this;
		vm.getRunningTasks = taskman.getRunningTasks;
		vm.toggleWindow = toggleWindow;

		init();

		function init () {
			$timeout(setTaskbarWidth, 1000);
		}


		function toggleWindow (ev, taskID) {
			ev.stopPropagation();

			if($('#'+taskID).css('display') !== 'none') {
				windowService.minimizeWindow(taskID);
			}
			else {
				windowService.maximizeWindow(taskID);
			}
		}


		function setTaskbarWidth () {
			var occupiedWidth = parseFloat($('#taskbar .leftGroup').css('width')) + parseFloat($('#taskbar .rightGroup').css('width'));
			//console.log('occupiedWidth='+occupiedWidth);
			var vacantWidth = parseFloat($('#taskbar').css('width')) - occupiedWidth;
			//console.log('vacantWidth='+vacantWidth);
			$('#taskbar .centerGroup').css('width', vacantWidth + 'px');
		}

		
	}
})()