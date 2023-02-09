import * as THREE from 'three'
import { Font } from 'three/examples/jsm/loaders/FontLoader';
import MessageUI from './MessageUI';
import ScoreUI from './ScoreUI';

class UI extends THREE.Object3D {
    constructor(width, height) {
        super();
        this.font = new Font(require('../droid_sans_mono_regular.typeface.json'));
        
        this.score = new ScoreUI(this.font);
        this.score.position.set(- (width / 2) - 2, -10, 0);
        this.score.updateScore(0);
        this.add(this.score);

        this.message = new MessageUI(this.font);
        this.message.position.y = height * (1 / 3);
        this.add(this.message);
    }

    update() {
        console.log(this);
    }
}

export default UI;