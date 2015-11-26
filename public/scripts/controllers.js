'use strict';

/* Controllers */

angular.module('angularRestfulAuth')
    .controller('HomeCtrl',
        function($rootScope, $scope, $location, $localStorage, Main,$cookies, $timeout) {

        $scope.signin = function() {
            var formData = {
                email: $scope.email,
                password: $scope.password
            };
            Main.signin(formData, function (res) {
                if (res.type == false) {
                    alert(res.data)
                } else {
                    console.log("insignin");
                    $cookies.put('email', res.data.email);

                    window.location = "/me";
                    $cookies.put('sid', res.token);
                    // $scope.$broadcast('scanner-started', { tok: true });
                }
            }, function () {
                $rootScope.error = 'Failed to signin';
            });
        };

        $scope.logout = function() {
            Main.logout(function(res) {
                if(res) {
                    $cookies.remove('sid');
                    $location.path("/login");
                    $scope.tok=false;
                }
            }, function() {
                alert("Failed to logout!");
            });
        };
         //   $scope.tok =tok1;
        $scope.signup = function() {
            var formData = {
                email: $scope.email,
                password: $scope.password
            };

            Main.save(formData, function(res) {
                if (res.type == false) {
                    alert(res.data)
                } else {
                    console.log("token save"+res.data.token);
                    $cookies.put('email',res.data.email);
                    $cookies.put('sid',res.token);
                    $location.path( "/me" );
                }
            }, function() {
                $rootScope.error = 'Failed to signup';
            });

        };
            $scope.$on("count p", function(event, data){
                   $scope.tok=data.val;
                console.log($scope.tok);
            });


    })

.controller('meCtrl',
        function($rootScope,$localStorage, $scope, $location, Main,$cookies,$route) {
            $scope.$parent.$broadcast("count p",
                {val:true}
            );

        var localemail = {email:$cookies.get('email')};
        Main.me(localemail, function(res) {
            $scope.myDetails = res;
        }, function() {
            $rootScope.error = 'Failed to fetch details';
        })
});
//  $localStorage.token = res.data.token;
//  $localStorage.localemail = res.data.email;
/*  $scope.$on("count p", function(event, message){
 $scope.tok=message.tok;
 $scope.$broadcast("count p", function(event, message){
 var tok=Main.tokShowhide();
 });
 });*/
/*   $scope.$watch(', function(value){
 if($scope.tok===true)
 //  $timeout(callAtInterval, 3000);
 $scope.tok=Main.tokShowhide();
 console.log("fff"+$scope.tok);
 },true);
 $scope.$on('scanner-started', function(event, args) {
 //
 a=args.b;
 });*/
