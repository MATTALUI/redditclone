(function() {
  'use strict';
  angular.module('app').config(config)
  config.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider']
  function config($stateProvider, $urlRouterProvider, $locationProvider){
    $locationProvider.html5Mode(true)
    $stateProvider
      .state({name: 'home', url: '/', component: 'post'})
      .state({name: 'editor', url: '/posts/:id/edit', component: 'edit'})
      .state({name: 'single', url: '/posts/:id', component: 'single'})


  }
}());
