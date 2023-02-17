import * as THREE from 'three'
import Engine from './Engine/Engine';


class Block extends THREE.Object3D {
    constructor(width, height) {
        super();

        this.name = "block";
        this.tag = "block";
        this.block_id = null;

        this.geometry = new THREE.BoxGeometry(width, height, 2);
        this.geometry.computeBoundingBox();
        this.material = new THREE.MeshNormalMaterial();
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.add(this.mesh);

        this.boundingBox = new THREE.Box3();
        this.boundingBox.copy(this.geometry.boundingBox).applyMatrix4(this.mesh.matrixWorld);
        
        this.updateE = (delta_t) => this.update(delta_t);
        this.onBallCollisionE = (payload) => this.onBallCollision(payload.ball, payload.collider); 
        this.destroy = this.destroy.bind(this);

        Engine.eventHandler.subscribe('ballCollision', this.onBallCollisionE);
        Engine.machine.addCallback(this.updateE);
    }

    update(delta_t) {
        this.boundingBox.copy(this.geometry.boundingBox).applyMatrix4(this.mesh.matrixWorld);
    }

    destroy() {
        Engine.machine.removeCallback(this.engineUpdate);
        this.removeFromParent();
    }

    onBallCollision(ball, collider) {
        if (collider.object.parent != this) return;
        this.destroy();
        Engine.eventHandler.dispatch("scorePoints", {points: 1});
    }

}

export default Block;