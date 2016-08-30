var app = angular.module('redeApp', ['ngRoute', 'ngStorage']);

var API = 'http://127.0.0.1:8000/api/';

// app.service('AccountService', function($localStorage) {
//     return {
//         isAuthorized: () => $localStorage.isAuthorized
//     };
// });

app.controller('LoginController', ($localStorage, $scope, $rootScope, $location) => {
    $scope.logIn = () => {
        $.ajax({
            type: 'POST',
            url: API + 'auth/jwt/login/',
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify({
                username: $scope.username,
                password: $scope.password
            }),
            success: (data) => {
                $localStorage.token = data.token;
                Materialize.toast('Hello!', 5000);
                $localStorage.isAuthorized = true;
                $rootScope.$emit('auth:changed', true);
                $rootScope.$apply(() => $location.path('/'));
            },
            error: () => {
                Materialize.toast('Login failed. Please check your credentials.', 5000);
            }
        });
    };
});

app.controller('MenuController', ($localStorage, $scope, $rootScope, $location) => {
    $scope.isAuthorized = $localStorage.isAuthorized;

    var loadData = () => {
        if ($scope.isAuthorized) {
            $.ajax({
                type: 'GET',
                url: API + 'subscriptions/subscriptions/',
                contentType: 'application/json',
                dataType: 'json',
                beforeSend: (xhr) => xhr.setRequestHeader('Authorization', 'JWT ' + $localStorage.token),
                success: (data) => {
                    $scope.$apply(() => $scope.subscriptions = data);
                }
            });
        }
    };

    $scope.logOut = () => {
        $localStorage.token = null;
        Materialize.toast('Goodbye!', 5000);
        $localStorage.isAuthorized = false;
        $rootScope.$emit('auth:changed', false);
        $location.path('/');
    };

    $rootScope.$on('auth:changed', (e, newValue) => {
        $scope.isAuthorized = newValue;

        if (newValue) {
            loadData();
        }
    });

    loadData();
});

app.config(($routeProvider) => {
    $routeProvider.when('/', {
        // controller: 'WelcomeController',
        templateUrl: 'views/welcome.html'
    }).when('/login', {
        controller: 'LoginController',
        templateUrl: 'views/login.html'
    }).otherwise({
        redirectTo: '/'
    });
});

app.config(($locationProvider) => {
    $locationProvider.html5Mode(true);
});

$(window).ready(() => {
    $('.nav-menu-button').sideNav({
        closeOnClick: true
    });
});
