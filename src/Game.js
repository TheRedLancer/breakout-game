import * as THREE from 'three'
import EventHandler from './EventHandler';
import InputListener from './InputListener';
import Machine from './Machine';
import Paddle from './Paddle';

class Game { 
    constructor() {
        this.scene = new THREE.Scene();
        this.renderer = new THREE.WebGLRenderer();
        
        let canvas = this.renderer.domElement;
        document.body.appendChild(canvas);
        this.renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);

        this.camera = new THREE.PerspectiveCamera(75, canvas.offsetWidth / canvas.offsetHeight, 0.1, 1000);
        this.scene.add(this.camera);

        this.renderer.setClearColor(0xdddddd, 1);

        this.machine = new Machine();
        this.eventHandler = new EventHandler();
        this.inputListener = new InputListener((arr) => {
            this.eventHandler.dispatch('inputListener', arr);
        });
    }

    setup() {
        const gameArea = this.makeGameArea(40, 60);
        this.scene.add(gameArea);

        const paddle = new Paddle(10);
        this.scene.add(paddle);

        this.cameraSetup(gameArea.position);
        this.renderer.render(this.scene, this.camera);
        this.eventHandler.subscribe('inputListener', ([keyCode, isPressed, keys]) => {
            if (isPressed) {
                console.log("Down " + keyCode);
            } else {
                console.log("Up " + keyCode);
            }
        });

        this.machine.addCallback((delta_t) => paddle.update(delta_t));
    }

    cameraSetup(center) {
        this.camera.position.set(0, 5, 45);
        this.camera.lookAt(center.x, 20, center.z);
    }

    start() {
        this.eventHandler.subscribe('inputListener', ([keyCode, isPressed, keys]) => {
            if (keyCode == 46 && isPressed) {
                this.stop();
            }
        });
        this.inputListener.start();
        this.machine.start();
    }

    stop() {
        this.inputListener.stop();
        this.machine.stop();
    }

    /**
     * Creates the 4 walls of the playable area
     * @param {int} width 
     * @param {int} height 
     */
    makeGameArea(width, height) {
        let gameArea = new THREE.Object3D();
        let borderWidth = 3;

        const borderMaterial = new THREE.MeshNormalMaterial(); //{color: 0x00ff00} );

        // top
        let topGeo = new THREE.BoxGeometry(width + 2 * borderWidth, borderWidth, borderWidth);
        const topMesh = new THREE.Mesh(topGeo, borderMaterial);
        topMesh.position.set(0, height + borderWidth / 2, 0);
        gameArea.add(topMesh);

        // left 
        let leftGeo = new THREE.BoxGeometry(borderWidth, height, borderWidth);
        const leftMesh = new THREE.Mesh(leftGeo, borderMaterial);
        leftMesh.position.set(-(width + borderWidth) / 2, height / 2, 0);
        gameArea.add(leftMesh);

        // right
        let rightGeo = new THREE.BoxGeometry(borderWidth, height, borderWidth);
        const rightMesh = new THREE.Mesh(rightGeo, borderMaterial);
        rightMesh.position.set((width + borderWidth) / 2, height / 2, 0);
        gameArea.add(rightMesh);

        // bottom
        let botGeo = new THREE.BoxGeometry(width + 2 * borderWidth, borderWidth, borderWidth);
        const botMesh = new THREE.Mesh(botGeo, borderMaterial);
        botMesh.position.set(0, -borderWidth / 2, 0);
        gameArea.add(botMesh);
        
        gameArea.position.set(0, -3, 0);
        return gameArea;
    }
}

export default Game;