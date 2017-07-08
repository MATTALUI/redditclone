(function(){
  angular
  .module('app')
  .component('single',{
    controller: singleController,
    templateUrl: 'components/single/single.template.html'
  });
  function singleController($stateParams){
    const vm = this;
    vm.$onInit = function(){
      vm.postInfo = $stateParams;
    }
    vm.logPost = function(){
      console.log(vm.postInfo);
    }
  }
})()
