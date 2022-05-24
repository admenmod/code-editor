'use strict';
ns['system'] = new function() {
	const RenderLoop = this.RenderLoop = class extends EventEmitter {
		constructor(p = {}) {
			super();

			this.isEnabled = false;
			this.prevTime = 0;
			this.maxDiff = p.maxDiff || 1000;
			this.mindt = p.mindt || 1000 / (p.fps || 120);
		}

		start() {
			if(this.isEnabled) return;
			this.isEnabled = true;

			let _update = currentTime => {
				if(!this.isEnabled) {
					this.emit('stop');
					return;
				};

				this.dt = currentTime - this.prevTime;

				if(this.dt > this.mindt) {
					if(this.dt < this.maxDiff) this.emit('render', this.dt);
					this.prevTime = currentTime;
				};

				requestAnimationFrame(_update);
			};

			requestAnimationFrame(_update);

			this.emit('start');
		}

		stop() {
			if(!this.isEnabled) return;
			this.isEnabled = false;
		}
	};


	const MotionByTouch = this.MotionByTouch = class {
		constructor(p = {}) {
			this.fixpos = vec2();
			this.slidingSpeed = vec2();

			this.delay = p.delay || 10;
			this.maxspeed = p.maxspeed || 10;
			this.minspeed = p.minspeed || 0.02;
			this.touch = null;
		}

		update(dt, touches, vec) {
			if(!this.touch) {
				if(Math.abs(this.slidingSpeed.moduleSq) < this.minspeed) this.slidingSpeed.set(0);

				this.slidingSpeed.moveTime(Vector2.ZERO, this.delay*15 / dt);
				vec.minus(this.slidingSpeed);

				if(this.touch = touches.findTouch()) this.fixpos = vec.buf();
			} else {
				if(this.touch.isDown()) vec.set(this.fixpos.buf().minus(this.touch.dx, this.touch.dy));

				if(this.touch.isMove()) {
					this.slidingSpeed.set(
						Math.abs(this.touch.sx) <= this.maxspeed ? this.touch.sx :Math.sign(this.touch.sx)*this.maxspeed,
						Math.abs(this.touch.sy) <= this.maxspeed ? this.touch.sy :Math.sign(this.touch.sy)*this.maxspeed
					);
				};

				if(this.touch.isUp()) this.touch = null;
			};
		}
	};


	const GridMap = this.GridMap = class {
		constructor(p = {}) {
			this.offset = (p.offset || vec2()).buf();
			this.tile = (p.tile || vec2(50, 50)).buf();
			this.size = (p.size || vec2()).buf();

			this.isCoords = p.isCoords ?? true;
			this.lineWidth = p.lineWidth || 0.2;
			this.lineColor = p.lineColor || '#ffffff';
		}

		draw(ctx, pos = Vector2.ZERO) {
			let mar = pos.buf().mod(this.tile);
			let counts = this.size.buf().add(mar).div(this.tile); 

			ctx.save();

			// clip area
			ctx.beginPath();
			ctx.rect(this.offset.x, this.offset.y, this.size.x, this.size.y);
			ctx.clip();


			// draw grid
			ctx.beginPath();
			ctx.lineWidth = this.lineWidth;
			ctx.strokeStyle = this.lineColor;

			for(let dx = pos.x > 1 ? 1:0; dx < counts.x; dx++) {
				const x = this.offset.x - mar.x + dx*this.tile.x;
				ctx.moveTo(x, this.offset.y);
				ctx.lineTo(x, this.offset.y + this.size.y);
			};

			for(let dy = pos.y > 1 ? 1:0; dy < counts.y; dy++) {
				const y = this.offset.y - mar.y + dy*this.tile.y;
				ctx.moveTo(this.offset.x, y);
				ctx.lineTo(this.offset.x + this.size.x, y);
			};

			ctx.stroke();


			// area stroke
			ctx.beginPath();
			ctx.strokeStyle = '#44ff44';
			ctx.strokeRect(this.offset.x, this.offset.y, this.size.x, this.size.y);


			// coordinates
			if(this.isCoords) {
				let pad = vec2(10, 10);

				ctx.beginPath();
				ctx.fillStyle = '#ffff00';
				ctx.globalAlpha = 0.4;

				for(let dx = -1; dx < counts.x; dx++) {
					const coordinate = Math.floor((pos.x*1.01 + dx*this.tile.x) / this.tile.x) * this.tile.x;
					ctx.fillText(coordinate, this.offset.x + 2 - mar.x + dx*this.tile.x, this.offset.y + pad.y);
				};

				for(let dy = -1; dy < counts.y; dy++) {
					const coordinate = Math.floor((pos.y*1.01 + dy*this.tile.y) / this.tile.y) * this.tile.y;
					ctx.fillText(coordinate, this.offset.x + 2, this.offset.y + pad.y - mar.y + dy*this.tile.y);
				};
			};

			ctx.restore();
		}
	};
};

