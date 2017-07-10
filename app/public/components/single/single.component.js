(function(){
  angular
  .module('app')
  .component('single',{
    controller: singleController,
    templateUrl: 'components/single/single.template.html'
  });
  singleController.$inject = ['$stateParams', 'postsService', '$http'];
  function singleController($stateParams, postsService, $http){
    const vm = this;
    vm.$onInit = function(){
      $http.get('/api/posts').then(function(allPosts){
        const postId = $stateParams.id;
        vm.posts = allPosts.data;
        vm.currentPost = vm.posts.find((post)=>{return post.id == postId});
        console.log(vm.currentPost);
      })
    }
    vm.logSomething = function(){
      console.log(vm.currentPost);
    }
  }
})()
