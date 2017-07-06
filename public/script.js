var htmlEscapes = {
	'&': '&amp;',
	'<': '&lt;',
	'>': '&gt;',
	'"': '&quot;',
	"'": '&#x27;',
	'/': '&#x2F;'
};

var escape = function(str) {
	return ('' + str).replace(htmlEscaper, function(match) {
		return htmlEscapes[match];
	});
};

var unescapeHTML = function(str) {
	return str.replace('&amp;', '&')
            .replace('&quot;', '"')
            .replace('&lt;', '<')
            .replace('&gt;', '>');
};

var htmlEscaper = /[&<>"'\/]/g;

var pseudo = escape(prompt('Choose a nickname for yourself.')) || 'Anonymous';

var socket = io.connect();

var d = new Date();

socket.emit('new-user', unescapeHTML(pseudo));

socket.on('new-user', function(pseudo) {//when a person joins, do this
	d = new Date();
	$('#conversation').prepend('<div class="animated fadeInLeft"><p class="new_user"><em><strong>' + pseudo + '</strong>  has joined the chat.</em> <div class="timeStamp"> <em>'+(d.getHours()>12?d.getHours()-12:d.getHours())+":"+(d.getMinutes()<10?'0':'')+d.getMinutes()+" "+(d.getHours()>12?"PM":"AM")+'</em></div></p><hr></div>');
	//Add animation
	$('#conversation').addClass('animated fadeInDown');
	//and then remove it
	$('#conversation').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
		$('#conversation').removeClass('animated fadeInDown');
	});
});

socket.on('message', function(data) {//when someone sends a message, do this
	d = new Date();
	$('#conversation').prepend('<div class="animated fadeInLeft"><p class="name he">' + data.pseudo + '</p><p class="message he">' + data.message + '<div class="timeStamp"> <em>'+(d.getHours()>12?d.getHours()-12:d.getHours())+":"+(d.getMinutes()<10?'0':'')+d.getMinutes()+" "+(d.getHours()>12?"PM":"AM")+'</em></div></p><hr></div>');
	//Add animation
	$('#conversation').addClass('animated fadeInDown');
	//and then remove it when animation ends
	$('#conversation').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
		$('#conversation').removeClass('animated fadeInDown');
	});
});

var input = $('input');
input.keyup(function(event) {//when you send a message, do this
	if (event.which == 13) {
		if (input.val()) {
			d = new Date();
			socket.emit('message', input.val());
			$('#conversation').prepend('<div class="animated fadeInRight"><p class="name">' + "You" + '</p><p class="message my_chats">' + escape(input.val()) + '<div class="timeStamp"> <em>'+(d.getHours()>12?d.getHours()-12:d.getHours())+":"+(d.getMinutes()<10?'0':'')+d.getMinutes()+" "+(d.getHours()>12?"PM":"AM")+'</em></div></p><hr></div>');
			//Add animation
			$('#conversation').addClass('animated fadeInDown');
			//and then remove it when animation ends
			$('#conversation').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
				$('#conversation').removeClass('animated fadeInDown');
			});
			input.val('');
			input.attr('placeholder', 'Type your message...');
			input.focus();
		}
	}
});
