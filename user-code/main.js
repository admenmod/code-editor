'use strict';
Scene.create('main', function() {
	const { GridMap, MotionByTouch } = ns['system'];
	const { systemInfoDrawObject, screenSize, globalGridMap, motionByTouch } = ns['global'];
	const { KEYS, Editor, Buffer, BufferRenderer, drawBuffer } = ns['textinput'];

	
	globalGridMap.isCoords = false;
	globalGridMap.offset.set(10, 10);
	globalGridMap.tile.set(9, 15+3);


	let editor = new Editor();
	let bufferRenderer = new BufferRenderer();

	this.preload(fetch(`${location.origin}/user-code/main.js`)
		.then(data => data.text())
		.then(data => {
			console.log(data);

			editor.createBuffer(data);
			editor.inputChar(':');

			editor.on('inputChar', (...args) => bufferRenderer.emit('inputChar', ...args));

			setInterval(() => editor.inputChar('v', KEYS.ARROW_LEFT), 1000);


			editor.log();
			console.log(editor);
		})
	);

	console.log(`Initialize scene "${this.name}"`);


	//========== Init ==========//
	this.init = () => {
		console.log(`Scene: ${this.name}\nScreen size: ${screenSize.x}, ${screenSize.y}`);
	};


	//========== Update ==========//
	this.update = dt => {
	//========== pre process ==========//
	//	motionByTouch.update(dt, touches, layers.main.camera);


	//========== process ==========//
		

	//========== render ==========//
		layers.main.ctx.clearRect(0, 0, screenSize.x, screenSize.y);

		globalGridMap.draw(layers.main.ctx, layers.main.camera);


		bufferRenderer.drawBuffer(editor.buffers[0], layers.main);


		// systemInfoDrawObject.update(dt);
		// systemInfoDrawObject.draw(layers.main.ctx);
	};


	//========== Exit ==========//
	this.exit = () => {
		console.log(this.name, 'exit');
	};
});

