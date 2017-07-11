(function(){
  angular
  .module('app')
  .service('postsService', postsService);
  postsService.$inject = ['$http', '$state'];
  function postsService($http,$state){
    this.getAllPosts = function(){
       return $http.get('/api/posts').then(function(data){
        var posts = data.data;
        return posts;
      });
    };
    this.addPost = function(){
      var newPost = this.newPost;
      var allPosts = this.posts;
      delete this.newPost;
      this.makingNew = false;
      return $http.post('/api/posts', newPost)
        .then(function(response){
          response.data.comments =[];
          return allPosts.push(response.data);
        });
      };
    this.removePost = function(post){
      var allPosts = this.posts;
      let postNumber = allPosts.indexOf(post);
      return $http.delete(`/api/posts/${post.id}`).then(function(response){
        return allPosts.splice(postNumber, 1);
      });
    };
    this.getSinglePost = function(id){
        return $http.get(`api/posts/${id}`)
        .then(function(response){
          return response.data;
        });
      };
    this.updatePost = function(post){
      return $http.patch(`/api/posts/${post.id}`, post).then(function(){
        $state.go('home');
      });
    };
    this.upvote = function(post){
      let index = this.posts.indexOf(post);
      return $http.post(`api/posts/${post.id}/votes`).then((resp)=>{
        return this.posts[index].vote_count++;
      });
    };
    this.downvote = function(post){
      let index = this.posts.indexOf(post);
      return $http.delete(`api/posts/${post.id}/votes`).then((resp)=>{
        return this.posts[index].vote_count--;
      });
    };
  }
})();
