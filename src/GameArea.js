import * as THREE from 'three'
import Engine from './Engine/Engine';
import Ball from './Ball';

class GameArea extends THREE.Object3D {
    constructor(width, height) {
        super();
        let borderWidth = 3;
        this.tag = "wall";
        const borderMaterial = new THREE.MeshNormalMaterial(); //{color: 0x00ff00} );

        // top
        let topGeo = new THREE.BoxGeometry(width + 2 * borderWidth, borderWidth, borderWidth);
        topGeo.computeBoundingBox();
        this.topMesh = new THREE.Mesh(topGeo, borderMaterial);
        this.topMesh.position.set(0, height + borderWidth / 2, 0);
        this.topBoundingBox = new THREE.Box3();
        this.topBoundingBox.copy(this.topMesh.geometry.boundingBox).applyMatrix4(this.topMesh.matrixWorld);
        this.topBoundingBox.tag = "topWall";
        this.add(this.topMesh);

        // left 
        let leftGeo = new THREE.BoxGeometry(borderWidth, height, borderWidth);
        leftGeo.computeBoundingBox();
        this.leftMesh = new THREE.Mesh(leftGeo, borderMaterial);
        this.leftMesh.position.set(-(width + borderWidth) / 2, height / 2, 0);
        this.leftBoundingBox = new THREE.Box3();
        this.leftBoundingBox.copy(this.leftMesh.geometry.boundingBox).applyMatrix4(this.leftMesh.matrixWorld);
        this.leftBoundingBox.tag = "leftWall";
        this.add(this.leftMesh);

        // right
        let rightGeo = new THREE.BoxGeometry(borderWidth, height, borderWidth);
        rightGeo.computeBoundingBox();
        this.rightMesh = new THREE.Mesh(rightGeo, borderMaterial);
        this.rightMesh.position.set((width + borderWidth) / 2, height / 2, 0);
        this.rightBoundingBox = new THREE.Box3();
        this.rightBoundingBox.copy(this.rightMesh.geometry.boundingBox).applyMatrix4(this.rightMesh.matrixWorld);
        this.rightBoundingBox.tag = "rightWall";
        this.add(this.rightMesh);

        // bottom
        let botGeo = new THREE.BoxGeometry(width + 2 * borderWidth, borderWidth, borderWidth);
        botGeo.computeBoundingBox();
        this.botMesh = new THREE.Mesh(botGeo, borderMaterial);
        this.botMesh.position.set(0, -borderWidth / 2, 0);
        this.botBoundingBox = new THREE.Box3();
        this.botBoundingBox.copy(this.botMesh.geometry.boundingBox).applyMatrix4(this.botMesh.matrixWorld);
        this.botBoundingBox.tag = "botWall";
        this.add(this.botMesh);

        Engine.machine.addCallback((delta_t) => this.update(delta_t));
    }

    update(delta_t) {
        this.updateBoundingBoxes();
    }

    updateBoundingBoxes() {
        this.topBoundingBox.copy(this.topMesh.geometry.boundingBox).applyMatrix4(this.topMesh.matrixWorld);
        this.leftBoundingBox.copy(this.leftMesh.geometry.boundingBox).applyMatrix4(this.leftMesh.matrixWorld);
        this.rightBoundingBox.copy(this.rightMesh.geometry.boundingBox).applyMatrix4(this.rightMesh.matrixWorld);
        this.botBoundingBox.copy(this.botMesh.geometry.boundingBox).applyMatrix4(this.botMesh.matrixWorld);
    }

    /**
     * Checks for collisions with ball
     * @param {Ball} ball
     */
    checkCollisions(ball) {
        if (ball.boundingSphere.intersectsBox(this.topBoundingBox)) {
            Engine.eventHandler.dispatch("objectCollision", this.topBoundingBox);
        }
        if (ball.boundingSphere.intersectsBox(this.leftBoundingBox)) {
            Engine.eventHandler.dispatch("objectCollision", this.leftBoundingBox);
        }
        if (ball.boundingSphere.intersectsBox(this.rightBoundingBox)) {
            Engine.eventHandler.dispatch("objectCollision", this.rightBoundingBox);
        }
        if (ball.boundingSphere.intersectsBox(this.botBoundingBox)) {
            Engine.eventHandler.dispatch("objectCollision", this.botBoundingBox);
        }
    }
}

export default GameArea;