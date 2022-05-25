'use strict';
ns['textinput'] = new function() {
	// const KEYS = this.KEYS = {
	// 	FUNCTION_KEYS: {
	// 		LEFT: 'ArrowLeft',
	// 		UP: 'ArrowUp',
	// 		RIGHT: 'ArrowRight',
	// 		DOWN: 'ArrowDown',
	// 		BACKSPACE: 'Backspace'
	// 	}
	// };


	const MAIN_REGISTER = '"';


	const InputKeysHandler = this.InputKeysHandler = class extends EventEmitter {
		constructor(input) {
			super();
			this.input = input;

			let handler = e => {
				let type = e.type;
				let key = null, code = null, data = null, inputType = null;
				let shift = false, ctrl = false, alt = false;

				if(type === 'keydown') {
					key = data = e.key;
					code = e.keyCode;

					shift = e.shiftKey;
					ctrl = e.ctrlKey;
					alt = e.altKey;
				} else if(type === 'beforeinput') {
					data = e.data;
					key = data[0];
					code = String.prototype.codePointAt.call(key, 0);
					inputType = e.inputType;
					if(String.prototype.toUpperCase.call(key) === key) shift = true;
				};


				let keys = { type, key, code, inputType, data, shift, ctrl, alt };
				this.emit('keydown', keys);
			};


			input.addEventListener('keydown', e => {
				e.preventDefault();

				if(e.key === 'Unidentified' && e.keyCode === 229) return;

				handler(e);
			});

			input.addEventListener('beforeinput', e => {
				e.preventDefault();

				handler(e);
			});
		}

		blur() { return this.input.blur(); }
		focus() { return this.input.focus(); }
	};


	const Editor = this.Editor = class extends EventEmitter {
		constructor(p = {}) {
			super();

			this.buffers = [];
			this.registers = new NameSpace();
		}

		createBuffer(text = '') {
			this.buffers.push(new Buffer({ text }));
		}

		inputChar(data) {
			// console.log(`inputChar: [${data.key}](${data.code})`);

			this.emit('inputChar', data);
		}

		log() {
			// console.log(this.registers);
		}
	};

	// TODO: core -> editor -> render
	const Buffer = this.Buffer = class extends EventEmitter {
		constructor(p = {}) {
			super();

			let text = p.text;
			let data = [''];

			let lines = text.split(/\n|\r/);
			// console.log(lines);

			for(let i = 0; i < lines.length; i++) {
				data[i] = lines[i];
			};

			this.data = data;
		}
	};


	const BufferRenderer = this.BufferRenderer = class extends EventEmitter {
		constructor(p = {}) {
			super();

			this.style = {};

			this.style.padding = (p.padding || vec2()).buf();
			this.style.fontSize = p.fontSize || 15;
			this.style.fontWidth = p.fontWidth || 9;
			this.style.lineSpace = p.lineSpace || 2;
			this.style.fontFamily = p.fontFamily || 'monospace';


			this.pos = (p.pos || vec2()).buf();

			this.caret = vec2();
		}

		get offset() { return this.pos.buf().add(this.style.padding); }
		get shift() { return this.style.fontSize + this.style.lineSpace; }

		drawCaret(ctx) {
			let { offset, shift } = this;
			let style = this.style;
 
			let pos = this.caret.buf().inc(style.fontWidth, shift).add(offset);

			ctx.globalCompositeOperation = 'xor';

			ctx.fillStyle = '#ffffff';
			ctx.fillRect(pos.x, pos.y, style.fontWidth, style.fontSize + style.lineSpace);
		}

		drawBuffer(buffer, ctx) {
			let data = buffer.data;
			let style = this.style;

			ctx.textAlign = 'left';
			ctx.textBaseline = 'middle'
			ctx.font = `${style.fontSize}px/${style.lineSpace}px ${style.fontFamily}`;

			let { offset, shift } = this;

			for(let i = 0; i < data.length; i++) {
				ctx.fillStyle = '#eeeeee';
				ctx.fillText(data[i], offset.x, Math.round(style.fontSize/2) + offset.y + i*shift);
			};


			this.drawCaret(ctx);
		}
	};



	// let tt = ':';
	// console.log(tt.charCodeAt(0));
	// console.log(String.fromCodePoint(tt.codePointAt(0)));
};

