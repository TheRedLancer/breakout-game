import * as THREE from 'three'
import { Vector3 } from 'three';
import Ball from './Ball';
import Block from './Block';
import Engine from './Engine/Engine';
import GameArea from './GameArea';
import LifeCounter from './LifeCounter';
import Paddle from './Paddle';
import UI from './UI/UI';

class Game { 
    constructor() {
        this.renderer = new THREE.WebGLRenderer();
        this.canvas = this.renderer.domElement;
        document.body.appendChild(this.canvas);
        this.renderer.setSize(this.canvas.offsetWidth, this.canvas.offsetHeight);
        this.renderer.setClearColor(0xdddddd, 1);
        this.launch = this.launch.bind(this);
        this.detectCollision = this.detectCollision.bind(this);
        this.balls = [];
    }

    main() {
        Engine.inputListener.setCaster((arr) => {
            Engine.eventHandler.dispatch('inputListener', arr);
        });
        this.setup();
        Engine.eventHandler.subscribe('inputListener', this.launch);
        Engine.eventHandler.dispatch("showMessage", "SPACE TO START");
        Engine.inputListener.start();
        this.renderer.render(this.scene, this.camera);
    }

    launch([keyCode, isPressed, keys]) {
        if (keyCode === 32 && isPressed) {
            Engine.eventHandler.unsubscribe('inputListener', this.launch);
            console.log(Engine.eventHandler.events);
            Engine.eventHandler.dispatch("clearMessage", null);
            this.start();
        }
    }

    setup() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, this.canvas.offsetWidth / this.canvas.offsetHeight, 0.1, 1000);
        this.scene.add(this.camera);
        this.score = 0;
        this.lives = 3;
        this.balls = [];
        this.makeLevel();
        // Engine.eventHandler.subscribe('inputListener', ([keyCode, isPressed, keys]) => {
        //     if (isPressed) {
        //         console.log("Down " + keyCode);
        //     } else {
        //         console.log("Up " + keyCode);
        //     }
        // });
        Engine.machine.addCallback(() => {
            this.renderer.render(this.scene, this.camera);
        });
    }

    detectCollision() {
        let ball = this.scene.getObjectByName("ball");
        if (!ball) return;
        let paddle = this.scene.getObjectByName("paddle");
        let walls = this.scene.getObjectByProperty("tag", "wall");
        if (ball.boundingSphere.intersectsBox(paddle.boundingBox)) {
            console.log("paddle", ball);
            if (ball.position.y < 2) {
                Engine.eventHandler.dispatch("objectCollision", paddle);
            }
        }
        if (walls) {
            walls.checkCollisions(ball);
        }
        for (const block of this.scene.getObjectsByProperty("tag", "block")) {
            if (ball.boundingSphere.intersectsBox(block.boundingBox)) {
                Engine.eventHandler.dispatch("objectCollision", block);
            }
        }
    }

    start() {
        // Start/Stop controls
        Engine.eventHandler.subscribe('inputListener', ([keyCode, isPressed, keys]) => {
            if (keyCode === 27 && isPressed) {
                Engine.machine.stop();
            }
            if (keyCode === 82 && isPressed) {
                this.reset();
            }
        });
        // Score points
        Engine.eventHandler.subscribe("scorePoints", (points) => {
            this.score += points;
            this.ui.score.updateScore(this.score);
            if (this.score >= 24) {
                Engine.eventHandler.dispatch("gameOver", "   YOU WIN!\n\"R\" to restart");
            }
        });
        Engine.eventHandler.subscribe("gameStart", () => {
            this.lives -= 1;
            this.lifeCounter.setLives(this.lives);
            this.balls[0].start();
        });
        Engine.eventHandler.subscribe("hitBottomWall", (ball) => {
            this.onHitBottomWall(ball);
        });
        Engine.eventHandler.subscribe("takeDamage", (damage) => {
            this.lives -= damage;
            this.lifeCounter.setLives(this.lives);
        });
        Engine.eventHandler.subscribe("gameOver", (message) => {
            Engine.eventHandler.dispatch("showMessage", message);
            Engine.machine.stop();
            this.renderer.render(this.scene, this.camera);
        });
        Engine.machine.start();
        Engine.eventHandler.dispatch("gameStart", null);
        Engine.machine.addCallback(this.detectCollision);
    }

    reset() {
        Engine.clear();
        while(this.scene.children.length > 0){ 
            if (this.scene.children[0].tag && this.scene.children[0].tag === 'block') {
                this.scene.children[0].destroy();
            } else {
                this.scene.remove(this.scene.children[0]); 
            }
        }
        this.main();
    }

    onHitBottomWall(ball) {
        console.log("OnHitBottomWall", ball);
        if (this.lives > 0) {
            this.balls = this.balls.filter(b => b != ball);
            ball.destroy();
            Engine.eventHandler.dispatch("takeDamage", 1);
            const newBall = new Ball(1);
            newBall.position.set(0, 10, 0);
            this.balls.push(newBall);
            this.scene.add(newBall);
            this.renderer.render(this.scene, this.camera);
            newBall.start();
        } else {
            Engine.eventHandler.dispatch("gameOver", "  GAME OVER\n\"R\" to restart");
        }
    }

    makeLevel() {
        let width = 40;
        let height = 60;
        const gameArea = new GameArea(width, height);
        gameArea.position.y = -3;
        this.scene.add(gameArea);

        const ball = new Ball(1);
        ball.position.set(0, 10, 0);
        this.balls.push(ball);
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
        this.lifeCounter = new LifeCounter(this.lives, 1);
        this.lifeCounter.position.set(width / 2, -9, -1);
        this.scene.add(this.lifeCounter);

        this.ui = new UI(width, height);
        this.scene.add(this.ui);

        this.camera.position.set(0, 5, 45);
        this.camera.lookAt(gameArea.position.x, 18, gameArea.position.z);
    }
}

export default Game;