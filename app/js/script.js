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
			console.log('STATUS: listening...');
		}

		recognition.onresult = function(event) {
			var recognizedText = event.results[0][0].transcript;
			var result = document.getElementById('result');
			//result.innerHTML = recognizedText;
			showInfo('info_start');
			chrome.storage.local.set({output: recognizedText}, function() {
				console.log('STATUS: result saved');
			});
			chrome.storage.local.get('output', function(data) {
				console.log('RESULT: ' + data.output);
			});
			execute(recognizedText);
		}

		recognition.onerror = function(event) {
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
			console.log('ERROR: ' + event.error);
		}

		recognition.onend = function() {
			recognition.stop();
			console.log('STATUS: stopped');
		}
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

	function execute(text) {
		var result = document.getElementById('result');
		result.innerHTML = '<p>RECOGNIZED TEXT: ' + text + '</p>';
		if(text === 'open Terminal') {
			chrome.runtime.connectNative('terminal');
			var p = document.createElement('p');
			var i = document.createTextNode('STATUS: Opening terminal');
			p.appendChild(i);
			result.appendChild(p);
			//console.log("STATUS: opening terminal");
		}
		if(text === 'what time is it') {
			var date = new Date();
			var hour = date.getHours();
			var minute = date.getMinutes();
			var period;
			if (hour > 12) {
				hour -= 12;
				period = 'PM';
			} else {
				period = 'AM';
			}
			var p = document.createElement('p');
			var i = document.createTextNode("STATUS: It's now " + hour + ":" + minute + " " + period);
			p.appendChild(i);
			result.appendChild(p);
			//console.log("STATUS: it's now", hour + ":" + minute, period);
		}
	}
});