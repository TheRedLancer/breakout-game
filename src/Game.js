import * as THREE from 'three'
import Ball from './Ball';
import Block from './Block';
import Engine from './Engine';
import GameArea from './GameArea';
import Paddle from './Paddle';
import UI from './UI';

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

        this.score = 0;
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
            this.renderer.render(this.scene, this.camera);
        });
    }

    detectCollision() {
        let ball = this.scene.getObjectByName("ball");
        let paddle = this.scene.getObjectByName("paddle");
        let walls = this.scene.getObjectByProperty("tag", "wall")
        if (walls) {
            walls.checkCollisions(ball);
        }
        if (ball.boundingSphere.intersectsBox(paddle.boundingBox)) {
            Engine.eventHandler.dispatch("objectCollision", paddle);
        }
        for (const block of this.scene.getObjectsByProperty("tag", "block")) {
            if (ball.boundingSphere.intersectsBox(block.boundingBox)) {
                Engine.eventHandler.dispatch("objectCollision", block);
            }
        }
    }

    cameraSetup(center) {
        this.camera.position.set(0, 5, 45);
        this.camera.lookAt(center.x, 18, center.z);
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
        Engine.eventHandler.subscribe("scorePoints", (points) => {
            this.score += points;
            if (this.score >= 24) {
                Engine.eventHandler.dispatch("gameOver", "YOU WIN!");
            }
            console.log(this.score);
        });
        Engine.eventHandler.subscribe("hitBottomWall", () => {
            this.onHitBottomWall();
        });
        Engine.eventHandler.subscribe("gameOver", (message) => {
            this.shutdown();
            console.log(message);
            this.renderer.render(this.scene, this.camera);
        });
        Engine.inputListener.start();
        Engine.machine.start();
        Engine.machine.addCallback(() => {this.detectCollision()});
    }

    onHitBottomWall() {
        Engine.eventHandler.dispatch("gameOver", "GAME OVER");
    }

    shutdown() {
        Engine.inputListener.stop();
        Engine.machine.stop();
    }

    makeLevel() {
        let width = 40;
        let height = 60;
        const gameArea = new GameArea(width, height);
        gameArea.position.y = -3;
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

        const ui = new UI(width, height);
        this.scene.add(ui);

        this.cameraSetup(gameArea.position);
    }
}

export default Game;