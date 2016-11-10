(function() {
'use strict';

    angular
        .module('mainApp')
        .controller('MainController', MainController);

    MainController.$inject = ['$scope', '$http'];
    function MainController($scope, $http) {
        this.$scope = $scope;
        this.$http = $http;

        var vm = this;
        
        vm.title = "Title";
        
        activate();

        ////////////////

        function activate() { }
    }

    MainController.prototype.request = function() {
        this.$http({
            url: 'bower.json/:id/{id}/',
            params: {
                id: 'hello',
                other: 'hahaha'
            }
        });
    };

})();