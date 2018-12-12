const Z = (function () {
    const PENDING = 0;
    const FULFILLED = 1;
    const REJECTED = 2;

    function CustomPromise(fn) {
        this.state = PENDING;
        this.value;
        this.thenHandlers = [];
        this.catchHandler;

        function resolve(result) {
            this.state = FULFILLED;
            this.value = result;

            if (this.thenHandlers && this.thenHandlers.length > 0) {
                this.thenHandlers.forEach(callback => {
                    this.value = callback(this.value);
                });
            }
        }

        function reject(error) {
            this.state = REJECTED;
            this.value = error;

            this.catchHandler(this.value);
        }

        this.then = function then(callback) {
            this.thenHandlers.push(callback);
            return this;
        };

        this.catch = function (callback) {
            this.catchHandler = callback;
            return this;
        };

        fn(resolve.bind(this), reject.bind(this));
    }

    return CustomPromise;

})();
