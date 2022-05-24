'use strict';
const {
	NameSpace, SymbolSpace,
	createPrivileges, random, JSONcopy,
	loader, loadImage, loadScript, generateImage,
	EventEmitter, Scene, Child,
	Vector2, vec2, VectorN, vecN,
	CameraImitationCanvas, CanvasLayer
} = globalThis.ver;


const canvas = document.querySelector('.canvas');
const layers = {};

for(let id in canvas.layers) {	
	layers[id] = new CameraImitationCanvas(canvas.layers[id].getContext('2d'));
};


const touches = new TouchesController(canvas);

const db = {}; // resures: [images, audios]
const ns = new NameSpace(); // namespaces


//========== Loading ==========//
let loading = (async () => {
	await loadScript('ns_objects/system.js');
	await loadScript('ns_objects/global.js');

	await loadScript('ns_objects/textinput.js');
	
	await loadScript('scenes/main.js');
})();

