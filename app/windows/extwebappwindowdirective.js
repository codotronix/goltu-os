(function () {
	angular.module('windows').directive('extWebApp', extWebApp);

	extWebApp.$inject = ['taskman', 'windowService'];

	function extWebApp (taskman, windowService) {
		return {
			restrict: 'AE',
			replace: true,
			templateUrl: 'app/windows/extwebapptemplate.html',			
			controller: function ($scope, $element) {
				//console.log($scope);
				//console.log(constants);
				var pos = windowService.getRandomTopLeft();
				//console.log(pos);
				$scope.top = pos.top;
				$scope.left = pos.left;
				$scope.closeApp = closeApp;
				$scope.minimizeWindow = minimizeWindow;
				$scope.goFullSize = goFullSize;
				$scope.restoreSize = restoreSize;

				function closeApp (ev) {
					ev.stopPropagation();
					taskman.destroyTask($scope);
				}
			}
		};

		function minimizeWindow (ev, id) {
			ev.stopPropagation();
			windowService.minimizeWindow(id);
		}


		function goFullSize (ev, id) {
			ev.stopPropagation();
			windowService.goFullSize(id);
		}


		function restoreSize (ev, id) {
			ev.stopPropagation();

			var thisWindow = $('#' + id);

			thisWindow.css({
				top: thisWindow.attr('data-prev-top'),
				left: thisWindow.attr('data-prev-left'),
				height: thisWindow.attr('data-prev-height'),
				width: thisWindow.attr('data-prev-width')
			})
			.removeClass('maximized');
		}

	};

	
})()