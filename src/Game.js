import * as THREE from 'three'

class Game { 
    constructor() {
        this.scene = new THREE.Scene();
        this.renderer = new THREE.WebGLRenderer();

        this.canvas = this.renderer.domElement;
        document.body.appendChild( this.renderer.domElement );
        this.renderer.setSize( this.canvas.clientWidth, this.canvas.clientHeight );

        this.camera = new THREE.PerspectiveCamera(75, this.canvas.clientWidth / this.canvas.clientHeight, 0.1, 1000);
        this.scene.add(this.camera);

        this.renderer.setClearColor(0xdddddd, 1);
    }

    setup = () => {
        const gameArea = this.makeGameArea(40, 60);
        this.scene.add(gameArea);
        this.camera.position.set(0, 0, 40);
        this.camera.lookAt(gameArea.position.x, 18, gameArea.position.z);
        this.renderer.render(this.scene, this.camera);
    }

    /**
     * Creates the 4 walls of the playable area
     * @param {int} width 
     * @param {int} height 
     */
    makeGameArea = (width, height) => {
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