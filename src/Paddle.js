import * as THREE from 'three'
import Engine from './Engine/Engine';

class Paddle extends THREE.Object3D {
    constructor(width) {
        super();
        this.name = 'paddle';
        this.tag = 'paddle';
        this.geometry = new THREE.BoxGeometry(width, 1, 1);
        this.geometry.computeBoundingBox();
        this.material = new THREE.MeshNormalMaterial();
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.add(this.mesh);
        this.speed = 30;
        Engine.machine.addCallback((delta_t) => this.update(delta_t));
        // Engine.eventHandler.subscribe('inputListener', ([keyCode, isPressed, keys]) => {
        //     if (isPressed && keyCode === 32) {
        //         console.log("Paddle.pos: " + this.position.x);
        //     }
        // });
        this.boundingBox = new THREE.Box3();
        this.boundingBox.copy(this.geometry.boundingBox).applyMatrix4(this.mesh.matrixWorld);
    }

    update(delta_t) {
        this.boundingBox.copy(this.geometry.boundingBox).applyMatrix4(this.mesh.matrixWorld);
        if (Engine.inputListener.isPressed(65) || Engine.inputListener.isPressed(37)) {
            this.position.x = (this.position.x - this.speed * delta_t) > -15 ? (this.position.x - this.speed * delta_t) : -15;
        }
        if (Engine.inputListener.isPressed(68) || Engine.inputListener.isPressed(39)) {
            this.position.x = (this.position.x + this.speed * delta_t) < 15 ? (this.position.x + this.speed * delta_t) : 15;
        }
    }
}

export default Paddle;