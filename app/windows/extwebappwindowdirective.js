(function () {
	angular.module('windows').directive('extWebApp', extWebApp);

	extWebApp.$inject = [];

	function extWebApp () {
		return {
			restrict: 'AE',
			replace: true,
			templateUrl: 'app/windows/extwebapptemplate.html',			
			controller: function ($scope) {
				//console.log($scope);
			}
		};
	}
})()