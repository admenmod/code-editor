'use strict';
ns['editor.core'] = new function() {
	const modes = {
		NORMAL: 'normal',
		INSERT: 'insert'
	};


	// TODO: core -> editor -> render
	// let regSplitLine = /(.*?\n|\r)/;
	// let parseToLines = text => text.split(regSplitLine).filter(Boolean);

	let regSplitLine = '\n';
	let parseToLines = text => {
		if(text === '') return [''];

		let arr = text.split(regSplitLine);
		for(let i = 0; i < arr.length-1; i++) arr[i] += '\n';
		return arr.filter(Boolean);
	};


	const spliceString = (str = '', i, del = 0, ...values) => {
		if(del === 0) return [str.substring(0, i), ...values, str.substring(i)];
		if(del > 0) return [str.substring(0, i), ...values, str.substring(i + del)];
		if(del < 0) return [str.substring(0, i + del), ...values, str.substring(i)];
	};


	const Mark = this.Mark = class extends Vector2 {
		constructor(x, y, p = {}) {
			super(x, y);

			this.file = p.file || '';
		}
	};


	const Caret = this.Caret = class extends Mark {
		constructor(x, y) {
			super(x, y);
		}

		getCorrectPos(buffer) {
			let y = Math.max(0, Math.min(this.y, buffer.data.length - 1));
			let x = Math.max(0, Math.min(this.x, (buffer.data[y] || '').length - 1));
			return vec2(x, y);
		}
	};


	const Buffer = this.Buffer = class extends EventEmitter {
		constructor(text = '') {
			super();
			this.data = [''];
			
			this.marks = {
				"'": new Mark()
			};
			
			this.dataLines = [{
				length: 0,
				mark: []
			}];

			this.set(text);
		}

		set(text = '') {
			let lines = parseToLines(text);
			this.data = lines;
		}

		setMode(mode) {
			if([modes.NORMAL, modes.INSERT].includes(mode)) {
				this.mode = mode;
				return this.mode;
			};
		}

		joinString(line, count = 2) {
			let lines = this.data.slice(line, line+count+1).join('').replace('const', '00000')+'\n';
			let diff = this.data.splice(line-1, count, lines);
			return diff;
		}

		putChar(line, index, char) {
			this.data[line] = spliceString(this.data[line], index, 0, char).join('');
			return char;
		}

		put(line, index, text) {
			let lines = parseToLines(spliceString(this.data[line], index, 0, text).join(''));

			this.data.splice(line, 1, ...lines);
			return text;
		}

		delChar(line, index, size = -1) {
			let diff = this.data[line].substring(index + size, index);
			let arr = spliceString(this.data[line], index, size);

			if(index < 1 && line > 0) this.joinString(line);

			this.data[line] = arr.join('');
			return diff;
		}

		del(area) {
			let [qStart, qEnd] = spliceString(this.data[area.q.y], area.q.x, 1);
			let [pStart, pEnd] = spliceString(this.data[area.p.y], area.p.x, 1);

			let linesCount = area.p.y - area.q.y +1;

			let lines = this.data.slice(area.q.y, area.p.y+1);
			let diff = this.data.splice(area.q.y, linesCount, qStart+pEnd);

			return qEnd + diff.join('\n') + pStart;
		}
	};


	const Editor = this.Editor = class extends EventEmitter {
		constructor(p = {}) {
			super();

			this.buffers = new NameSpace();
			this.marks = new NameSpace();
			this.registers = new NameSpace();
		}

		addMark(id, mark) {
			this.marks[id] = mark;
			return this;
		}

		addRegister(id, register) {
			this.marks[id] = register;
			return this;
		}

		addBuffer(id, buffer) {
			this.buffers[id] = buffer;
			return this;
		}

		inputChar(data) {
			this.emit('inputChar', data);
		}
	};


	const EditProcess = this.EditProcess = class extends EventEmitter {
		constructor(p = {}) {
			super();
		}
	};
};

