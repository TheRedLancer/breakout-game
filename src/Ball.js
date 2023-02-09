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
        this.velocity = new THREE.Vector3(-1, 1, 0);
        Engine.machine.addCallback((delta_t) => this.update(delta_t));
        Engine.eventHandler.subscribe('inputListener', ([keyCode, isPressed, keys]) => {
            if (isPressed && keyCode === 80) {
                console.log("Ball.pos: " + Engine.vector3ToString(this.position));
            }
        });
        Engine.eventHandler.subscribe('objectCollision', (other) => this.onObjectCollision(other));
        this.boundingSphere = new THREE.Sphere();
        this.boundingSphere.copy(this.mesh.geometry.boundingSphere).applyMatrix4(this.mesh.matrixWorld);
    }

    /**
     * 
     * @param {THREE.Object3D} other 
     */
    onObjectCollision(other) {
        if (other.tag === "paddle") {
            if (this.position.x > other.boundingBox.min.x && this.position.x < other.boundingBox.max.x) {
                let paddleToBall = new THREE.Vector3().subVectors(new THREE.Vector3().copy(this.position), other.position).normalize();
                paddleToBall.x = paddleToBall.x / 1.5;
                this.velocity = paddleToBall;
            } else if (this.position.x < other.boundingBox.min.x) {
                this.velocity.set(-Math.abs(this.velocity.x), this.velocity.y, this.velocity.z);
            } else {
                this.velocity.set(Math.abs(this.velocity.x), this.velocity.y, this.velocity.z);
            }
        }
        if (other.tag === "block") {
            other.removeFromParent();
            if (this.position.x > other.boundingBox.max.x) {
                this.velocity.x = Math.abs(this.velocity.x);
            } else if (this.position.x < other.boundingBox.min.x) {
                this.velocity.x = -Math.abs(this.velocity.x);
            } else if (this.position.y < other.boundingBox.min.y) {
                this.velocity.y = -Math.abs(this.velocity.y);
            } if (this.position.y > other.boundingBox.max.y) {
                this.velocity.y = Math.abs(this.velocity.y);
            }
            Engine.eventHandler.dispatch("scorePoints", 1);
        }
        if (other.tag === "topWall") {
            this.velocity.y = -Math.abs(this.velocity.y);
        }
        if (other.tag === "rightWall") {
            this.velocity.x = -Math.abs(this.velocity.x);
        }
        if (other.tag === "leftWall") {
            this.velocity.x = Math.abs(this.velocity.x);
        }
        if (other.tag === "botWall") {
            Engine.eventHandler.dispatch("hitBottomWall", this);
            this.velocity = new THREE.Vector3(0, 0, 0);
        }
    }

    update(delta_t) {
        this.boundingSphere.copy(this.mesh.geometry.boundingSphere).applyMatrix4(this.mesh.matrixWorld);
        if (this.velocity.length() === 0) {
            this.velocity = new THREE.Vector3(-1, 1, 0);
        }
        this.velocity.setLength(this.speed * delta_t);
        this.position.add(this.velocity);
    }
}

export default Ball;