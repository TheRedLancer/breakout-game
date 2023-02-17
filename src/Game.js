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
        this.balls = [];
        this.block_count = 0;
    }

    main() {
        Engine.inputListener.setCaster(([keyCode, isPressed, inputs]) => {
            Engine.eventHandler.dispatch('inputListener', {
                keyCode: keyCode,
                isPressed: isPressed,
                inputs: inputs
            });
        });
        this.setup();
        Engine.eventHandler.subscribe('inputListener', this.launch);
        Engine.eventHandler.dispatch("showMessage", {message: "SPACE TO START"});
        Engine.inputListener.start();
        this.renderer.render(this.scene, this.camera);
    }

    launch(payload) {
        if (payload.keyCode === 32 && payload.isPressed) {
            Engine.eventHandler.unsubscribe('inputListener', this.launch);
            //console.log(Engine.eventHandler.events);
            Engine.eventHandler.dispatch("clearMessage", {});
            this.start();
        }
    }

    getScene() {
        return this.scene;
    }

    setup() {
        Engine.game = this;
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, this.canvas.offsetWidth / this.canvas.offsetHeight, 0.1, 1000);
        this.scene.add(this.camera);
        this.score = 0;
        this.lives = 3;
        this.balls = [];
        this.makeLevel();
        Engine.eventHandler.subscribe('inputListener', (payload) => {
            // if (payload.isPressed) {
            //     console.log("Down " + payload.keyCode);}
            // else {
            //     console.log("Up " + keyCode);
            // }
        });
        Engine.machine.addCallback(() => {
            this.renderer.render(this.scene, this.camera);
        });
    }

    start() {
        // Start/Stop controls
        Engine.eventHandler.subscribe('inputListener', (payload) => {
            if (payload.keyCode === 27 && payload.isPressed) {
                Engine.machine.stop();
            }
            if (payload.keyCode === 82 && payload.isPressed) {
                this.reset();
            }
        });
        // Score points
        Engine.eventHandler.subscribe("scorePoints", (payload) => {
            this.score += payload.points;
            this.ui.score.updateScore(this.score);
            if (this.score >= this.block_count) {
                Engine.eventHandler.dispatch("gameOver", {message: "   YOU WIN!\n\"R\" to restart"});
            }
        });
        Engine.eventHandler.subscribe("gameStart", (payload) => {
            this.lives -= 1;
            this.lifeCounter.setLives(this.lives);
            this.balls[0].start();
        });
        Engine.eventHandler.subscribe("hitBottomWall", (payload) => {
            this.onHitBottomWall(payload.ball);
        });
        Engine.eventHandler.subscribe("takeDamage", (payload) => {
            this.lives -= payload.damage;
            this.lifeCounter.setLives(this.lives);
        });
        Engine.eventHandler.subscribe("gameOver", (payload) => {
            Engine.eventHandler.dispatch("showMessage", {message: payload.message});
            Engine.machine.stop();
            this.renderer.render(this.scene, this.camera);
        });
        Engine.machine.start();
        Engine.eventHandler.dispatch("gameStart", {});
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
        //console.log("OnHitBottomWall", ball);
        if (this.lives > 0) {
            this.balls = this.balls.filter(b => b != ball);
            ball.destroy();
            Engine.eventHandler.dispatch("takeDamage", {damage: 1});
            const newBall = new Ball(1);
            newBall.position.set(0, 10, 0);
            this.balls.push(newBall);
            this.scene.add(newBall);
            this.renderer.render(this.scene, this.camera);
            newBall.start();
        } else {
            Engine.eventHandler.dispatch("gameOver", {message: "  GAME OVER\n\"R\" to restart"});
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

        let block_height = 5;
        let block_width = 7;
        this.block_count = block_height * block_width;

        for (let j = 0; j < 5; j++) {
            for (let i = 0; i < 7; i++) { 
                let newBlock = new Block(5, 3);
                newBlock.position.set(5.5 * i - 16.5, -3.5 * j + 53, 0);
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