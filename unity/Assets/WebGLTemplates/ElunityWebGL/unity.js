var canvas = document.querySelector("#unity-canvas")
var buildUrl = "/static/{route}/Build";
var loaderUrl = buildUrl + "/{{{ LOADER_FILENAME }}}";
var config = {
  dataUrl: buildUrl + "/{{{ DATA_FILENAME }}}",
  frameworkUrl: buildUrl + "/{{{ FRAMEWORK_FILENAME }}}",
#if USE_WASM
	codeUrl: buildUrl + "/{{{ CODE_FILENAME }}}",
#endif
#if MEMORY_FILENAME
	memoryUrl: buildUrl + "/{{{ MEMORY_FILENAME }}}",
#endif
#if SYMBOLS_FILENAME
	symbolsUrl: buildUrl + "/{{{ SYMBOLS_FILENAME }}}",
#endif
  streamingAssetsUrl: "/{{{ CODE_FILENAME }}}",
  companyName: "Elang",
  productName: "[WebGL Project]",
  productVersion: "1.0"
}

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

var script = document.createElement("script");
script.src = loaderUrl;
script.onload = () => {
  createUnityInstance(canvas, config, onProgress)
    .then(onSuccess)
    .catch(onFailure);
}

document.body.appendChild(script);