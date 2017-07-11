(function(){
  angular.module('app').service('commentsService', commentsService);
  commentsService.$inject = ['$http', '$state'];
  function commentsService($http, $state){
    this.editComment = function(post, comment, edit){

    };
    this.addComment = function(post, comment){
      let postNumber = this.posts.indexOf(post);
      return $http.post(`/api/posts/${post.id}/comments`, {content: comment}).then((response)=>{
        return this.posts[postNumber].comments.push(response.data);
      });
    };
    this.deleteComment = function(post, comment){
      let postNumber = this.posts.indexOf(post);
      let commentNumber = this.posts[postNumber].comments.indexOf(comment);
      return $http.delete(`/api/posts/${post.id}/comments/${comment.id}`).then((response)=>{
        return this.posts[postNumber].comments.splice(commentNumber, 1);
      });
    };
  }
}());
