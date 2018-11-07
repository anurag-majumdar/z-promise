const EventEmitter = (function () {

    const events = {};

    class EventEmitter {

        subscribe(eventName, eventHandler) {
            if (!events[eventName]) {
                events[eventName] = [];
            }
            events[eventName].push(eventHandler);
        }

        unsubscribe(eventName) {
            if (events[eventName]) {
                delete events[eventName];
            }
        }

        publish(eventName, data) {
            if (events[eventName]) {
                events[eventName].forEach(eventHandler => {
                    eventHandler(data);
                });
            }
        }

    }

    return EventEmitter;

})();