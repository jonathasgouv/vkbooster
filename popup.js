window.resizeBy(800, 600);
urlmembro = '';
texto = '';

function isValid() {
	if (document.getElementById('url').value != '' && document.getElementById('texto').value != '') {
		return true;
	} else {
		return false;
	}
}

document.getElementById('salvar').addEventListener('click', function() {
	if (isValid()) {
		var url = document.getElementById('url').value;
		var texto = document.getElementById('texto').value;

		chrome.storage.sync.set({ Url: url }, function() {});
		chrome.storage.sync.set({ Texto: texto }, function() {});
		alert('Salvo com sucesso');
	} else {
		alert('Preencha todas as informações necessárias!');
	}
});

document.getElementById('config').addEventListener('click', function() {
	chrome.runtime.openOptionsPage();
});
