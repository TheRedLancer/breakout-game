class InputListener {
    constructor(caster) {
        this.inputs = {};
        this.caster = caster || console.log;
        this.down = this.down.bind(this);
        this.up = this.up.bind(this);
    }

    setCaster(fn) {
        this.caster = fn;
    }

    isPressed(keyCode) {
        return this.inputs[keyCode];
    }

    down(e) {
        if (this.inputs[e.keyCode]) return;
        this.inputs[e.keyCode] = true;
        this.caster([e.keyCode, true, this.inputs]);
    }

    up(e) {
        this.inputs[e.keyCode] = false;
        this.caster([e.keyCode, false, this.inputs]);
    }

    start() {
        window.addEventListener('keydown', this.down);
        window.addEventListener('keyup', this.up);
    }

    stop() {
        window.removeEventListener('keydown', this.down);
        window.removeEventListener('keyup', this.up);
    }

    clear() {
        this.inputs = [];
    }
}

export default InputListener;