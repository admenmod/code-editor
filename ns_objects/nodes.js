'use strict';
ns['nodes'] = new function() {
	let Node = this.Node = class extends Child {
		constructor(p = {}) {
			super();
			this.name = p.name || this.NODE_TYPE;

			this._isRenderDebug = 0;

			this._rotation = p.rotation || 0;
			this._position = (p.pos || p.position || vec2()).buf();
			this._scale = (p.scale || vec2(1, 1)).buf();
			this._zIndex = p.zIndex || 0;
		}

		get NODE_TYPE() { return Object.getPrototypeOf(this)[Symbol.toStringTag]; }

		set zIndex(v) { this._zIndex = v; }
		get zIndex() { return this._zIndex; }

		get pos() { return this._position; }
		get position() { return this._position; }

		get scale() { return this._scale; }

		set rot(v) { this._rotation = v; }
		get rot() { return this._rotation; }
		set rotation(v) { this._rotation = v; }
		get rotation() { return this._rotation; }


		get globalScale() { return this._getRelativeScale(Child.MAX_CHILDREN); }
		get globalRotation() { return this._getRelativeRotation(Child.MAX_CHILDREN); }

		get globalPos() { return this.globalPosition; }
		get globalPosition() { return this._getRelativePosition(Child.MAX_CHILDREN); }
		set globalPosition(v) {
			if(this.getParent()) this.pos.set(v.sub(this.getParent().globalPosition).div(this.getParent().scale));
			else this.pos.set(v);
		}

		get globalIsRenderDebug() { return this._getRelativeIsRenderDebug(Child.MAX_CHILDREN); }

		_getRelativeIsRenderDebug(nl = 0, arr = this.getChainParent()) {
			let l = Math.min(nl, arr.length, Child.MAX_CHILDREN);
			let acc = this._isRenderDebug;

			for(let i = 0; i < l; i++) {
				if(acc) break;
				acc = arr[i]._isRenderDebug;
			};

			return acc;
		}

		_getRelativeScale(nl = 0, arr = this.getChainParent()) {
			let l = Math.min(nl, arr.length, Child.MAX_CHILDREN);
			let acc = this.scale.buf();

			for(let i = 0; i < l; i++) acc.inc(arr[i].scale);

			return acc;
		}

		_getRelativeRotation(nl = 0, arr = this.getChainParent()) {
			let l = Math.min(nl, arr.length, Child.MAX_CHILDREN);
			let acc = this.rotation;

			for(let i = 0; i < l; i++) acc += arr[i].rotation;

			return acc;
		}

		_getRelativePosition(nl = 0, arr = this.getChainParent()) {
			let l = Math.min(nl, arr.length, Child.MAX_CHILDREN);
			let acc = vec2();

			let prev = this, next = null;

			if(!arr.length) acc.add(this.position);

			for(let i = 0; i < l; i++) {
				next = arr[i];

				acc.add(prev.position).inc(next.scale);
				if(next.rotation !== 0) acc.angle = next.rotation;

				prev = next;
			};

			if(arr.length) acc.add(arr[arr.length-1].position);

			return acc;
		}

		_ready() {}
		ready() {
			this.emit('ready');
			this._ready();

			let arr = this._children;
			for(let i = 0; i < arr.length; i++) arr[i].ready();
		}

		_update() {}
		update(dt = 1000/60) {
			this.emit('update', dt);
			this._update(dt);

			let arr = this._children;
			for(let i = 0; i < arr.length; i++) arr[i].update(dt);
		}
		_render(ctx) {
			ctx.save();
			this.draw(ctx);
			ctx.restore();
		}
		render(ctx) {
			let prevented = false;
			let e = { preventDefault: () => prevented = true };

			this.emit('render', ctx, e);

			if(prevented) return;
			this._render(ctx);

			let arr = this.getChildren().sort((a, b) => a.zIndex - b.zIndex);
			for(let i = 0; i < arr.length; i++) arr[i].render(ctx);
		}

		draw(ctx) {
			if(this.globalIsRenderDebug === 1) this.renderDebug(ctx, 30);
		}

		renderDebug(ctx, c = 30) {
			let pos = this.globalPosition;

			ctx.beginPath();
			ctx.lineWidth = 1;
			ctx.strokeStyle = '#3377ee';
			ctx.moveTo(pos.x-c, pos.y);
			ctx.lineTo(pos.x+c, pos.y);
			ctx.moveTo(pos.x, pos.y-c);
			ctx.lineTo(pos.x, pos.y+c);
			ctx.stroke();
			/*
			ctx.textAlign = 'center';
			ctx.textBaseline = 'middle';
			ctx.font = 'bold 15px Arial';

			ctx.strokeStyle = '#111111';
			ctx.strokeText(this.name, pos.x, pos.y);
			ctx.fillStyle = '#eeeeee';
			ctx.fillText(this.name, pos.x, pos.y);
			*/
		}

		getChild(path) {
			let l = path.search('/');
			if(!~l) return this._children.find(i => i.name === path);

			let left = path.slice(0, l);
			let right = path.slice(l+1);

			return this.getChild(left).getChild(right);
		}
		appendChild(node) {
			if(this.getChild(node.name)) return Error('err: name match');
			return super.appendChild(node);
		}

		// appendChild(...args) { return super.appendChild(...args); } // todo: cache
		// removeChild(...args) { return super.appendChild(...args); } // todo: cache
	};
	Node.prototype[Symbol.toStringTag] = 'Node';


	let Spatial = this.Spatial = class extends Node {
		constructor(p = {}) {
			super(p);

			this.visible = p.visible||true;

			this._rotationOffsetPoint = (p.rotationOffsetPoint || vec2()).buf();
			this.alpha = p.alpha !== undefined ? p.alpha : 1;
		}

		get alpha() { return this._alpha; }
		set alpha(v) { return this._alpha = Math.min(1, Math.max(0, v)); }
		get globalAlpha() { return this._getRelativeAlpha(Child.MAX_CHILDREN); }

		_getRelativeAlpha(nl = 0, arr = this.getChainParent()) {
			let l = Math.min(nl, arr.length, Child.MAX_CHILDREN);
			let acc = this.alpha;

			for(let i = 0; i < l; i++) {
				if(arr[i].alpha !== undefined) acc *= arr[i].alpha;
			};

			return acc;
		}
	};
	Spatial.prototype[Symbol.toStringTag] = 'Spatial';


	let Sprite = this.Sprite = class extends Spatial {
		constructor(p = {}) {
			super(p);

			if(!p.image) throw Error('Invalid parameter image');
			this.image = p.image;

			this._size = vec2(p.size?.x||this.image.width, p.size?.y||this.image.height);

			this._drawAngleOffset = p.drawAngleOffset||0;
			this._drawOffset = (p.drawOffset || vec2()).buf();
		}

		get size() { return this._size; }
		get globalSize() { return this.globalScale.inc(this._size); }

		renderDebug(ctx) {
			let pos = this.globalPosition, size = this.globalSize;
			let drawPos = pos.buf().add(this._drawOffset).sub(size.buf().div(2));

			ctx.beginPath();
			ctx.globalAlpha = this.globalAlpha+0.2;
			ctx.lineWidth = 1;
			ctx.strokeStyle = '#ffff00';
			// ctx.strokeRect(drawPos.x+ctx.lineWidth/2, drawPos.y+ctx.lineWidth/2, size.x-ctx.lineWidth, size.y-ctx.lineWidth);
			// ctx.strokeRect(drawPos.x-ctx.lineWidth/2, drawPos.y-ctx.lineWidth/2, size.x+ctx.lineWidth, size.y+ctx.lineWidth);
			ctx.strokeRect(drawPos.x, drawPos.y, size.x, size.y);

			ctx.moveTo(pos.x-size.x/3, pos.y);
			ctx.lineTo(pos.x+size.x/3, pos.y);
			ctx.moveTo(pos.x, pos.y-size.y/3);
			ctx.lineTo(pos.x, pos.y+size.y/3);
			ctx.stroke();
		}

		draw(ctx) {
			if(!this.visible) return;

			let pos = this.globalPosition, rot = this.globalRotation, size = this.globalSize;
			let drawPos = pos.buf().add(this._drawOffset).sub(size.buf().div(2));

			ctx.beginPath();
			ctx.globalAlpha = this.globalAlpha;

			ctx.rotateOffset(rot+this._drawAngleOffset, pos.buf().add(this._rotationOffsetPoint));

			ctx.drawImage(this.image, drawPos.x, drawPos.y, size.x, size.y);

			if(this.globalIsRenderDebug === 1) this.renderDebug(ctx, pos, size, drawPos);

			super.draw(ctx);
		}
	};
	Sprite.prototype[Symbol.toStringTag] = 'Sprite';
	//======================================================================//
};

