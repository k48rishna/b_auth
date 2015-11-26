'use strict';

angular.module('angularRestfulAuth', [
    'ngStorage',
    'ngRoute',
    'angular-loading-bar',
    'ngCookies'
])
.config(['$routeProvider', '$httpProvider','$locationProvider', function ($routeProvider, $httpProvider,$locationProvider) {

    $routeProvider.
        when('/', {
            templateUrl: 'partials/home.html',
            controller: 'HomeCtrl'
        }).
        when('/signin', {
            templateUrl: 'partials/signin.html',
            controller: 'HomeCtrl'
        }).
        when('/signup', {
            templateUrl: 'partials/signup.html',
            controller: 'HomeCtrl'
        }).
        when('/me', {
            templateUrl: 'partials/me.html',
            controller: 'meCtrl'
        }).
        otherwise({
            redirectTo: '/'
        });
        $locationProvider.html5Mode(true);

    $httpProvider.interceptors.push(['$q', '$location', '$cookies', function($q, $location,$cookies) {
            return {
                'request': function (config) {
                    config.headers = config.headers || {};

                        var a ={b:$cookies.get('sid')};
                        var emailid = {email :$cookies.get('email')};

                        config.headers.Authorization = emailid.email+ ' ' + a.b;
                        console.log(config.headers.Authorization);

                    return config;
                },
                'responseError': function(response) {
                    if(response.status === 401 || response.status === 403) {
                        $location.path('/signin');
                    }
                    return $q.reject(response);
                }
            };
        }]);

    }
]);