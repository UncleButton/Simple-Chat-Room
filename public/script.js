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
var timeStamp = (d.getHours()>12?d.getHours()-12:d.getHours())+":"+(d.getMinutes()<10?'0':'')+d.getMinutes()+" "+(d.getHours()>12?"PM":"AM");

var users = [];

socket.emit('new-user', unescapeHTML(pseudo));

socket.on('new-user', function(pseudo) {//when a person joins, do this
	d = new Date();
	timeStamp = (d.getHours()>12?d.getHours()-12:d.getHours())+":"+(d.getMinutes()<10?'0':'')+d.getMinutes()+" "+(d.getHours()>12?"PM":"AM");
	$('#conversation').prepend('<div class="animated fadeInLeft"><p class="new_user"><em><strong>' + pseudo + '</strong>  has joined the chat.</em>'+" "+'<em class="timeStamp">'+timeStamp+'</p><hr></div>');
	//Add animation
	$('#conversation').addClass('animated fadeInDown');
	//and then remove it
	$('#conversation').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
		$('#conversation').removeClass('animated fadeInDown');
	});
});

socket.on('update-users', function(data){
	users=data;
	var list = $('#user_list');
	list.empty();
	for(var i = 0; i<users.length; i++){
		if(i===users.length-1){//no <hr> line above the top person in players list
			list.prepend('<p class="user_list"><strong>' + users[i].name + '</strong></p>');
		}else{//<hr> above each player
			list.prepend('<hr><p class="user_list"><strong>' + users[i].name + '</strong></p>');
		}
	}
});

socket.on('user-left', function(pseudo) {//when a person joins, do this
	d = new Date();
	timeStamp = (d.getHours()>12?d.getHours()-12:d.getHours())+":"+(d.getMinutes()<10?'0':'')+d.getMinutes()+" "+(d.getHours()>12?"PM":"AM");
	$('#conversation').prepend('<div class="animated fadeInLeft"><p class="user-left"><em><strong>' + pseudo + '</strong>  has left the chat.</em>'+" "+'<em class="timeStamp">'+timeStamp+'</p><hr></div>');
	//Add animation
	$('#conversation').addClass('animated fadeInDown');
	//and then remove it
	$('#conversation').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
		$('#conversation').removeClass('animated fadeInDown');
	});
});

socket.on('message', function(data) {//when someone sends a message, do this
	d = new Date();
	timeStamp = (d.getHours()>12?d.getHours()-12:d.getHours())+":"+(d.getMinutes()<10?'0':'')+d.getMinutes()+" "+(d.getHours()>12?"PM":"AM");
	$('#conversation').prepend('<div class="animated fadeInLeft"><p class="name he">' + data.pseudo + " "+'<em class="timeStamp">'+timeStamp+'</p><p class="message he">' + data.message + '</p><hr class="hr-messaging"></div>');
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
			timeStamp = (d.getHours()>12?d.getHours()-12:d.getHours())+":"+(d.getMinutes()<10?'0':'')+d.getMinutes()+" "+(d.getHours()>12?"PM":"AM");
			socket.emit('message', input.val());
			$('#conversation').prepend('<div class="animated fadeInRight"><p class="name">' + "You " + '<em class="timeStamp">'+timeStamp+'</p><p class="message my_chats">' + escape(input.val()) +'</div></p><hr class="hr-messaging"></div>');
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
