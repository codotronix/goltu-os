(function () {
	angular.module('windows')
	.factory('windowService', windowService);

	windowService.$inject = ['constants'];

	function windowService (constants) {
		
		return {
			minimizeWindow: minimizeWindow,
			maximizeWindow: maximizeWindow,
			goFullSize: goFullSize,
			getRandomTopLeft: getRandomTopLeft
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