(function () {
	angular.module('taskmanager')
	.factory('taskman', taskman);

	taskman.$inject = ['$compile', '$rootScope'];

	function taskman ($compile, $rootScope) {
		var availableApps = {};
		var runningTasks = {};

		return {
			setApps: setApps,
			startApp: startApp,
			getRunningTasks: getRunningTasks,
			destroyTask: destroyTask
		};

		/*
		* Set available apps 
		*/
		function setApps (startMenuConfig) {
			for (var k in startMenuConfig) {
				if(startMenuConfig[k]['sub-list'] !== undefined && startMenuConfig[k]['sub-list'].length > 0) {
					
					for(var i in startMenuConfig[k]['sub-list']) {
						addApp(startMenuConfig[k]['sub-list'][i]);
					}
				}
				else {
					addApp(startMenuConfig[k]);
				}
			}

			//console.log(availableApps);
		}


		function addApp (app) {
			availableApps[app.name] = app;
		}


		function startApp (appName) {
			if(availableApps[appName] === undefined) {
				//not a valid app; show error and return
				return;
			}
			 
			var scope = $rootScope.$new();
	
			scope.app = angular.copy(availableApps[appName]);
			scope.taskID = (appName + Math.random().toString()).replace(/[ .]/g, '');
			scope.app.taskID = scope.taskID;

			var appWindow = $compile('<ext-web-app></ext-web-app>')(scope);

			$('#universal-container').append(appWindow);

			//store the scope, so that later we can call scope.$destroy
			runningTasks[scope.taskID] = scope;
			//console.log(runningTasks);
		}


		function getRunningTasks () {
			//console.log('returning ');console.log(runningTasks);
			return runningTasks;
		}


		function destroyTask(scope) {
			//remove it from currently running tasks
			delete runningTasks[scope.taskID];

			//remove html from DOM
			$('#'+scope.taskID)
			//.addClass('animated lightSpeedOut')
			.hide(300, function(){
				$(this).remove();
			})
			//.remove();

			//finally destroy the scope
			scope.$destroy();
		}
	}
})()