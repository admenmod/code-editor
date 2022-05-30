'use strict';
ns['global'] = new function() {
	const { GridMap, MotionByTouch, RenderLoop } = ns['system'];


	//========== global variables ==========//
	const screenSize = this.screenSize = vec2().set(canvas.size);

	canvas.on('resize', e => {
		screenSize.set(canvas.size);

		this.globalGridMap.size.set(screenSize);
	});


	//========== global objects ==========//
	this.motionByTouch = new MotionByTouch();
	this.globalGridMap = new GridMap({ size: screenSize });


	const renderLoop = this.renderLoop = new RenderLoop();

	renderLoop.on('render', dt => Scene.update(dt));
	renderLoop.on('render', () => touches.nullify());

	loading.then(() => {
		renderLoop.start();

		Scene.run('main');
	});


	const systemInfoDrawObject = this.systemInfoDrawObject = {
		textFPS: '',
		textScreenSize: '',

		padding: vec2(10, 10),
		time: 0,
		
		update(dt) {
			if(this.time > 100) {
				this.textFPS = `FPS: ${(1000/dt).toFixed(2)}`;
				this.textScreenSize = `Screen size: ${screenSize.x}, ${screenSize.y}`;

				this.time = 0;
			};

			this.time += dt;
		},

		draw(ctx) {
			ctx.save();
			ctx.beginPath();

			ctx.font = `18px arkhip, Arial`;
			ctx.textBaseline = 'top';

			ctx.strokeStyle = '#111111';
			ctx.strokeText(this.textFPS, this.padding.x, this.padding.y);
			ctx.fillStyle = '#eeeeee';
			ctx.fillText(this.textFPS, this.padding.x, this.padding.y);


			ctx.textAlign = 'end';
			ctx.textBaseline = 'bottom';

			ctx.strokeStyle = '#111111';
			ctx.strokeText(this.textScreenSize, screenSize.x - 10, screenSize.y - 10);
			ctx.fillStyle = '#eeeeee';
			ctx.fillText(this.textScreenSize, screenSize.x - 10, screenSize.y - 10);

			ctx.restore();
		}
	};


	canvas.addEventListener('dblclick', e => canvas.requestFullscreen());
};

