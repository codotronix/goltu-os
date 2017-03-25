(function () {
	angular.module('windows')
	.factory('windowService', windowService);

	windowService.$inject = [];

	function windowService () {
		
		return {
			minimizeWindow: minimizeWindow,
			maximizeWindow: maximizeWindow
		}

		function minimizeWindow (taskID) {
			$('#'+taskID)
			.removeClass('animated zoomOutDown zoomInUp')
			.addClass('animated zoomOutDown')
			.hide(1000);
		}

		function maximizeWindow (taskID) {
			$('#'+taskID)
			.removeClass('animated zoomOutDown zoomInUp')
			.addClass('animated zoomInUp')
			.css('display', 'block');
		}
	}
})()