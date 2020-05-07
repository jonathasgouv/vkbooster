document.getElementById('salvar').addEventListener('click', function() {
	if (document.getElementById('minlikes').value != '') {
		likes = parseInt(document.getElementById('minlikes').value);
		chrome.storage.sync.set({ MinLikes: likes }, function() {});
		if (document.getElementById('criador').checked == true) {
			chrome.storage.sync.set({ DShowFirst: true }, function() {});
		} else {
			chrome.storage.sync.set({ DShowFirst: false }, function() {});
		}
		alert('Salvo com sucesso');
	} else {
		alert('Preencha o número mínimo de likes');
	}
});
