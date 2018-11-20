const interactionBase = require('./interactionBase');
const pug = require('pug');

class unknown extends interactionBase {

    /**
     * Constructor of interaction base.
     * @param io socket connection.
     */
    constructor(io) {
        super(io);
    }

    /**
     * Active this interaction.
     */
    activate() {
        super.activate();

        // Change the frontend of Willy.
        this.io.emit('changeMood', 'gray');
        this.io.emit('changeFormat', {
            willy_height: '80%',
            content_height: '20%',
        });

        var content = pug.renderFile('views/information.pug', {
            h1: 'Sorry ik begrijp je niet',
        });
        this.io.emit('changeContent', content)

        // Speak the information.
        // @TODO: speak the information.
    }

}

module.exports = unknown;