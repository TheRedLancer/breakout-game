class EventHandler {
    constructor() {
        this.events = {}
    }
    subscribe(eventName, callback) {
        if (!this.events[eventName]) {
            this.events[eventName] = [];
        }
        this.events[eventName].push(callback);
    }

    unsubscribe(eventName, callback) {
        if (!this.events[eventName]) return;
        this.events[eventName] = this.events[eventName].filter(cb => cb != callback);
    }

    dispatch(eventName) {
        if (!this.events[eventName]) return;
        this.events[eventName].foreach(cb => cb());
    }
}