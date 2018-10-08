(function () {
	angular.module('windows').directive('extWebApp', extWebApp);

	extWebApp.$inject = ['taskman', 'windowService', '$sce'];

	function extWebApp (taskman, windowService, $sce) {
		return {
			restrict: 'AE',
			replace: true,
			templateUrl: 'app/windows/extwebapptemplate.html',			
			controller: ['$scope', function ($scope) {
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
			}]
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
			windowService.restoreSize(id);
		}

	};

	
})()