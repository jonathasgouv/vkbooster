let accesskey;

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

async function getHighest(cmmid, tid, offset) {
	var urlfetch =
		'https://api.vk.com/method/board.getComments?group_id=' +
		cmmid +
		'&topic_id=' +
		tid +
		'&need_likes=1&count=100&extended=1&offset=' +
		offset +
		'&access_token=' +
		accesskey.toString() +
		'&v=5.52';

	let response = await fetch(urlfetch);
	let data = await response.json();
	return data;
}

function getHighestAllTWO(cmmid, tid) {
	postsa = [];
	profilesa = [];

	getHighest(cmmid, tid, 0).then(function(data) {
		rawdata = data.response.items;
		profiles = data.response.profiles;

		postsa.push(rawdata);
		profilesa.push(profiles);
		if (rawdata.length == 100) {
			getHighest(cmmid, tid, 100).then(function(data) {
				rawdata = data.response.items;
				profiles = data.response.profiles;
				postsa.push(rawdata);
				profilesa.push(profiles);
				if (rawdata.length == 100) {
					getHighest(cmmid, tid, 200).then(function(data) {
						rawdata = data.response.items;
						profiles = data.response.profiles;
						postsa.push(rawdata);
						profilesa.push(profiles);
						if (rawdata.length == 100) {
							getHighest(cmmid, tid, 300).then(function(data) {
								rawdata = data.response.items;
								profiles = data.response.profiles;
								postsa.push(rawdata);
								profilesa.push(profiles);
								if (rawdata.length == 100) {
									getHighest(cmmid, tid, 400).then(function(data) {
										rawdata = data.response.items;
										profiles = data.response.profiles;
										postsa.push(rawdata);
										profilesa.push(profiles);
										if ((rawdata.lenght = 100)) {
											var highest = postsa.flat().sort(function(a, b) {
												return b.likes.count - a.likes.count;
											})[0];
											var profile = profilesa.flat().filter((obj) => {
												return obj.id === highest.from_id;
											})[0];
											if (highest.likes.count > 0) {
												chrome.tabs.query({ active: true, currentWindow: true }, function(
													tabs
												) {
													chrome.tabs.sendMessage(
														tabs[0].id,
														{ cmmid: cmmid, tid: tid, highest: highest, profile: profile },
														function(response) {}
													);
												});
											}
										} else {
											var highest = postsa.flat().sort(function(a, b) {
												return b.likes.count - a.likes.count;
											})[0];
											var profile = profilesa.flat().filter((obj) => {
												return obj.id === highest.from_id;
											})[0];
											if (highest.likes.count > 0) {
												chrome.tabs.query({ active: true, currentWindow: true }, function(
													tabs
												) {
													chrome.tabs.sendMessage(
														tabs[0].id,
														{ cmmid: cmmid, tid: tid, highest: highest, profile: profile },
														function(response) {}
													);
												});
											}
										}
									});
								} else {
									var highest = postsa.flat().sort(function(a, b) {
										return b.likes.count - a.likes.count;
									})[0];
									var profile = profilesa.flat().filter((obj) => {
										return obj.id === highest.from_id;
									})[0];
									if (highest.likes.count > 0) {
										chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
											chrome.tabs.sendMessage(
												tabs[0].id,
												{ cmmid: cmmid, tid: tid, highest: highest, profile: profile },
												function(response) {}
											);
										});
									}
								}
							});
						} else {
							var highest = postsa.flat().sort(function(a, b) {
								return b.likes.count - a.likes.count;
							})[0];
							var profile = profilesa.flat().filter((obj) => {
								return obj.id === highest.from_id;
							})[0];
							if (highest.likes.count > 0) {
								chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
									chrome.tabs.sendMessage(
										tabs[0].id,
										{ cmmid: cmmid, tid: tid, highest: highest, profile: profile },
										function(response) {}
									);
								});
							}
						}
					});
				} else {
					var highest = postsa.flat().sort(function(a, b) {
						return b.likes.count - a.likes.count;
					})[0];
					profile = profilesa.flat().filter((obj) => {
						return obj.id === highest.from_id;
					})[0];
					if (highest.likes.count > 0) {
						chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
							chrome.tabs.sendMessage(
								tabs[0].id,
								{ cmmid: cmmid, tid: tid, highest: highest, profile: profile },
								function(response) {}
							);
						});
					}
				}
			});
		} else {
			var highest = postsa.flat().sort(function(a, b) {
				return b.likes.count - a.likes.count;
			})[0];
			profile = profilesa.flat().filter((obj) => {
				return obj.id === highest.from_id;
			})[0];
			if (highest.likes.count > 0) {
				chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
					chrome.tabs.sendMessage(
						tabs[0].id,
						{ cmmid: cmmid, tid: tid, highest: highest, profile: profile },
						function(response) {}
					);
				});
			}
		}
	});
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	getHighestAllTWO(request.cmmid, request.tid);
});

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

				accesskey = response.access_token;
				chrome.storage.sync.set({ AccessKey: response.access_token }, function() {});
			}
		});
	});
};

getAccessToken();
