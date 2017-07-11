(function(){
  angular
  .module('app')
  .component('post', {
    templateUrl: `components/newPost/newpost.template.html`,
    controller: postcontroller
})

postcontroller.$inject = ['$http', 'postsService', 'commentsService'];
function postcontroller($http, postsService, commentsService){
  const vm = this;
  vm.removePost = postsService.removePost;
  vm.addPost = postsService.addPost;
  vm.upvote = postsService.upvote;
  vm.downvote = postsService.downvote;
  vm.showComments = function(event, post){
    let postNumber = vm.posts.indexOf(post);
    if (vm.posts[postNumber].commentsVisible){
      vm.posts[postNumber].commentsVisible = false;
    }else{
      vm.posts[postNumber].commentsVisible = true;
    }
  }
  vm.checkSort = function(){
    switch (vm.sort){
      case '-vote_count':
        return 'Votes'
        break;
      case 'Date':
        return 'date';
        break;
      case 'title':
      return 'Title';
        break;
    }
  }
  vm.toggle = function(){
    if (vm.makingNew){
      vm.makingNew = false;
    }else{
      vm.makingNew = true;
    }
  }
  vm.toggleCommentEditor= function(event, post, comment){
    let postNumber = vm.posts.indexOf(post)
    let commentNumber = vm.posts[postNumber].comments.indexOf(comment);
    if (vm.posts[postNumber].comments[commentNumber].editing){
      vm.posts[postNumber].comments[commentNumber].editing=false;
    }else{
      vm.posts[postNumber].comments[commentNumber].editing=true;
    }
  }
  vm.addComment = commentsService.addComment;
  vm.editComment=function(post, comment, edit){
    let postNumber = vm.posts.indexOf(post)
    let commentNumber = vm.posts[postNumber].comments.indexOf(comment);
    vm.toggleCommentEditor(event, post, comment);
    $http.patch(`/api/posts/${post.id}/comments/${comment.id}`, {content: edit})
    .then(function(response){
      vm.posts[postNumber].comments[commentNumber].content = response.data.content;
    });
  }
  vm.deleteComment = commentsService.deleteComment;
  // vm.deleteComment=function(event,post, comment){
  //   let postNumber = vm.posts.indexOf(post)
  //   let commentNumber = vm.posts[postNumber].comments.indexOf(comment);
  //   $http.delete(`/api/posts/${post.id}/comments/${comment.id}`)
  //   .then(function(response){
  //     console.log(response);
  //     vm.posts[postNumber].comments.splice(commentNumber, 1);
  //   })
  // }
  vm.$onInit = function(){
    postsService.getAllPosts().then(function(post){
      vm.posts = post;
    })
    vm.sort = '-vote_count';
    vm.makingNew = false;
  }
}
}());
