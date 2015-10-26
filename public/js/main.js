/*
	* FEEL FREE TO USE ALL THE CODE ON HERE HOWEVER YOU WANT! 
	* ALL THE CODE IS OPEN SOURCE, AND IS VIEWABLE ON GITHUB
	* BY CLICKING THE 'FORK ME ON GITHUB' BUTTON ON THE TOP 
	* RIGHT OF THIS PAGE! 
	* 
	* KANYE WEST 2020
	*
	* Coltrane Nadler © 2015
*/

  var ua = navigator.userAgent,
    isMobileWebkit = /WebKit/.test(ua) && /Mobile/.test(ua);

  if (isMobileWebkit) {
    $('html').addClass('mobile');
  }

$(function() {

		// wait for the dom to load before doing the animation
		$('.header-info').addClass('header-info-show');
		$('.header-info').removeClass('hide');

		var header = $('.header-overlay');
		var iScrollInstance;

		if (isMobileWebkit) {
			iScrollInstance = new iScroll('wrapper');

			jQuery('#scroller').stellar({
				scrollProperty: 'transform',
				positionProperty: 'transform',
				horizontalScrolling: false,
			});
		} else {
		  	$.stellar({
		    	horizontalScrolling: false,
		  	});
		}

		$(window).scroll(function() {
			if($(window).scrollTop() > 500) {
				header.css('opacity', '0')
			} else {
				header.css('opacity', '1')
			}
		})
})