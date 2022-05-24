'use strict';
Scene.create('main', function() {
	const { GridMap, MotionByTouch } = ns['system'];
	const { systemInfoDrawObject, screenSize, globalGridMap, motionByTouch } = ns['global'];
	const { Editor, Buffer, drawBuffer } = ns['textinput'];


	let editor = new Editor();

	editor.createBuffer('ksksms\noeowk');
	editor.inputChar(':');

	console.log(editor);
	editor.log();


	console.log(`Initialize scene "${this.name}"`);


	//========== Init ==========//
	this.init = () => {
		console.log(`Scene: ${this.name}\nScreen size: ${screenSize.x}, ${screenSize.y}`);
	};


	//========== Update ==========//
	this.update = dt => {
		motionByTouch.update(dt, touches, layers.main.camera);

		layers.main.ctx.clearRect(0, 0, screenSize.x, screenSize.y);

		globalGridMap.draw(layers.main.ctx, layers.main.camera);

		drawBuffer(editor.buffers[0], layers.main, vec2(100, 100));

		systemInfoDrawObject.update(dt);
		systemInfoDrawObject.draw(layers.main.ctx);
	};


	//========== Exit ==========//
	this.exit = () => {
		console.log(this.name, 'exit');
	};
});

