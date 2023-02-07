import * as THREE from 'three'
import Ball from './Ball';
import Block from './Block';
import Engine from './Engine';
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

        Engine.inputListener.setCaster((arr) => {
            Engine.eventHandler.dispatch('inputListener', arr);
        });
    }

    main() {
        this.setup();
        this.start();
    }

    setup() {
        this.makeLevel();

        Engine.eventHandler.subscribe('inputListener', ([keyCode, isPressed, keys]) => {
            if (isPressed) {
                console.log("Down " + keyCode);
            } else {
                console.log("Up " + keyCode);
            }
        });
        Engine.machine.addCallback(() => {
            this.renderer.render(this.scene, this.camera)
        });
    }

    detectCollision() {
        let ball = this.scene.getObjectByName("ball");
        let paddle = this.scene.getObjectByName("paddle");
        if (ball.boundingSphere.intersectsBox(paddle.boundingBox)) {
            Engine.eventHandler.dispatch("objectCollision", paddle);
            console.log("Colission");
        }
        for (const block of this.scene.getObjectsByProperty("tag", "block")) {
            if (ball.boundingSphere.intersectsBox(block.boundingBox)) {
                console.log(block.block_id);
                Engine.eventHandler.dispatch("objectCollision", block);
            }
        }
    }

    cameraSetup(center) {
        this.camera.position.set(0, 5, 45);
        this.camera.lookAt(center.x, 20, center.z);
    }

    start() {
        Engine.eventHandler.subscribe('inputListener', ([keyCode, isPressed, keys]) => {
            if (keyCode === 27 && isPressed) {
                this.shutdown();
            }
            if (keyCode === 8 && isPressed) {
                Engine.machine.stop();
            }
            if (keyCode === 13 && isPressed) {
                Engine.machine.start();
            }
        });
        Engine.eventHandler.subscribe("gameOver", (message) => {
            this.shutdown();
            console.log(message);
        });
        Engine.inputListener.start();
        Engine.machine.start();
        Engine.machine.addCallback(() => {this.detectCollision()});
    }

    shutdown() {
        Engine.inputListener.stop();
        Engine.machine.stop();
    }

    makeLevel() {
        const gameArea = this.makeGameArea(40, 60);
        this.scene.add(gameArea);

        const ball = new Ball(1);
        ball.position.set(0, 10, 0);
        this.scene.add(ball);

        const paddle = new Paddle(10);
        this.scene.add(paddle);

        for (let j = 0; j < 4; j++) {
            for (let i = 0; i < 6; i++) {
                let newBlock = new Block(5, 3);
                newBlock.position.set(6 * i - 15, 4 * j + 40, 0);
                newBlock.setBlockID(i);
                this.scene.add(newBlock);
            }
        }

        this.cameraSetup(gameArea.position);
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