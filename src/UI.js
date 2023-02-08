import * as THREE from 'three'
import Engine from './Engine';
import { Font } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';


class UI extends THREE.Object3D {
    constructor(width, height) {
        super();
        this.score = new THREE.Object3D();
        this.message = new THREE.Object3D();
        this.score.geometry = null;
        this.score.mesh = null;
        this.message.geometry = null;
        this.message.mesh = null;
        this.font = new Font(require('./droid_sans_mono_regular.typeface.json'));
        this.updateScore(this.font, "SCORE:0")
        this.score.position.set(- (width / 2) - 2, -10, 0);
        this.score.value = 0;
        Engine.eventHandler.subscribe("scorePoints", (points) => {
            this.score.value += points;
            this.updateScore(null, "SCORE:" + this.score.value);
        });
        Engine.eventHandler.subscribe("gameOver", (message) => {
            console.log("gameOverUI");
            this.updateMessage(null, message);
            this.message.geometry.computeBoundingBox();
            this.message.position.set(- 0.5 * ( this.message.geometry.boundingBox.max.x - this.message.geometry.boundingBox.min.x ), 23, 0);
        })
        this.add(this.score);
        this.add(this.message);
    }

    updateMessage(font, text) {
        if (font) {
            this.font = font;
        }
        this.message.remove(this.score.mesh);
        this.message.geometry = new TextGeometry( text, {
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
        this.message.material = new THREE.MeshNormalMaterial();
        this.message.mesh = new THREE.Mesh(this.message.geometry, this.message.material);
        this.message.add(this.message.mesh);
    }

    updateScore(font, text) {
        if (font) {
            this.font = font;
        }
        this.score.remove(this.score.mesh);
        this.score.geometry = new TextGeometry( text, {
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
        this.score.material = new THREE.MeshNormalMaterial();
        this.score.mesh = new THREE.Mesh(this.score.geometry, this.score.material);
        this.score.add(this.score.mesh);
    }

    update() {
        console.log(this);
    }
}

export default UI;