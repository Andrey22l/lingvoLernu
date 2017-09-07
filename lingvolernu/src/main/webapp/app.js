var instaApp = angular.module('instaApp', [
    'ui.router',
    'restangular',
    'ngMaterial',
    'ngSocial'
]);


instaApp.config(function($httpProvider) {
       $httpProvider.defaults.useXDomain = true;
       delete $httpProvider.defaults.headers
                .common['X-Requested-With'];
});



instaApp.config(function ($mdThemingProvider) {
    $mdThemingProvider.theme('default')
            .primaryPalette('teal')
            .accentPalette('green');
});

instaApp.config(function ($socialProvider) {
    
    $socialProvider.setFacebookAppId('146893399048200');
    $socialProvider.setInstagramAppId('b94452399d6c45258a294393e6ec0c93');
    $socialProvider.setLinkedinAppId('77qemsru4now91', 'w3T9iJ8vkIa8Y2Fc');
    $socialProvider.initialize();
});


instaApp.config(function ($stateProvider, $urlRouterProvider, $httpProvider, RestangularProvider) {

    RestangularProvider.setBaseUrl("/lingvolernu");

    $stateProvider
            .state('/', {
                url: '/',
                views: {
                    "internalView": {
                        templateUrl: 'pages/login.html',
                        controller: LoginCtrl
                    }
                }
            })
            .state('login', {
                url: '/login',
                views: {
                    "internalView": {
                        templateUrl: 'login.html'
                    }
                }
            })
            .state('error', {
                url: '/error',
                views: {
                    "internalView": {
                        templateUrl: 'pages/error.html'
                    }
                }

            })
            .state('/gallery', {
                url: '/gallery',
                views: {
                    "mainView": {
                        templateUrl: 'pages/gallery.html',
                        controller: GalleryCtrl
                    }
                }
            });

    $urlRouterProvider.otherwise("/");


});






