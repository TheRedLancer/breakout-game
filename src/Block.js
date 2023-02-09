import * as THREE from 'three'
import Engine from './Engine/Engine';


class Block extends THREE.Object3D {
    constructor(width, height) {
        super();
        this.tag = 'block';
        this.geometry = new THREE.BoxGeometry(width, height, 2);
        this.geometry.computeBoundingBox();
        this.material = new THREE.MeshNormalMaterial();
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.add(this.mesh);
        this.boundingBox = new THREE.Box3();
        this.boundingBox.copy(this.geometry.boundingBox).applyMatrix4(this.mesh.matrixWorld);
        this.block_id = null;
        Engine.machine.addCallback((delta_t) => this.update(delta_t));
    }

    setBlockID(new_id) {
        this.block_id = new_id;
    }

    update(delta_t) {
        this.boundingBox.copy(this.geometry.boundingBox).applyMatrix4(this.mesh.matrixWorld);
    }

}

export default Block;