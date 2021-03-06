// app.js
var app = angular.module('app', ['ui.router', 'ui.bootstrap','infinite-scroll']);

app.config(function($stateProvider, $urlRouterProvider) {
    
    $urlRouterProvider.otherwise('/home');   
    $stateProvider
        .state('home', {
            url: '/home',
            templateUrl: 'explorer_ui/templates/explorertemplates/explorer.html',
			controller: 'homeCtrl'
        })     

         .state('block', {
            url: '/block/:blockNumber',
            templateUrl: 'explorer_ui/templates/explorertemplates/blockdetails.html',
			controller: 'homeCtrl'
        })

          .state('transaction', {
            url: '/transaction/:hash',
            templateUrl: 'explorer_ui/templates/explorertemplates/transactiondetails.html',
			controller: 'homeCtrl'
        });


});


app.run(['$rootScope','$window', function($rootScope, $window) {
	 
$rootScope.loadingHome = true;


          
}]);

  
