/*
* ==================================
*    horrorpenguin js
* ==================================
*/

function emailAlert(elem, type, msg) {
	var alert = '<div class="alert alert-' + type + ' emailAlert"><b>' + type + '</b> ' + msg + '</div>';
	elem.before(alert)
	var closure = $($('.emailAlert')[$('.emailAlert').length - 1]);
	setTimeout(function() {
		closure.fadeOut('slow');
	}, 3000)
}

$(function() {
	var header = $('.header-overlay');
	$(window).stellar()
	$(window).scroll(function() {
		if($(window).scrollTop() > 500) {
			header.css('opacity', '0')
		} else {
			header.css('opacity', '1')
		}
	})

	$('form').submit(function(e) {
		e.preventDefault()
		var name = $('[name="contact_name"]')
			, email = $('[name="contact_email"]')
			, subject = $('[name="contact_subject"]')
			, message = $('[name="contact_message"]');
		var obj = {
			name: name.val(),
			email: email.val(),
			subject: subject.val(),
			message: message.val()
		};
		$.post('/', obj, function(data) {
			console.log(data)
			if(data === 'good') {
				emailAlert($('form'), 'success', 'successfully sent an email.')
			} else if (data === 'notgood') {
				emailAlert($('form'), 'warning', 'doing this too much.')
			} else {
				emailAlert($('form'), 'danger', 'something broked.')
			}
			
			name.val('');
			email.val('');
			subject.val('');
			message.val('');
		})

	})
})