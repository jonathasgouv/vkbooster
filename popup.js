window.resizeBy(800, 600);

document.getElementById('salvar').addEventListener('click', function() {
	chrome.storage.sync.set({ key: document.getElementById('url').value }, function() {
		alert('Salvo com sucesso');
	});
});
