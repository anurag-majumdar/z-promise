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

new Z(function timeoutChain1(resolve, reject) {

    setTimeout(() => resolve(1), 1000);

}).then(function timeoutChain2(result) {

    alert(result); // 1
    return result * 2;

}).then(function timeoutChain3(result) {

    alert(result); // 2
    return result * 2;

}).then(function timeoutChain4(result) {

    alert(result); // 4
    return result * 2;

});


function get(url) {
    return new Z(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url);

        xhr.onload = function () {
            resolve(xhr.response);
        };

        xhr.onerror = function () {
            reject(Error('Network Error!'))
        };

        xhr.send();
    });
}

get('https://anurag-majumdar.github.io/search-hub/')
    .then(response => {
        console.log(response);
    }).then(result => {
        console.log(result);
    }).then(response => {
        console.log(Error('Shit!'));
    }).catch(error => {
        console.log(error);
    });