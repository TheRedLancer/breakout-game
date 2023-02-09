import * as THREE from 'three'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import Engine from '../Engine'

export default class MessageUI extends THREE.Object3D {
    constructor(font) {
        super();
        this.font = font;
        this.geometry = null;
        this.mesh = null;
        Engine.eventHandler.subscribe("showMessage", (message) => {
            console.log("showMessageUI");
            this.updateMessage(message);
            this.geometry.computeBoundingBox();
            this.position.x = - 0.5 * ( this.geometry.boundingBox.max.x - this.geometry.boundingBox.min.x );
        });
        Engine.eventHandler.subscribe("clearMessage", (message) => {
            console.log("clearMessageUI");
            this.remove(this.mesh);
        });
    }

    updateMessage(text) {
        this.remove(this.mesh);
        this.geometry = new TextGeometry( text, {
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