import * as THREE from 'three'
import Engine from './Engine/Engine';

class Ball extends THREE.Object3D {
    constructor(width) {
        super();
        this.name = 'ball';
        this.tag = 'ball';
        this.geometry = new THREE.SphereGeometry(width, 10, 5);
        this.geometry.computeBoundingSphere();
        this.material = new THREE.MeshNormalMaterial();
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.add(this.mesh);
        this.speed = 40;
        this.velocity = new THREE.Vector3(-1, 1, 0).normalize();
        this.boundingSphere = new THREE.Sphere();
        this.boundingSphere.copy(this.mesh.geometry.boundingSphere).applyMatrix4(this.mesh.matrixWorld);
        this.onBallCollisionE = ([ball, other]) => this.onBallCollision(ball, other); 
        this.updateE = (delta_t) => this.update(delta_t);
    }

    start() {
        Engine.eventHandler.subscribe('ballCollision', this.onBallCollisionE);
        Engine.machine.addCallback(this.updateE);
    }

    /**
     * 
     * @param {Object} other 
     * @param {THREE.Object3D} other.object
     * @param {THREE.Vector3} other.point
     * @param {THREE.Object} other.face
     */
    onBallCollision(ball, other) {
        console.log(other);
        if (ball != this) return;
        if (other.object.parent.name === "paddle") {
            this.velocity.reflect(other.face.normal);
        }
        if (other.object.parent.name === "block") {
            this.velocity.reflect(other.face.normal);
        }
        if (other.object.parent.name === "game_area") {
            this.velocity.reflect(other.face.normal);
        }
    }

    update(delta_t) {
        this.boundingSphere.copy(this.mesh.geometry.boundingSphere).applyMatrix4(this.mesh.matrixWorld);
        if (this.velocity.length() === 0) {
            this.velocity = new THREE.Vector3(-1, 1, 0);
        }
        this.detectCollisions(Engine.game.getScene().children, delta_t);
        this.velocity.setLength(this.speed * delta_t);
        this.position.add(this.velocity);
    }

    detectCollisions(objects, delta_t) {
        let rc = new THREE.Raycaster(new THREE.Vector3().copy(this.position), new THREE.Vector3().copy(this.velocity).normalize(), 0, this.speed * 2 * delta_t);
        let intersected = rc.intersectObjects(objects, true);
        for (const other of intersected) {
            Engine.eventHandler.dispatch("ballCollision", {ball: this, other: other});
        }
    }

    destroy() {
        Engine.eventHandler.unsubscribe('ballCollision', this.onBallCollisionE);
        Engine.machine.removeCallback(this.updateE);
        this.removeFromParent();
    }
}

export default Ball;