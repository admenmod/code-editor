'use strict';
Scene.create('main', function() {
    const { GridMap, MotionByTouch } = ns['system'];
    const { systemInfoDrawObject, screenSize, globalGridMap, motionByTouch } = ns['global'];
    const { InputKeysHandler, Editor, Buffer, Style, BufferRenderer } = ns['textinput'];


    let input1 = document.createElement('input');
    input1.style.position = 'fixed';
    input1.style.top = '-1000px';
    canvas.append(input1);


    const inputKeysHandler = new InputKeysHandler(input1);
    canvas.addEventListener('click', () => inputKeysHandler.focus());

    const style = new Style({
        color: '#77ee77'
    });

    const editor = new Editor();
    const bufferRenderer = new BufferRenderer(new Buffer(), { style });

    globalGridMap.isCoords = false;
    globalGridMap.offset.set(style.padding);
    globalGridMap.tile.set(style.fontWidth, style.fontSize + style.lineSpace);

    this.preload(fetch(`${location.origin}/user-code/main.js`)
        .then(data => data.text())
        .then(data => {
            bufferRenderer.buffer.set(data);

            editor.on('inputChar', (...args) => bufferRenderer.emit('inputChar', ...args));
        }).then(() => {
            let buffer = bufferRenderer.buffer;
            let caret = bufferRenderer.caret;


            inputKeysHandler.on('keydown', e => {
                // console.log(e);
                // editor.inputChar(e);

                if(e.key === 'Control' || e.key === 'Alt' || e.ctrl || e.alt) {
                    if(e.ctrl) {
                        if(e.key === 'l') buffer.set('');
                        if(e.key === 's') alert('saveing');
                    };

                    return;
                };


                if(e.key === 'ArrowUp') {
                    caret.y = bufferRenderer.getCaretPos().y;
                    caret.y += -1;
                    caret.y = bufferRenderer.getCaretPos().y;
                } else if(e.key === 'ArrowDown') {
                    caret.y = bufferRenderer.getCaretPos().y;
                    caret.y += 1;
                    caret.y = bufferRenderer.getCaretPos().y;
                } else if(e.key === 'ArrowLeft') {
                    caret.x = bufferRenderer.getCaretPos().x;
                    caret.x += -1;
                    caret.x = bufferRenderer.getCaretPos().x;
                } else if(e.key === 'ArrowRight') {
                    caret.x = bufferRenderer.getCaretPos().x;
                    caret.x += 1;
                    caret.x = bufferRenderer.getCaretPos().x;
                } else if(e.key === 'Enter') {
                } else if(e.key === 'Escape') {
                    inputKeysHandler.blur();
                } else if(e.key === 'Backspace') {
                    let area = new Area(caret.buf());
                    // Vector2.prototype.set.call(area, caret);

                    buffer.del(area);
                    // caret.x += -1;
                } else if(e.key.length < 2) {
                    buffer.put(caret.y, caret.x, e.data);
					caret.x = bufferRenderer.getCaretPos().x;
                    caret.x += 1;
					caret.x = bufferRenderer.getCaretPos().x;
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


        bufferRenderer.drawBuffer(layers.main);


        // systemInfoDrawObject.update(dt);
        // systemInfoDrawObject.draw(layers.main.ctx);
    };


    //========== Exit ==========//
    this.exit = () => {
        console.log(this.name, 'exit');
    };
});

