$(function () {
	var config_startMenu = undefined;
	var availablePrograms = {};		//A dictionary of all available programs
	var runningPrograms = {};


	init();

	function init () {
		loadStartMenuConfig();
		adjustWindowBodyHeight('sampleWindow');
		setTaskbaridth();		
	}

	function loadStartMenuConfig () {
		$.getJSON('config/start-menu-config.json').then(function(res){
			//console.log(res);
			config_startMenu = res;
			createStartMenu(config_startMenu);
			decorateMenuItems();
		})
	}

	function createStartMenu (list) {
		var htm = '';

		for (var i in list) {
			htm += '<li>' + list[i].name + '</li>';

			if(list[i]["sub-list"] !== undefined) {

				htm += '<ul class="list-2">';
				var sublist = list[i]["sub-list"];

				for(var j in sublist) {
					htm += '<li>' + sublist[j].name + '</li>';
					availablePrograms[sublist[j].name] = sublist[j];
				}
				htm += '</ul>';				
			} 
			else {
				availablePrograms[list[i].name] = list[i];
			}
		}

		$('#startmenu .list-1').html(htm);
		//console.log("availablePrograms=");console.log(availablePrograms);
	}

	function decorateMenuItems () {
		//put right arrow to menus which contains sub menus
		var rightArrowHtml = '<i class="fa show-right fa-caret-right"></i>'
		
		$('.list-1 li+ul').each(function(){
			$(this).prev('li').append(rightArrowHtml);
		});


		//User clicks on a startmenu item
		$('#startmenu').on('click', 'li', function (ev) {
			ev.stopPropagation();
			
			//hide all other list-2				
			$('.list-2').hide();
			$(this).siblings('li').removeClass('active');

			//if it has no submenu, then directly go to that program
			if(!$(this).next().is('ul')) {
				//goto that program and return from here
				openProgram($(this).text());
				return;
			}

			var parentUL = $(this).closest('ul');
			//if it is a list 1 li
			if(parentUL.hasClass('list-1')) {				
				$(this).addClass('active');
				
				var padding = 2;
				var listToShow = $(this).next('.list-2');
				var listToShowHeight = parseFloat(listToShow.css('height')) - padding;
				var list1Height = parseFloat($('.list-1').css('height'));
				
				//adjust list-2 effective bottom position
				if(listToShowHeight <= list1Height) {
					//calculate the top where the list-2 should logically appear
					//find this li's index in list-1
					var clickedLi = $(this);
					var totalList1Items = $('.list-1').children('li').length;
					var clickedLiIndex;
					$('.list-1').children('li').each(function(index,elem){
						if($(this).is(clickedLi)){
							clickedLiIndex = index;
						}
					});

					//console.log(clickedLiIndex);
					var liHeight = parseFloat($('.list-1 li').css('height'));
					var spaceUptoSelectedLi = liHeight * (totalList1Items - clickedLiIndex);
					//console.log(spaceBelowSelectedLi)

					if (spaceUptoSelectedLi >= listToShowHeight) {
						var bottom = spaceUptoSelectedLi - listToShowHeight;
						listToShow.css('bottom', (bottom) + 'px');
					} 
					else {
						listToShow.css('bottom', 0);
					}
				}
				else {
						listToShow.css('bottom', 0);
				}

				listToShow.show();
			}
		});
	}

	function hideMainMenu () {
		$('.list-1, .list-2').hide();
		$('.list-1 li').removeClass('active');
	}

	function showMainMenu () {
		$('.list-1').show();
	}

	$(document).click(function(){
		hideMainMenu();
	})

	$('#startBtn').click(function(ev){
		ev.stopPropagation();
		if($('.list-1').css('display') === 'none') {
			showMainMenu();
		} 
		else {
			hideMainMenu();
		}
	});

	$('body').on('click', '.window-maximize', function() {
		maximizeWindow(this);
	});

	$('body').on('click', '.window-minimize', function() {
		minimizeWindow(this);
	});

	$('body').on('click', '.window-restore', function() {		
		restoreWindow(this);
	});

	$('body').on('click', '.window-close', function() {		
		closeWindow(this);
	});


	function maximizeWindow (jqThis) {
		var maxHt = parseFloat($('#universal-container').css('height')) - parseFloat($('#taskbar').css('height'));

		var thisWindow = $(jqThis).closest('.bx-window');

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

		adjustWindowBodyHeight(thisWindow.attr('id'));
	}


	function restoreWindow (jqThis) {
		var thisWindow = $(jqThis).closest('.bx-window');

		thisWindow.css({
			top: thisWindow.attr('data-prev-top'),
			left: thisWindow.attr('data-prev-left'),
			height: thisWindow.attr('data-prev-height'),
			width: thisWindow.attr('data-prev-width')
		})
		.removeClass('maximized');

		adjustWindowBodyHeight(thisWindow.attr('id'));
	}


	function closeWindow (jqThis) {
		var thisWindow = $(jqThis).closest('.bx-window');

		var windowID = thisWindow.attr('id');

		delete runningPrograms[windowID];

		thisWindow.remove();
		organizeMinimizedWindows();
	}


	$('#taskbar').on('click', '.stamp-window', function (ev) {
		ev.stopPropagation();
		var winID = $(this).attr('id').split('-')[1];
		toggleMaxMin(winID);
	})


	function toggleMaxMin (id) {
		if ($('#' + id).css('display') === 'none') {
			$('#' + id).show();
		}
		else {
			$('#' + id).hide();
		}
	}


	function minimizeWindow (jqThis) {
		$(jqThis).closest('.bx-window').hide();
	}


	function openProgram (progName) {		
		var program = availablePrograms[progName];

		if(program.type === "Ext-Web-App") {
			openExtWebApp(program);
		}

		organizeMinimizedWindows();
	}


	function openExtWebApp (program) {
		var progID = (program.name + Math.random().toString()).replace(/[ .]/g, '');

		//Clone a sample window and Change the ID
		var w = $('#sampleWindow').clone();
		w.attr('id', progID);

		//Load the iframe with external web app url
		//via a form, so that it can be later resubmitted
		var iframeName = "iframe-" + progID;
		var iframeHtm = '<iframe name="' + iframeName + '"></iframe>'
						+ '<form target="' + iframeName + '" action="' + program.url + '"></form>';
				
		w.find('.window-body').html(iframeHtm)
		w.find('.title').text(program.name);

		//Give it a random position
		var randomTopLeft = getRandomTopLeft();
		w.css({
			'top': randomTopLeft.top,
			'left': randomTopLeft.left
		})

		//Finally add the window
		$('#universal-container').append(w);

		w.find('form').submit();

		runningPrograms[progID] = program;
	}


	function getRandomTopLeft () {
		var worldHt = $('#universal-container').innerHeight();
		var worldWd = $('#universal-container').innerWidth();

		var winHt = $('#sampleWindow').outerHeight();
		var winWd = $('#sampleWindow').outerWidth();

		var diffHt = worldHt - winHt;
		var diffWd = worldWd - winWd;

		var rTop = diffHt > 0 ? Math.floor(Math.random() * diffHt) : 0;
		var rLeft = diffWd > 0 ? Math.floor(Math.random() * diffWd) : 0;

		return({'top': rTop, 'left': rLeft});
	}

	/* 
	* set the window-body height to 
	* heightOfThatWindow - heightOfItsTitleBar
	*/
	function adjustWindowBodyHeight(id){
		var windowHt = parseFloat($('#' + id).css('height'));
		var titleHt = parseFloat($('#' + id + ' .window-title').css('height'))
		var winBodyHt = windowHt - titleHt;

		$('#' + id + ' .window-body').css('height', winBodyHt + 'px');

		//refresh iframe if refreshOnResize is true in Config
		if(runningPrograms[id] !== undefined 
			&& runningPrograms[id]["refreshOnResize"]) {
			$('#' + id + ' form').submit();
		}
	}


	/*
	* A window should come forward if clicked
	*/
	$('body').on('click', '.bx-window', function (ev) {
		ev.stopPropagation();
		$('.bx-window').css('z-index', 9);
		$(this).css('z-index', 99);
	});


	function setTaskbaridth () {
		var occupiedWidth = parseFloat($('#taskbar .leftGroup').css('width')) + parseFloat($('#taskbar .rightGroup').css('width'));

		var vacantWidth = parseFloat($('#taskbar').css('width')) - occupiedWidth;

		$('#taskbar .centerGroup').css('width', vacantWidth + 'px');
	}


	function organizeMinimizedWindows () {
		var noOfRunningPrograms = 0;
		for(var key in runningPrograms) {
			noOfRunningPrograms++;
		}
		var taskbarWidth = parseFloat($('#taskbar .centerGroup').css('width'))
		var stampWd = taskbarWidth / noOfRunningPrograms;

		var w = $('#sampleStampWindow').clone();

		$('#taskbar .centerGroup').html('');

		for(var key in runningPrograms) {
			var w = $('#sampleStampWindow').clone();
			var stampID = 'stamp-' + key;
			w.attr({
				'id': stampID,
				'title': runningPrograms[key].name
			})
			.css({
				'width': stampWd + 'px'
			})
			.find('.title').text(runningPrograms[key].name);

			$('#taskbar .centerGroup').append(w);
		}
	}

})