import * as THREE from 'three'
import Engine from './Engine/Engine';

class Ball extends THREE.Object3D {
    constructor(width) {
        super();
        this.name = 'ball';
        this.tag = 'ball';
        this.geometry = new THREE.SphereGeometry(width, 4, 4);
        this.geometry.computeBoundingSphere();
        this.material = new THREE.MeshNormalMaterial();
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.add(this.mesh);
        this.speed = 50;
        this.velocity = new THREE.Vector3(-1, 1, 0).normalize();
        // this.boundingSphere = new THREE.Sphere();
        // this.boundingSphere.copy(this.mesh.geometry.boundingSphere).applyMatrix4(this.mesh.matrixWorld);
        this.onBallCollisionE = (payload) => this.onBallCollision(payload.ball, payload.collider); 
        this.updateE = (delta_t) => this.update(delta_t);
    }

    start() {
        Engine.eventHandler.subscribe('ballCollision', this.onBallCollisionE);
        Engine.machine.addCallback(this.updateE);
    }

    /**
     * 
     * @param {Object} collision 
     * @param {THREE.Object3D} collision.object
     * @param {THREE.Vector3} collision.point
     * @param {THREE.Object} collision.face
     */
    onBallCollision(ball, collision) {
        if (ball != this) return;
        if (collision.object.parent.name === "paddle") {
            let p_to_c = new THREE.Vector3().copy(collision.point).sub(collision.object.parent.position);
            p_to_c.x = p_to_c.x / 7;
            p_to_c.normalize();
            this.velocity.copy(p_to_c);
        }
        if (collision.object.parent.name === "block") {
            this.velocity.reflect(collision.face.normal);
        }
        if (collision.object.parent.name === "game_area") {
            if (collision.object.name == "bot_wall") {
                Engine.eventHandler.dispatch("hitBottomWall", {"ball": this});
            } else {
                this.velocity.reflect(collision.face.normal);
            }
        }
    }

    update(delta_t) {
        //this.boundingSphere.copy(this.mesh.geometry.boundingSphere).applyMatrix4(this.mesh.matrixWorld);
        if (this.velocity.length() === 0) {
            this.velocity = new THREE.Vector3(-1, 1, 0);
        }
        this.detectCollisions(Engine.game.getScene().children, delta_t);
        this.velocity.setLength(this.speed * delta_t);
        this.position.add(this.velocity);
    }

    detectCollisions(objects, delta_t) {
        let gp = this.mesh.geometry.attributes.position;
        let wPos = [];
        for(let i = 0; i < gp.count; i++){
            let p = new THREE.Vector3().fromBufferAttribute(gp, i); // set p from `position`
            this.mesh.localToWorld(p); // p has wordl coords
            if (p.z == 0) {
                wPos.push(p);
            }
        }
        let rc = new THREE.Raycaster(new THREE.Vector3().copy(wPos[0]), new THREE.Vector3().copy(this.velocity).normalize(), 0, this.speed * 2 * delta_t);
        let nearestCollision = undefined;
        for (let i = 0; i < wPos.length; i = i + 3) {
            let vertex = wPos[i];
            let target = new THREE.Vector3().copy(this.velocity).normalize();
            if (vertex.z === 0) {
                rc.set(vertex, target);
                let intersected = rc.intersectObjects(objects, true).filter(o => {return o.object.parent.tag != "ball"});
                if (intersected.length > 0) {
                    if (!nearestCollision) {
                        nearestCollision = intersected[0];
                    } else if (intersected.distance < nearestCollision.distance) {
                        nearestCollision = intersected[0];
                    }
                }
            }
        }
        if (nearestCollision) {
            Engine.eventHandler.dispatch("ballCollision", {ball: this, collider: nearestCollision});
        }
    }

    destroy() {
        Engine.eventHandler.unsubscribe('ballCollision', this.onBallCollisionE);
        Engine.machine.removeCallback(this.updateE);
        this.removeFromParent();
    }
}

export default Ball;