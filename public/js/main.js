/*
* ==================================
*    horrorpenguin js
* ==================================
*/

  var ua = navigator.userAgent,
    isMobileWebkit = /WebKit/.test(ua) && /Mobile/.test(ua);

  if (isMobileWebkit) {
    $('html').addClass('mobile');
  }

$(function() {

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