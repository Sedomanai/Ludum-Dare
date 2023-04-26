var canvas = document.querySelector('#unity-canvas');
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

function onProgress(progress) {
	//console.log(100 * progress + "%");
	//progressBarFull.style.width = 100 * progress + "%";
}

let unityInstance = null;
function onSuccess(unity) {
	unityInstance = unity;
}

function onFailure(message) {
	alert(message);
}

var script = document.createElement('script');
script.src = loaderUrl;
script.onload = () => {
	createUnityInstance(canvas, config, onProgress).then(onSuccess).catch(onFailure);
};

document.body.appendChild(script);
