class InputListener {
    constructor(caster) {
        this.inputs = {};
        this.caster = caster || console.log
    }

    isPressed(keyCode) {
        return this.inputs[keyCode];
    }

    down(e) {
        if (this.inputs[keyCode]) return;
        this.inputs[e.keyCode] = true;
        this.caster([e.keyCode, true, this.inputs]);
    }

    up(e) {
        this.inputs[e.keyCode] = true;
        this.caster([e.keyCode, false, this.inputs]);
    }

    start() {
        window.addEventListener('keydown', this.down.bind(this));
        window.addEventListener('keyup', this.up.bind(this));
    }

    stop() {
        window.removeEventListener('keydown', this.down.bind(this));
        window.removeEventListener('keyup', this.up.bind(this));
    }
}