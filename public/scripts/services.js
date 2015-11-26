'use strict';

angular.module('angularRestfulAuth')
    .service('Main', ['$http', '$localStorage','$cookies',
        function($http, $localStorage,$cookies){



        return {
           tokShowhide:function(data) {
               if($cookies.get('sid')!=undefined)
                   return  true;
               else
                   return false;
           } ,
            save: function(data, success, error) {
                $http.post('/signup', data).success(success).error(error)
            },
            signin: function(data, success, error) {
                $http.post('/authenticate', data).success(success).error(error)
            },
            me: function(data, success, error) {

                $http.post('/me', data).success(success).error(error)
            },
            logout: function(success,error) {
                $http.post('/merchlogout').success(success).error(error)
            }
        };
    }
    ]);

/*function() {
 if($cookies.get('sid')!=undefined)
 return  true;
 else
 return false;
 }*/