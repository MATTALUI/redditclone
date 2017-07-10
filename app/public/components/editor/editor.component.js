(function(){
  angular
  .module('app')
  .component('edit',{
    templateUrl: '/components/editor/editor.template.html',
    controller: editorController
  });
  editorController.$inject = ['$http', '$stateParams', 'postsService'];
  function editorController($http, $stateParams, postsService){
    const vm = this;
    vm.$onInit = function(){
      postsService.getSinglePost($stateParams.id).then(function(response){
        vm.currentPost = response;
      })

    }
    vm.updatePost = postsService.updatePost;
  }
})()
