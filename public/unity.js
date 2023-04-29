var game = document.querySelector('#game-container');
var canvas = document.querySelector('#game-container canvas');
var playButton = document.querySelector('#button-container svg');
var loader = document.querySelector('#loader');
var path = document.querySelector('#icon');

var buildUrl = '/static/Build';
var loaderUrl = buildUrl + '/public.loader.js';
var config = {
	dataUrl: buildUrl + '/public.data',
	frameworkUrl: buildUrl + '/public.framework.js',
	codeUrl: buildUrl + '/public.wasm',
	streamingAssetsUrl: '/public.wasm',
	companyName: 'Elang',
	productName: '[WebGL Project]',
	productVersion: '1.0',
};

playButton.addEventListener('mouseenter', function () {
	path.style.fill = 'gray';
});
playButton.addEventListener('mouseleave', function () {
	path.style.fill = 'aliceblue';
});

function onProgress(progress) {
	loader.firstChild.textContent = Math.round(progress * 100) + '%';
}

let unityInstance = null;
function onSuccess(unity) {
	game.style.display = 'block';
	unityInstance = unity;
}

function onFailure(message) {
	alert(message);
}

playButton.addEventListener('click', function () {
	playButton.style.display = 'none';
	loader.style.display = 'flex';
	var script = document.createElement('script');
	script.src = loaderUrl;
	script.onload = () => {
		createUnityInstance(canvas, config, onProgress).then(onSuccess).catch(onFailure);
	};
	document.body.appendChild(script);
});
