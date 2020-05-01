urlmembro = '';

chrome.storage.sync.get(
	[
		'key'
	],
	function(result) {
		urlmembro = result.key;
	}
);

setInterval(function() {
	url = document.location.toString();
	if (url.includes('vk.com/topic-73721457_')) {
		try {
			posts = document.getElementsByClassName('bp_info');
			for (i = 0; i <= posts.length; i++) {
				if (
					posts[i]
						.getElementsByClassName('bp_author_wrap')[0]
						.getElementsByClassName('bp_author')[0]
						.href.toString() == urlmembro.toString()
				) {
					posts[i].innerHTML = 'MEMBRO BLOQUEADO POR SER MUITO RUIM';
					posts[i].style.textAlign = 'center';
					posts[i].style.fontWeight = 'bolder';
				}
			}
		} catch (error) {}
	} else {
	}
}, 500);
