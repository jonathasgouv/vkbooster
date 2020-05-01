function reloadMainTab() {
	chrome.tabs.reload();
}

chrome.storage.onChanged.addListener(function(changes, namespace) {
	reloadMainTab();
});
