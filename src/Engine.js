import EventHandler from "./EventHandler";
import InputListener from "./InputListener";
import Machine from "./Machine";

class GameEngine {
    constructor() {
        this.eventHandler = new EventHandler()
        this.machine = new Machine();
        this.inputListener = new InputListener();
    }

    vector3ToString(vec) {
        return "(" + vec.x + ", " + vec.y + ", " + vec.z + ")";
    }
}

const Engine = new GameEngine();

export default Engine;