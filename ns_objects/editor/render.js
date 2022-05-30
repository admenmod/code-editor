'use strict';
ns['editor.render'] = new function() {
	const { Node, Spatial, Sprite } = ns['nodes'];
	const { Buffer, Caret } = ns['editor.core'];


	const Style = this.Style = class {
		constructor(p = {}) {
			this.padding = (p.padding || vec2()).buf();
			this.color = p.color || '#eeeeee';
			this.fontSize = p.fontSize || 15;
			this.fontWidth = p.fontWidth || 9;
			this.lineSpace = p.lineSpace || 2;
			this.fontFamily = p.fontFamily || 'monospace';
		}
	};

	
	const Panel = this.Panel = class extends Spatial {
		constructor(p = {}) {
			super(p);

			this.style = p.style || new Style();
		}
	};


	const BuffersViewer = this.BuffersViewer = class extends Panel {
		constructor(buffers, p = {}) {
			super(p);

			this.buffer = buffer;
		}
	};


	const BufferRenderer = this.BufferRenderer = class extends Panel {
		constructor(buffer, p = {}) {
			super(p);

			this.style = p.style || new Style();
		}

		get offset() { return this.pos.buf().add(this.style.padding); }
		get shift() { return this.style.fontSize + this.style.lineSpace; }

		drawCaret(ctx, buffer, caret) {
			let { offset, shift } = this;
			let style = this.style;
 
			let pos = caret.getCorrectPos(buffer).inc(style.fontWidth, shift).add(offset);

			ctx.globalCompositeOperation = 'xor';

			ctx.fillStyle = '#ffffff';
			ctx.fillRect(pos.x, pos.y, style.fontWidth/10, style.fontSize + style.lineSpace);
		}

		drawBuffer(ctx, buffer, caret) {
			let data = buffer.data;
			let style = this.style;

			ctx.textAlign = 'left';
			ctx.textBaseline = 'middle'
			ctx.font = `${style.fontSize}px/${style.lineSpace}px ${style.fontFamily}`;

			let { offset, shift } = this;

			ctx.fillStyle = style.color;

			let lengthOffset = data.length.toString().length;


			for(let i = 0; i < data.length; i++) {
				// ctx.fillText(`${i.toString().padStart(lengthOffset, ' ')}|${(data[i] || '').replace('\n', '↵')}`, offset.x, Math.round(style.fontSize/2) + offset.y + i*shift);
				ctx.fillText(`${(data[i] || '').replace('\n', '↵')}`, offset.x, Math.round(style.fontSize/2) + offset.y + i*shift);
			};


			this.drawCaret(ctx, buffer, caret);
		}
	};
};

