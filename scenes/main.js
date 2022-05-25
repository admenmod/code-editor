'use strict';
Scene.create('main', function() {
	const { GridMap, MotionByTouch } = ns['system'];
	const { systemInfoDrawObject, screenSize, globalGridMap, motionByTouch } = ns['global'];
	const { KEYS, InputKeysHandler, Editor, Buffer, BufferRenderer } = ns['textinput'];
	

	let input1 = document.createElement('input');
	input1.style.position = 'fixed';
	input1.style.top = '-1000px';
	canvas.append(input1);


	const inputKeysHandler = new InputKeysHandler(input1);
	canvas.addEventListener('click', () => inputKeysHandler.focus());

	const editor = new Editor();
	const bufferRenderer = new BufferRenderer();
	const style = bufferRenderer.style;

	globalGridMap.isCoords = false;
	globalGridMap.offset.set(style.padding);
	globalGridMap.tile.set(style.fontWidth, style.fontSize + style.lineSpace);

	this.preload(fetch(`${location.origin}/user-code/main.js`)
		.then(data => data.text())
		.then(data => {
			editor.createBuffer(data);

			editor.on('inputChar', (...args) => bufferRenderer.emit('inputChar', ...args));
		}).then(() => {
			let buffer = editor.buffers[0];
			let caret = bufferRenderer.caret;

			let put = (line, index, value) => line.substr(0, index) + value + line.substr(index);
			let del = (line, index, size) => line.substr(0, index-size) + line.substr(index);

			inputKeysHandler.on('keydown', e => {
				console.log(e);
				// editor.inputChar(e.key, e.code);

				if(e.key === 'Control' || e.key === 'Alt' || e.ctrl || e.alt) {
					if(e.ctrl) {
						if(e.key === 'l') buffer.data = [''];
						if(e.key === 's') alert('saveing');
					};

					return;
				};


				if(e.key === 'Backspace') {
					buffer.data[caret.y] = del(buffer.data[caret.y] || '', caret.x, 1);
					
					caret.sub(1, 0);
				}
				else if(e.key === 'ArrowUp') caret.add(0, -1);
				else if(e.key === 'ArrowDown') caret.add(0, 1);
				else if(e.key === 'ArrowLeft') caret.add(-1, 0);
				else if(e.key === 'ArrowRight') caret.add(1, 0);
				else if(e.key.length < 2) {
					buffer.data[caret.y] = put(buffer.data[caret.y] || '', caret.x, e.data);
					caret.add(1, 0);
				};
			});
		})
	);

	// console.log(`Initialize scene "${this.name}"`);


	//========== Init ==========//
	this.init = () => {
		// console.log(`Scene: ${this.name}\nScreen size: ${screenSize.x}, ${screenSize.y}`);
	};


	//========== Update ==========//
	this.update = dt => {
		//========== pre process ==========//
		// motionByTouch.update(dt, touches, layers.main.camera);


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

