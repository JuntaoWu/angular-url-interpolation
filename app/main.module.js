(function () {
    'use strict';

    let app = angular.module('mainApp', [

    ]);

    app.factory('urlInterceptor', function () {
        return {
            request: function (config) {
                console.log(config);
                config.url = interpolateUrl(config.url, config.params, config.data);
                return config;
            }
        };
        function interpolateUrl(url, params, data) {
            // Make sure we have an object to work with - makes the rest of the
            // logic easier.
            params = (params || {});
            data = (data || {});
            // Strip out the delimiter fluff that is only there for readability
            // of the optional label paths.
            url = url.replace(/(\(\s*|\s*\)|\s*\|\s*)/g, "");
            // Replace each label in the URL (ex, :userID).
            url = url.replace(
                /:([a-z]\w*)/gi,
                function ($0, label) {
                    // NOTE: Giving "data" precedence over "params".
                    return (popFirstKey(data, params, label) || "");
                }
            );

            // Replace each {label} in the URL (ex, {userID}).
            url = url.replace(
                /{([a-z]\w*)}/gi,
                function($0, label) {
                    return (popFirstKey(data, params, label) || "");
                }
            )

            // Strip out any repeating slashes (but NOT the http:// version).
            url = url.replace(/(^|[^:])[\/]{2,}/g, "$1/");
            // Strip out any trailing slash.
            url = url.replace(/\/+$/i, "");
            return (url);
        }

        // I take 1..N objects and a key and perform a popKey() action on the
        // first object that contains the given key. If other objects in the list
        // also have the key, they are ignored.
        function popFirstKey(object1, object2, objectN, key) {
            // Convert the arguments list into a true array so we can easily
            // pluck values from either end.
            var objects = Array.prototype.slice.call(arguments);
            // The key will always be the last item in the argument collection.
            var key = objects.pop();
            var object = null;
            // Iterate over the arguments, looking for the first object that
            // contains a reference to the given key.
            while (object = objects.shift()) {
                if (object.hasOwnProperty(key)) {
                    return (popKey(object, key));
                }
            }
        }

        // I delete the key from the given object and return the value.
        function popKey(object, key) {
            var value = object[key];
            //todo: determine if we need to delete the param in object as we may reuse the param here.
            //delete (object[key]);
            return (value);
        }
    });

    app.config(['$locationProvider', '$compileProvider', '$httpProvider',
        function ($locationProvider, $compileProvider, $httpProvider) {
            $locationProvider.html5Mode({
                enabled: true,
                requireBase: false
            });

            //if (window.prod) {
            $compileProvider.debugInfoEnabled(true);
            //}

            $httpProvider.useApplyAsync(true);

            $httpProvider.interceptors.push('urlInterceptor');
        }]);

    app.run(function initialize($rootScope) {
        console.log("Initialize");

        $rootScope.$on('$stateChangeStart', function (scope, state) {
            console.log(state);
        });

        $rootScope.$on('$stateChangeSuccess', function (scope, state) {
            console.log(state);
            $rootScope.routeName = state.name;
        });

    });
})();