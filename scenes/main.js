'use strict';
Scene.create('main', function() {
	const { GridMap, MotionByTouch } = ns['system'];
	const { systemInfoDrawObject, screenSize, globalGridMap, motionByTouch } = ns['global'];
	const { Editor, Buffer, Mark, Caret } = ns['editor.core'];
	const { Style, BufferRenderer } = ns['editor.render'];


	let input1 = document.createElement('input');
	input1.style.position = 'fixed';
	input1.style.top = '-1000px';
	canvas.append(input1);



	const keyboardInputInterceptor = new KeyboardInputInterceptor(input1);
	keyboardInputInterceptor.init();
	canvas.addEventListener('click', () => keyboardInputInterceptor.focus());

	const style = new Style({
		color: '#77ee77'
	});

	let caret = new Caret();
	const editor = new Editor();
	const bufferRenderer = new BufferRenderer({ style });

	globalGridMap.isCoords = false;
	globalGridMap.offset.set(style.padding);
	globalGridMap.tile.set(style.fontWidth, style.fontSize + style.lineSpace);

	this.preload(fetch(`${location.origin}/user-code/main.js`)
		.then(data => data.text())
		.then(data => {
			editor.addBuffer(0, new Buffer(data));

			editor.on('inputChar', (...args) => bufferRenderer.emit('inputChar', ...args));
		}).then(() => {
			let buffer = editor.buffers[0];


			keyboardInputInterceptor.on('keydown', e => {
				console.log();

				if(e.key === 'Control' || e.key === 'Alt' || e.key === 'Shift' || e.ctrl || e.alt) {
					if(e.ctrl) {
						if(e.key === 'l') buffer.set('');
						if(e.key === 's') alert('saveing');
					};

					return;
				};


				if(e.key === 'ArrowUp') {
					caret.y = caret.getCorrectPos(buffer).y;
					caret.y += -1;
					caret.y = caret.getCorrectPos(buffer).y;
				} else if(e.key === 'ArrowDown') {
					caret.y = caret.getCorrectPos(buffer).y;
					caret.y += 1;
					caret.y = caret.getCorrectPos(buffer).y;
				} else if(e.key === 'ArrowLeft') {
					caret.x = caret.getCorrectPos(buffer).x;
					caret.x += -1;
					caret.x = caret.getCorrectPos(buffer).x;
				} else if(e.key === 'ArrowRight') {
					caret.x = caret.getCorrectPos(buffer).x;
					caret.x += 1;
					caret.x = caret.getCorrectPos(buffer).x;
				} else if(e.key === 'Enter') {
					buffer.put(caret.y, caret.x, '\n');
					caret.y += 1;
					caret.x = 0;
				} else if(e.key === 'Escape') {
					keyboardInputInterceptor.blur();
				} else if(e.key === 'Backspace') {
					// let area = new Area(caret.buf());
					// Vector2.prototype.set.call(area, caret);

					buffer.delChar(caret.y, caret.x, -1);

					caret.x -= 1;
					caret.x = caret.getCorrectPos(buffer).x;
				};
			});

			keyboardInputInterceptor.on('input', e => {
				buffer.putChar(caret.y, caret.x, e.data);
				caret.add(1, 0);
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
		motionByTouch.update(dt, touches, layers.main.camera);


		//========== process ==========//


		//========== render ==========//
		layers.main.ctx.clearRect(0, 0, screenSize.x, screenSize.y);

		globalGridMap.draw(layers.main.ctx, layers.main.camera);


		bufferRenderer.drawBuffer(layers.main, editor.buffers[0], caret);


		// systemInfoDrawObject.update(dt);
		// systemInfoDrawObject.draw(layers.main.ctx);
	};


	//========== Exit ==========//
	this.exit = () => {
		console.log(this.name, 'exit');
	};
});

