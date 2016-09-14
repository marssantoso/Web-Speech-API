document.addEventListener('DOMContentLoaded', function() {
	var result = '';
	if (!('webkitSpeechRecognition' in window)){
		showInfo('er_upgrade');
	} else {
		var recognition = new webkitSpeechRecognition();
		recognition.continuous = false;
		recognition.interimResults = false;
		recognition.maxAlternatives = 1;
		showInfo('info_start');

		button.onclick = function() {
			recognition.start();
		}

		recognition.onstart = function() {
			showInfo('info_active');
		}

		recognition.onresult = function(event) {
			var text = event.results[0][0].transcript;
			var result = document.getElementById('result');
			console.log('RECOGNIZED TEXT: ' + text);
			result.innerHTML = text;
		}

		recognition.onerror = function(event) {
			console.log('ERROR: ' + event.error)
			if (event.error == 'no-speech') {
				showInfo('er_nospeech');
			}
			if (event.error == 'aborted') {
				showInfo('er_aborted');
			}
			if (event.error == 'audio-capture') {
				showInfo('er_nomic');
			}
			if (event.error == 'network') {
				showInfo('er_network');
			}
			if (event.error == 'not-allowed') {
				showInfo('er_notallowed');
			}
			if (event.error == 'service-not-allowed') {
				showInfo('er_noservice');
			}
		}

		recognition.onend = function() {
			recognition.stop();
		}

		function showInfo(state) {
			if(state) {
				for (var child = info.firstChild; child; child = child.nextSibling) {
					if (child.style) {
						child.style.display = child.id == state ? 'inline' : 'none';
					}
				}
				info.style.visibility = 'visible';
			} else {
				info.style.visibility = 'hidden';
			}
		}
	}
});