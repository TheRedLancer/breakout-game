import * as THREE from 'three'

export default class LifeCounter extends THREE.Object3D {
    constructor(numLives, width) {
        super();
        this.material = new THREE.MeshNormalMaterial();
        this.width = width * 1.5;
        this.lifeMeshes = [];
        this.setLives(numLives);
    }

    setLives(numLives) {
        for (const m of this.lifeMeshes) {
            this.remove(m);
        }
        for (let i = 0; i < numLives; i++) {
            let lifeGeo = new THREE.SphereGeometry(this.width, 10, 5);
            let lifeMesh = new THREE.Mesh(lifeGeo, this.material);
            lifeMesh.position.set(- i * this.width * 3, 0, 0);
            this.lifeMeshes.push(lifeMesh);
            this.add(lifeMesh);
        }
    }
}