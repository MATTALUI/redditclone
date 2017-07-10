(function(){
  angular
  .module('app')
  .service('postsService', postsService)
  postsService.$inject = ['$http'];
  function postsService($http){
    this.getAllPosts = function(){
       return $http.get('/api/posts').then(function(data){
        var posts = data.data;
        return posts;
      })
    }

  }
})()
