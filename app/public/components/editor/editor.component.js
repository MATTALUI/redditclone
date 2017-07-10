(function(){
  angular
  .module('app')
  .component('edit',{
    templateUrl: '/components/editor/editor.template.html',
    controller: editorController
  });
  editorController.$inject = ['$http', '$stateParams'];
  function editorController($http, $stateParams){
    const vm = this;
    vm.$onInit = function(){
      $http.get('/api/posts').then(function(allPosts){
        const postId = $stateParams.id;
        vm.posts = allPosts.data;
        vm.currentPost = vm.posts.find((post)=>{return post.id == postId});
      })
    }
  }
})()
