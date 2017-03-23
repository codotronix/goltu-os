(function(){
	angular.module('startmenu').controller('startMenuController', startMenuController);

	startMenuController.$inject = ['$http'];

	function startMenuController ($http) {
		var vm = this;
		vm.menu = undefined;

		$http.get('config/start-menu-config.json')
		.then(function(res){
			console.log(res);
			vm.menu = res.data;
		},
		function(err){
			console.log(err);
		})
	}
})()