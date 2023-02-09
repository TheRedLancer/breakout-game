import * as THREE from 'three'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import Engine from '../Engine/Engine';

export default class ScoreUI extends THREE.Object3D {
    constructor(font) {
        super();
        this.font = font;
        this.geometry = null;
        this.mesh = null;
    }

    updateScore(value) {
        this.remove(this.mesh);
        this.geometry = new TextGeometry( "SCORE:" + value, {
            font: this.font,
            size: 3,
            height: 1,
            curveSegments: 2,
            bevelEnabled: true,
            bevelThickness: 0.1,
            bevelSize: 0.1,
            bevelOffset: 0,
            bevelSegments: 1
        } );
        this.material = new THREE.MeshNormalMaterial();
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.add(this.mesh);
    }
}