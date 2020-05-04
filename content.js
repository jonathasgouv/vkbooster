rex = /\((.*)\)/;

data = [];

let urlmembro, texto, accesskey;

chrome.storage.sync.get(
	[
		'key'
	],
	function(result) {
		urlmembro = result.key[0];
		texto = result.key[1];
		accesskey = result.key[2];
	}
);

function highest(arguments) {
	return [].slice.call(arguments).sort(function(a, b) {
		return b.likes.count - a.likes.count;
	});
}

function generateHTML(tag, url) {
	if (tag == 'gif') {
		html = '<img src="' + url.toString() + '"/>';

		return html;
	} else if (tag == 'audioogg') {
		html =
			'<audio controls>\n<source src="' +
			url.toString() +
			'" type="audio/ogg">\nYour browser does not support the audio element.\n</audio>';
		return html;
	} else if (tag == 'audio') {
		html =
			'<audio controls>\n<source src="' +
			url.toString() +
			'" type="audio/mp3">\nYour browser does not support the audio element.\n</audio>';
		return html;
	} else if (tag == 'video') {
		html =
			'<video width="560" height="320" controls="controls"><source src="' +
			url.toString() +
			'" type="video/mp4"></video>';
		return html;
	}
}

setInterval(function() {
	url = document.location.toString();
	if (url.includes('vk.com/topic-') && urlmembro != undefined) {
		try {
			posts = document.getElementsByClassName('bp_info');
			for (i = 0; i <= posts.length; i++) {
				if (
					posts[i]
						.getElementsByClassName('bp_author_wrap')[0]
						.getElementsByClassName('bp_author')[0]
						.href.toString() == urlmembro.toString()
				) {
					posts[i].innerHTML = texto.toString();
					posts[i].style.textAlign = 'center';
					posts[i].style.fontWeight = 'bolder';
				}
			}
		} catch (error) {}
	} else {
	}
}, 500);

setInterval(function() {
	url = document.location.toString();
	if (url.includes('vk.com/topic-')) {
		try {
			paragrafos = document.getElementsByTagName('p');
			for (i = 0; i <= paragrafos.length; i++) {
				if (paragrafos[i].innerHTML.includes('&lt;gif&gt;')) {
					link = paragrafos[i].innerText.split('<gif>')[1];
					paragrafos[i].innerHTML = generateHTML('gif', link);
				} else if (paragrafos[i].innerHTML.includes('&lt;audogg&gt;')) {
					link = paragrafos[i].innerText.split('<audogg>')[1];
					paragrafos[i].innerHTML = generateHTML('audioogg', link);
				} else if (paragrafos[i].innerHTML.includes('&lt;aud&gt;')) {
					link = paragrafos[i].innerText.split('<aud>')[1];
					paragrafos[i].innerHTML = generateHTML('audio', link);
				} else if (paragrafos[i].innerHTML.includes('&lt;vid&gt;')) {
					link = paragrafos[i].innerText.split('<vid>')[1];
					paragrafos[i].innerHTML = generateHTML('video', link);
				}
			}
		} catch (error) {}
	} else {
	}
}, 500);
