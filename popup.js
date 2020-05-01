window.resizeBy(800, 600);

function isValid() {
	if (document.getElementById('url').value != '' && document.getElementById('texto').value != '') {
		return true;
	} else {
		return false;
	}
}

document.getElementById('salvar').addEventListener('click', function() {
	if (isValid()) {
		data = [
			document.getElementById('url').value,
			document.getElementById('texto').value
		];

		chrome.storage.sync.set({ key: data }, function() {
			alert('Salvo com sucesso');
		});
	} else {
		alert('Preencha todas as informações necessárias!');
	}
});
