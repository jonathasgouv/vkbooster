function reloadMainTab() {
	chrome.tabs.reload();
}

chrome.storage.onChanged.addListener(function(changes, namespace) {
	reloadMainTab();
});

var objectToParam = function(obj) {
	var str = '';
	for (var key in obj) {
		if (str !== '') {
			str += '&';
		}
		str += key + '=' + encodeURIComponent(obj[key]);
	}

	return str;
};

var paramToObject = function(param) {
	return param.split('&').reduce(function(prev, curr) {
		var p = curr.split('=');
		prev[decodeURIComponent(p[0])] = decodeURIComponent(p[1]);
		return prev;
	}, {});
};

var getAccessToken = function() {
	var redirectUri = 'https://oauth.vk.com/blank.html';
	var redirectMatch = /^https:\/\/oauth.vk.com\/blank.html#(.*)$/i;

	var options = {
		client_id     : 4444599,
		scope         : 'photos,groups,offline',
		redirect_uri  : redirectUri,
		display       : 'popup',
		v             : 5.53,
		response_type : 'token'
	};

	var url = 'https://oauth.vk.com/authorize?' + objectToParam(options);

	chrome.tabs.create({ url: url }, function() {
		chrome.tabs.onUpdated.addListener(function(tabId, changeInfo) {
			console.log(tabId, changeInfo);
			if (changeInfo.url && redirectMatch.test(changeInfo.url)) {
				var matches = changeInfo.url.match(redirectMatch);

				if (!matches || typeof matches[1] === 'undefined') {
					return false;
				}

				chrome.tabs.remove(tabId);

				var response = paramToObject(matches[1]);
				if (!response.access_token) {
					return false;
				}

				console.log(response.access_token);
				chrome.storage.sync.set({ AccessKey: response.access_token }, function() {});
			}
		});
	});
};

getAccessToken();
