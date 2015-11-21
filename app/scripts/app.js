'use strict';

/**
 * @ngdoc overview
 * @name zoomcarApp
 * @description
 * # zoomcarApp
 *
 * Main module of the application.
 */
angular
    .module('zoomcarApp', ['ngMaterial', 'ui.router', 'angular-loading-bar', 'LocalStorageModule'])
    .run(['$state',
        function($state) {
            $state.go('main')
        }
    ])
    .config(['$stateProvider', 'cfpLoadingBarProvider',
        function($stateProvider, cfpLoadingBarProvider) {
            $stateProvider
                .state('main', {
                    url: "/main",
                    templateUrl: "views/main.html",
                    controller: 'MainCtrl',
                    controllerAs: 'main'
                });
            cfpLoadingBarProvider.spinnerTemplate = '<div id="loading-bar-spinner"><i class="fa fa-spinner fa-spin fa-3x"></i></div>';
        }


    ]);