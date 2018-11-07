const eventEmitter = new EventEmitter();

const Z = (function () {

    const PENDING = 0;
    const FULFILLED = 1;
    const REJECTED = 2;

    function CustomPromise(fn) {
        let state = PENDING;
        let value = null;
        let handlers = [];

        function execute() {
            try {
                fn(resolve, reject);
            } catch (ex) {
                console.log(ex);
            }
        }

        function resolve(result) {
            let doResolve = getResolve(result);
            while (doResolve) {
                value = doResolve();
                if (!value.then) {
                    break;
                }
            }
            if (result && !result.then) {
                value = result;
            }
            state = FULFILLED;
        }

        // function getThen(result) {
        //     let resultType = typeof result;
        //     if (resultType === 'function') {
        //         return result.then;
        //     } else {
        //         return null;
        //     }
        // }

        function getResolve(result) {
            let resultType = typeof result;
            if (resultType === 'object' || resultType === 'function') {
                return result.doResolve;
            } else {
                return null;
            }
        }

        function reject(error) {
            state = REJECTED;
            value = error;
        }

        this.doResolve = function doResolve() {
            execute();
            return value;
        };

        this.then = function then(fnResult, fnError) {
            execute();

            if (state === PENDING) {
                // eventEmitter.subscribe('pending', function (resolvedData) {
                //     return new Z((resolve, reject) => {
                //         resolve(fnResult(resolvedData));
                //     });
                // });

                return new Z(function (resolve, reject) {
                    resolve(handlers.push(function (resolvedData) {
                        value = fnResult(resolvedData);
                        return new Z((resolve, reject) => {
                            resolve(value);
                        });
                    }));
                });

            } else if (state === FULFILLED) {
                // eventEmitter.publish('pending', value);
                if (handlers.length === 0) {
                    value = fnResult(value);
                    return new Z((resolve, reject) => {
                        resolve(value);
                    });
                } else {
                    while (handlers.length > 0) {
                        const handler = handlers.shift();
                        handler(value);
                    }
                }
            } else if (state === REJECTED) {
                value = fnError(value);
                return new Z((resolve, reject) => {
                    reject(value);
                });
            }
        };

    }

    return CustomPromise;

})();

// Z Prototype (Synchronous)
const sundae = 'icecream';

const nestedSundaePromise = new Z(function nestedSundaePromise(resolve, reject) {
    resolve({
        ans: 'Nested Promise: Ice Cream Day'
    });
});

const sundaePromise = new Z(function sundaePromise(resolve, reject) {
    if (sundae === 'icecream') {
        resolve(nestedSundaePromise);
    } else {
        reject('No Ice Cream day!!!');
    }
});

sundaePromise.then(result => {

    console.log(result);
    return 2;

}, err => {
    console.log(err);
}).then(result2 => {

    console.log(result2);

});

// // Actual Promise Behaviour

// const nestedSat2Promise = new Promise((resolve, reject) => {
//     resolve('Nested 2 Promise: Ice Cream Day');
// });

// const nestedSatPromise = new Promise((resolve, reject) => {
//     resolve(nestedSat2Promise);
// });

// const satPromise = new Promise((resolve, reject) => {
//     if (sundae === 'icecream') {
//         resolve(nestedSatPromise);
//     } else {
//         reject('No Ice Cream day!!!');
//     }
// });

// // satPromise.then(result => {
// //     console.log(result);
// // }, err => {
// //     console.log(err);
// // });

// console.log(satPromise.then(result => {
//     console.log(result);
// }, err => {
//     console.log(err);
// }));


// Z Prototype (Asynchronous)
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