(function () {
	angular.module('taskbar')
	.controller('taskbarController', taskbarController);

	taskbarController.$inject = ['taskman', 'windowService'];

	function taskbarController (taskman, windowService) {
		var vm = this;
		vm.getRunningTasks = taskman.getRunningTasks;
		vm.toggleWindow = toggleWindow;

		function toggleWindow (ev, taskID) {
			ev.stopPropagation();

			if($('#'+taskID).css('display') !== 'none') {
				windowService.minimizeWindow(taskID);
			}
			else {
				windowService.maximizeWindow(taskID);
			}
		}

		
	}
})()