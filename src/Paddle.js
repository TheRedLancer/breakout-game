import * as THREE from 'three'

class Paddle extends THREE.Object3D {
    constructor(width) {
        super();
        this.name = 'player_paddle';
        this.geometry = new THREE.BoxGeometry(width, 1, 1);
        this.material = new THREE.MeshNormalMaterial();
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.add(this.mesh);
    }
}

export default Paddle;