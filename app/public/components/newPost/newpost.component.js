(function(){
  angular
  .module('app')
  .component('post', {
    templateUrl: `components/newPost/newpost.template.html`,
    controller: postcontroller
})

postcontroller.$inject = ['$http', 'postsService'];
function postcontroller($http, postsService){
  const vm = this;
  vm.removePost = postsService.removePost;
  vm.addPost = postsService.addPost;
  vm.toggleEditing = function(event, post){
    let postNumber = vm.posts.indexOf(post);
    if(vm.posts[postNumber].editing){
      vm.posts[postNumber].editing = false;
    }else{
      vm.posts[postNumber].editing = true;
    }
  }
  vm.updatePost = function(event, post, edit={}){
    let postNumber = vm.posts.indexOf(post);
    vm.toggleEditing(event, post);
    $http.patch(`/api/posts/${post.id}`, edit)
    .then(function(response){
      for(key in response.data){
        vm.posts[postNumber][key] = response.data[key];
      }
    });
  }
  vm.showComments = function(event, post){
    let postNumber = vm.posts.indexOf(post);
    if (vm.posts[postNumber].commentsVisible){
      vm.posts[postNumber].commentsVisible = false;
    }else{
      vm.posts[postNumber].commentsVisible = true;
    }
  }
  vm.upvote = function(event, post){
    let index = vm.posts.indexOf(post)
    // vm.posts[index].vote_count++

    $http.post(`/api/posts/${post.id}/votes`)
    .then(function(response){
      vm.posts[index].vote_count = response.data.vote_count;
    });
  }
  vm.downvote = function(event, post){
    let index = vm.posts.indexOf(post)
    vm.posts[index].vote_count--
    $http.delete(`/api/posts/${post.id}/votes`)
    .then(function(response){
      vm.posts[index].vote_count = response.data.vote_count;
    });
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
  vm.addComment = function(event, post, comment){
    postNumber = vm.posts.indexOf(post);
    $http.post(`/api/posts/${post.id}/comments`, {content: comment})
    .then(function(response){
      vm.posts[postNumber].comments.push(response.data);

    })
    delete vm.newComment;
  }
  vm.editComment=function(event,post, comment, edit){
    let postNumber = vm.posts.indexOf(post)
    let commentNumber = vm.posts[postNumber].comments.indexOf(comment);
    vm.toggleCommentEditor(event, post, comment);
    $http.patch(`/api/posts/${post.id}/comments/${comment.id}`, {content: edit})
    .then(function(response){
      console.log(response);
      vm.posts[postNumber].comments[commentNumber].content = response.data.content;
    });
  }
  vm.deleteComment=function(event,post, comment){
    let postNumber = vm.posts.indexOf(post)
    let commentNumber = vm.posts[postNumber].comments.indexOf(comment);
    $http.delete(`/api/posts/${post.id}/comments/${comment.id}`)
    .then(function(response){
      console.log(response);
      vm.posts[postNumber].comments.splice(commentNumber, 1);
    })
  }
  vm.$onInit = function(){
    postsService.getAllPosts().then(function(post){
      vm.posts = post;
    })
    vm.sort = '-vote_count';
    vm.makingNew = false;
  }
}
}());
