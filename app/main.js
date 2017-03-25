require.config({
	baseUrl: "app",
	paths: {
		'jquery': 'lib/js/jquery-3.2.0.min',
		'angular': 'lib/js/angular',
		'goltu-os': 'app',
		'startmenu': 'startmenu/startmenu',
		'taskmanager': 'taskmanager/taskmanager',
		'windows': 'windows/windows'
	},

	shim: {
		'angular': {
			deps: ['jquery']
		},
		'goltu-os': {
			deps: ['angular', 'startmenu', 'taskmanager', 'windows']
		}
	}
});

require([
	'angular', 'goltu-os'
	], function() {
	angular.bootstrap(document, ['goltu-os']);
})