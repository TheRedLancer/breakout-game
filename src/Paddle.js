import * as THREE from 'three'

class Paddle extends THREE.Object3D {
    constructor(width) {
        super();
        this.name = 'player_paddle';
        this.geometry = new THREE.BoxGeometry(width, 1, 1);
    }
}