'use strict';
class KeyboardInputInterceptor extends EventEmitter {
	constructor(input, p = {}) {
		super();
		this.input = input;
		
		let metakeys = ['Shift', 'Control', 'Alt', 'Meta'];
		let pressed = this.pressed = new NameSpace();


		let handler = e => {
			let data = {
				key: null,
				keyCode: null,
				data: null,
				inputType: null,
				shift: false, ctrl: false, alt: false, meta: false,
				pressed
			};


			if(metakeys.includes(e.key)) {
				return this.emit('metakey', e);
			};

			if(e.key === 'Unidentified' && e.keyCode === 229) {
				console.log(e.type);
				return this.emit('Unidentified', e);
			};

			if(e.type === 'keydown' || e.type === 'keyup') {
				data.key = data.data = e.key;
				data.keyCode = e.keyCode;

				console.log(e.key);
				if(e.type === 'keydown') pressed[e.key] = true;

				data.shift = e.shiftKey || pressed['Shift'] || false;
				data.ctrl = e.ctrlKey || pressed['Control'] || false;
				data.alt = e.altKey || pressed['Alt'] || false;
				data.meta = e.metaKey || pressed['Meta'] || false;
				
				if(e.type === 'keyup') pressed[e.key] = false;
			} else if(e.type === 'beforeinput') {
				data.data = e.data;
				data.key = data[0];
				data.inputType = e.inputType;
			};


			let args = [data, e];

			this.emit(e.type, ...args);
			
			if(e.type === 'beforeinput' && e.inputType === 'insertText') this.emit('input', ...args);
			if(e.type === 'keydown' || e.type === 'beforeinput') this.emit('keydown:input', ...args);
			if(e.type === 'keyup' || e.type === 'beforeinput') this.emit('keyup:input', ...args);
			
			this.emit('key:all', ...args);

			console.log(e.type, ...args);

			// prev = e;
		};


		let onevent = e => {
			if(p.preventDefault) e.preventDefault();
			handler(e);
		};

		this.init = (...args) => {
			input.addEventListener('keyup', onevent);
			input.addEventListener('keydown', onevent);
			input.addEventListener('beforeinput', onevent);
			this.emit('init', ...args);
		};

		this.destroy = (...args) => {
			input.removeEventListener('keyup', onevent);
			input.removeEventListener('keydown', onevent);
			input.removeEventListener('beforeinput', onevent);
			this.emit('destroy', ...args);
		}
	}

	blur() { return this.input.blur(); }
	focus() { return this.input.focus(); }
};

