import * as THREE from 'three'

class Machine {
    constructor() {
        this.running = false;
        this.callbacks = [];
        this.clock = new THREE.Clock(true);
    }

    addCallback(callback) {
        this.callbacks.push(callback);
    }

    removeCallback(callback) {
        this.callbacks = this.callbacks.filter(cb => cb != callback)
    }

    run = () => {
        if (!this.running) return;
        this.callbacks.forEach(cb => cb(this.clock.getDelta()));
        requestAnimationFrame(this.run.bind(this));
    }

    start = () => {
        if (this.running) return;
        this.running = true;
        this.clock.start();
        this.run();
    }

    stop = () => {
        this.running = false;
        console.log("stop");
    }
}

export default Machine;