function generateRepliedHTML(replied) {
	if (replied.includes('bp')) {
		var id = replied.split(':')[0].split('[')[1];
		var name = replied.split('|')[1].split(']')[0];
		var bp = replied.split(':')[1].split('|')[0];
		var final =
			'<a href="/' +
			id +
			'" class="mem_link" mention="' +
			bp +
			'" mention_id="' +
			id +
			'" onclick="return mentionClick(this, event)" onmouseover="Board.mentionOver(this)">' +
			name +
			'</a>';
	} else {
		var id = replied.split('|')[0].split('[')[0];
		var name = replied.split('|')[1].split(']')[0];
		var final =
			'<a href="/' +
			id +
			'" class="mem_link" mention="" mention_id="' +
			id +
			'" onclick="return mentionClick(this, event)" onmouseover="Board.mentionOver(this)">' +
			name +
			'</a>';
	}

	return final;
}

function generateImageHTML(attachment, postid, cmmid) {
	if (attachment.type == 'photo') {
		var html = '<br><img src="' + attachment.photo.photo_604 + '"/>';
		return html;
	} else if (attachment.type == 'video') {
		var html =
			'<a href="/' +
			attachment.video.track_code +
			'" data-video="290219094_456239091" data-list="3ef185fb7bf037b711" data-duration="46" aria-label="' +
			attachment.video.title +
			'" onclick="return showInlineVideo("290219094_456239091", "' +
			attachment.video.access_key +
			'", {"autoplay":1,"has_restriction":0,"addParams":{"post_id":"-' +
			cmmid +
			'topic_' +
			postid +
			'"},"module":null}, event, this);" style="width: 490px; height: 276px;background-image: url(' +
			attachment.video.photo_800 +
			');" class="page_post_thumb_wrap image_cover  page_post_thuideo.mb_video page_post_thumb_last_column page_post_thumb_last_row"><div class="page_post_video_play_inline"></div><div class="video_thumb_label"><span class="video_thumb_label_item">' +
			attachment.video.platform +
			'</span><span class="video_thumb_label_item">0:46</span></div></a>';

		return html;
	} else {
		return '';
	}
}

function generatePopularHTML(cmmid, tid, post, profile) {
	var texto = post.text.replace(new RegExp('\r?\n', 'g'), '<br />');
	var listofreplies = texto.match(/\[.+?\]/g);

	if (Symbol.iterator in Object(listofreplies)) {
		for (replie of listofreplies) {
			texto = texto.replace(replie, generateRepliedHTML(replie));
		}
	}

	if (post.attachments != undefined) {
		for (attachment of post.attachments) {
			texto = texto + generateImageHTML(attachment, post.id, cmmid);
		}
	}

	var html =
		'<div class="bp_post clear_fix " id="post-' +
		cmmid +
		'_' +
		post.id +
		'">' +
		'  <a class="bp_thumb _online" href="/' +
		profile.screen_name +
		'" aria-label="' +
		profile.first_name +
		' ' +
		profile.last_name +
		' online do celular">' +
		'    <img class="bp_img" src="' +
		profile.photo_50 +
		'" data-alt="' +
		profile.first_name +
		' ' +
		profile.last_name +
		'">' +
		'  </a>' +
		'  <div class="bp_info">' +
		'    <div class="bp_author_wrap">' +
		'      <div class="bp_actions"><a href="#" id="bp_delete' +
		post.id +
		'" class="bp_delete_button bp_action fl_r" onclick="return Board.reportPost(this, ' +
		post.id +
		')" onmouseover="showTooltip(this, {text: "Denunciar Spam", black: 1, needLeft: true, shift: [13, 6, 6]});" aria-label="Denunciar Spam"></a></div>' +
		'      <a class="bp_author" href="/' +
		profile.screen_name +
		'">' +
		profile.first_name +
		' ' +
		profile.last_name +
		'</a>' +
		'      <a class="bp_date" href="/topic-' +
		cmmid +
		'_' +
		tid +
		'?post=' +
		post.id +
		'" dir="auto">Popular</a>' +
		'      <span class="bp_topic"></span>' +
		'    </div>' +
		'    <div class="bp_content" id="bp_data-' +
		cmmid +
		'_' +
		tid +
		'"><div class="bp_text markdown-body"><p>' +
		texto +
		'</p>' +
		'</div><div></div></div>' +
		'    <div class="bp_edited_by"></div>' +
		'    <div class="bp_bottom clear_fix">' +
		'      <div class="like_wrap _like_topic_comment-' +
		cmmid +
		'_' +
		post.id +
		'  lite">' +
		'  <div class="like_cont ">' +
		'    <div class="like_btns">' +
		'      <a class="like_btn like _like" onclick="Likes.toggle(this, event, \'topic_comment-' +
		cmmid +
		'_' +
		post.id +
		"', '0a8a3a77cfa684efa9');\" onmouseover=\"Likes.showLikes(this, 'topic_comment-" +
		cmmid +
		'_' +
		post.id +
		'\', {})" data-count="' +
		post.likes.count +
		'" href="#" title="Curtir">' +
		'  <div class="like_button_icon"></div>' +
		'  <div class="like_button_label"></div>' +
		'  <div class="like_button_count">' +
		post.likes.count +
		'</div>' +
		'  <span class="blind_label">Curtir</span>' +
		'</a>' +
		'<span class="blind_label" tabindex="0" role="link" onclick="Likes.showLikesList(this, \'topic_comment-' +
		cmmid +
		'_' +
		post.id +
		'\')">Mostrar curtidas</span>' +
		'      ' +
		'    </div>' +
		'    <div class="like_views _views" onmouseover="Likes.updateViews(\'topic_comment-' +
		cmmid +
		'_' +
		post.id +
		'\');"></div>' +
		'    ' +
		'  </div>' +
		'</div>' +
		'    </div>' +
		'  </div>' +
		'  <div class="bp_deleted_text"></div>' +
		'</div>';

	return html;
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	divai = document.getElementById('divai');
	var html = generatePopularHTML(request.cmmid, request.tid, request.highest, request.profile);
	divai.innerHTML = html;
	divai.style.background = '#ced8d9';
	divai.style.margin = '-0.5em';
	divai.style.paddingLeft = '1em';
	divai.style.paddingRight = '1em';
});

setInterval(function() {
	url = document.location.toString();
	if (url.includes('vk.com/topic-') && document.getElementById('divai') == undefined) {
		try {
			// Create a new element
			var newNode = document.createElement('div');
			newNode.id = 'divai';
			var referenceNode = document.getElementsByClassName('bp_post clear_fix ')[0];
			referenceNode.after(newNode);

			if (url.includes('?offset=')) {
				if (document.location.toString().split('-')[1].split('_')[1].split('?')[1].split('=')[1] === '0') {
					var cmmid = document.location.toString().split('-')[1].split('_')[0];
					var topicid = document.location.toString().split('-')[1].split('_')[1].split('?')[0];
					chrome.runtime.sendMessage({ cmmid: cmmid, tid: topicid }, function(response) {
						console.log(response.farewell);
					});
				}
			} else {
				if (url.includes('?post=')) {
					if (document.querySelector('#bt_pages > a.pg_lnk_sel.fl_l > div').innerText === '1') {
						var cmmid = document.location.toString().split('-')[1].split('_')[0];
						var topicid = document.location.toString().split('-')[1].split('_')[1].split('?')[0];
						chrome.runtime.sendMessage({ cmmid: cmmid, tid: topicid }, function(response) {
							console.log(response.farewell);
						});
					}
				} else {
					var cmmid = document.location.toString().split('-')[1].split('_')[0];
					var topicid = document.location.toString().split('-')[1].split('_')[1];
					chrome.runtime.sendMessage({ cmmid: cmmid, tid: topicid }, function(response) {
						console.log(response.farewell);
					});
				}
			}
		} catch (error) {}
	} else {
	}
}, 100);
