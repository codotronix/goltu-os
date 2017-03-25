(function () {
	angular.module('windows')
	.factory('windowService', windowService);

	windowService.$inject = ['constants', 'taskman'];

	function windowService (constants, taskman) {
		
		return {
			minimizeWindow: minimizeWindow,
			maximizeWindow: maximizeWindow,
			goFullSize: goFullSize,
			restoreSize: restoreSize,
			getRandomTopLeft: getRandomTopLeft,
			adjustWindowBodyHeight: adjustWindowBodyHeight
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

		function goFullSize (taskID) {
			var maxHt = parseFloat($('#universal-container').css('height')) - parseFloat($('#taskbar').css('height'));

			var thisWindow = $('#'+taskID);

			thisWindow
			.attr({
				"data-prev-height": thisWindow.css('height'),
				"data-prev-width": thisWindow.css('width'),
				"data-prev-top": thisWindow.css('top'),
				"data-prev-left": thisWindow.css('left')
			})
			.css({
				top: 0,
				left: 0,
				height: maxHt + 'px',
				width: "100%"
			})
			.addClass('maximized');

			adjustWindowBodyHeight(taskID);
		}


		function restoreSize (id) {
			var thisWindow = $('#' + id);

			thisWindow.css({
				top: thisWindow.attr('data-prev-top'),
				left: thisWindow.attr('data-prev-left'),
				height: thisWindow.attr('data-prev-height'),
				width: thisWindow.attr('data-prev-width')
			})
			.removeClass('maximized');

			adjustWindowBodyHeight(id);
		}


		/* 
		* set the window-body height to 
		* heightOfThatWindow - heightOfItsTitleBar
		*/
		function adjustWindowBodyHeight(id){
			var windowHt = $('#' + id).height();
			var titleHt = $('#' + id + ' .window-title').height();
			var winBodyHt = windowHt - titleHt;

			$('#' + id + ' .window-body').css('height', winBodyHt + 'px');

			//refresh iframe if refreshOnResize is true in Config
			var runningPrograms = taskman.getRunningTasks();
			if(runningPrograms[id] !== undefined 
				&& runningPrograms[id]["refreshOnResize"]) {
				$('#' + id + ' form').submit();
			}
		}


		function getRandomTopLeft () {
			var worldHt = $('#universal-container').innerHeight();
			var worldWd = $('#universal-container').innerWidth();

			var winHt = constants.WINDOW_DEFAULT_HEIGHT;
			var winWd = constants.WINDOW_DEFAULT_WIDTH;

			var diffHt = worldHt - winHt;
			var diffWd = worldWd - winWd;

			//console.log('winWd='+winWd);
			//console.log('diffWd='+diffWd);

			var rTop = diffHt > 0 ? Math.floor(Math.random() * diffHt) : 0;
			var rLeft = diffWd > 0 ? Math.floor(Math.random() * diffWd) : 0;

			return({'top': rTop, 'left': rLeft});
		}
	}
})()