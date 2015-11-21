'use strict';

/**
 * @ngdoc function
 * @name zoomcarApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the zoomcarApp
 */
angular.module('zoomcarApp')
    .controller('MainCtrl', function($http, $state, $rootScope, localStorageService) {
        this.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];

        var main = this;
        main.hide = [];
        var i;

        main.openProduct = function(parcel, index) {
            main.hide[index] = !main.hide[index];
            main.parcel = parcel;

            $rootScope.index = index;
            main.etaDate = new Date(parseInt(parcel.date))
            initialize(parcel.live_location);
            var parcelData = localStorageService.get(parcel.name);
            if (parcelData == undefined) {
                main.likeCount = 0;
            } else {
                main.likeCount = parcelData.like
            }
            for (i = 0; i < main.list_parcel.length; i++) {
                if (index != i) {
                    main.hide[i] = false;
                }
            }
        }

        function initialize(live_location) {
            var mapProp = {
                center: new google.maps.LatLng(live_location.latitude, live_location.longitude),
                zoom: 12,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            var map = new google.maps.Map(document.getElementById("googleMap"), mapProp);

            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(live_location.latitude, live_location.longitude)
            });

            marker.setMap(map);
        }

        main.refresh = function() {
            $http.get('http://zoomcar-ui.0x10.info/api/courier?type=json&query=api_hits')
                .success(function(data, status) {
                    main.api_hit = data.api_hits;
                });

            $http.get('https://zoomcar-ui.0x10.info/api/courier?type=json&query=list_parcel')
                .success(function(data, status) {
                    var index = $rootScope.index
                    main.list_parcel = data.parcels;

                    for (i = 0; i < main.list_parcel.length; i++) {
                        main.hide[i] = false;
                    }

                    if (index <= main.list_parcel.length) {
                        main.openProduct(data.parcels[index], index)
                    } else {
                        main.openProduct(data.parcels[0], 0)
                    }


                });

        }

        main.orderBy = function(criteria) {
            main.orderByKey = criteria;
        }


        main.like = function(parcel) {

            var parcelData = localStorageService.get(parcel.name);
            if (parcelData != undefined) {
                parcel.like = parcelData.like + 1;
            } else {
                parcel.like = 1;

            }
            localStorageService.set(parcel.name, parcel)
            main.likeCount = parcel.like
        }

        $http.get('http://zoomcar-ui.0x10.info/api/courier?type=json&query=api_hits')
            .success(function(data, status) {
                main.api_hit = data.api_hits;
            });

        $http.get('https://zoomcar-ui.0x10.info/api/courier?type=json&query=list_parcel')
            .success(function(data, status) {

                main.list_parcel = data.parcels;

                for (i = 0; i < main.list_parcel.length; i++) {
                    main.hide[i] = false;
                }
                main.openProduct(data.parcels[0], 0)

            });

        main.share = function(parcel) {

            FB.ui({
                method: 'feed',
                link: parcel.link,
                caption: parcel.name,
                picture: parcel.image
            }, function(response) {});
        }
    });