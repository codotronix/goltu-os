(function () {
	angular.module('windows').directive('extWebApp', extWebApp);

	extWebApp.$inject = ['constants', 'taskman', windowService];

	function extWebApp (constants, taskman, windowService) {
		return {
			restrict: 'AE',
			replace: true,
			templateUrl: 'app/windows/extwebapptemplate.html',			
			controller: function ($scope, $element) {
				//console.log($scope);
				//console.log(constants);
				var pos = getRandomTopLeft();
				console.log(pos);
				$scope.top = pos.top;
				$scope.left = pos.left;
				$scope.closeApp = closeApp;
				$scope.minimizeWindow = minimizeWindow;
				$scope.maximizeWindow = maximizeWindow;

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


		function maximizeWindow (ev, id) {
			ev.stopPropagation();
			windowService.maximizeWindow(id);
		}


		function getRandomTopLeft () {
			var worldHt = $('#universal-container').innerHeight();
			var worldWd = $('#universal-container').innerWidth();

			var winHt = constants.WINDOW_DEFAULT_HEIGHT;
			var winWd = constants.WINDOW_DEFAULT_WIDTH;

			var diffHt = worldHt - winHt;
			var diffWd = worldWd - winWd;

			console.log('winWd='+winWd);
			console.log('diffWd='+diffWd);

			var rTop = diffHt > 0 ? Math.floor(Math.random() * diffHt) : 0;
			var rLeft = diffWd > 0 ? Math.floor(Math.random() * diffWd) : 0;

			return({'top': rTop, 'left': rLeft});
		}
	};

	
})()