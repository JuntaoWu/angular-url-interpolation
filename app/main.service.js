
//%s/url: {\n.*pattern: \(.*\)\(\_.\{-}\)}/url: \1 \2/g
(function () {
    'use strict';

    angular
        .module('mainApp')
        .service('MainService', MainService);

    MainService.$inject = ['$http'];
    function MainService($http) {
        this.exposedFn = exposedFn;

        ////////////////

        function exposedFn() {
            var req = {
                url: "/api/{hello}",
                params: {
                    hello: "hello",
                    others: ""
                }
            }
            return $http(req);
        }
    }
})();
