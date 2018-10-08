(function(){
	angular.module('startmenu').controller('startMenuController', startMenuController);

	startMenuController.$inject = ['$http', 'taskman'];

	function startMenuController ($http, taskman) {
		var vm = this;
		vm.menu = availableApps;
		taskman.setApps(vm.menu);
		
		vm.startApp = startApp;

		// $http.get('config/start-menu-config.json')
		// .then(function(res){
		// 	//console.log(res);
		// 	vm.menu = res.data;
		// 	taskman.setApps(vm.menu);
		// },
		// function(err){
		// 	console.log(err);
		// });

		function startApp (ev) {
			ev.stopPropagation();
			var $el = $(ev.target);
			var appName = $el.hasClass('menu-name') ? $el.text() : $el.find('.menu-name').eq(0).text();
			
			//console.log("clicked appName="+appName);

			taskman.startApp(appName);
		}
	}
})();