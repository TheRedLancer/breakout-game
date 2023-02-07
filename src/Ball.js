import * as THREE from 'three'
import Engine from './Engine';

class Ball extends THREE.Object3D {
    constructor(width) {
        super();
        this.name = 'ball';
        this.geometry = new THREE.SphereGeometry(width, 10, 5);
        this.material = new THREE.MeshNormalMaterial();
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.add(this.mesh);
        this.speed = 0.3;
        this.velocity = new THREE.Vector3(1, 1, 0);
        Engine.machine.addCallback((delta_t) => this.update(delta_t));
        Engine.eventHandler.subscribe('inputListener', ([keyCode, isPressed, keys]) => {
            if (isPressed && keyCode === 80) {
                console.log("Ball.pos: " + Engine.vector3ToString(this.position));
            }
        });
    }

    update(delta_t) {
        if (this.position.x >= 19) {
            this.velocity.reflect(new THREE.Vector3(-1, 0, 0));
        }
        if (this.position.x <= -19) {
            this.velocity.reflect(new THREE.Vector3(1, 0, 0));
        }
        if (this.position.y >= 56) {
            this.velocity.reflect(new THREE.Vector3(0, -1, 0));
        }
        if (this.position.y <= -2) {
            this.velocity.reflect(new THREE.Vector3(0, 1, 0));
        }
        this.velocity.normalize();
        this.velocity.multiplyScalar(this.speed);
        this.position.add(this.velocity);
    }
}

export default Ball;