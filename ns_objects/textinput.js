'use strict';
ns['textinput'] = new function() {
	const MAIN_REGISTER = '"';


	const Editor = this.Editor = class extends EventEmitter {
		constructor(p = {}) {
			super();

			this.buffers = [];
			this.registers = new NameSpace();
		}

		createBuffer(text) {
			this.buffers.push(new Buffer({ text }));
		}

		inputChar(char) {
			let tt = ':';
			console.log(tt.charCodeAt(0));
			console.log(String.fromCodePoint(tt.codePointAt(0)));

			this.registers[MAIN_REGISTER] = String.prototype.codePointAt.call(char, 0);
			this.emit('inputChar', this.registers[MAIN_REGISTER]);
		}

		log() {
			console.log(this.registers);
		}
	};


	const Buffer = this.Buffer = class extends EventEmitter {
		constructor(p = {}) {
			super();

			let text = p.text;
			let data = [''];

			let lines = text.split(/\n|\r/);
			console.log(lines);

			for(let i = 0; i < lines.length; i++) {
				data[i] = lines[i];
			};

			this.data = data;
		}
	};

	

	let fontSize = 15;
	let lineSpace = 3;
	let fontFamily = 'monospace'

	let drawBuffer = this.drawBuffer = (buffer, ctx, pos) => {
		let data = buffer.data;

		ctx.font = `${fontSize}px/${lineSpace}px ${fontFamily}`;

		for(let i = 0; i < data.length; i++) {
			ctx.fillStyle = '#eeeeee';
			ctx.fillText(data[i], pos.x, pos.y + i * (fontSize+lineSpace));
		};
	};
};

