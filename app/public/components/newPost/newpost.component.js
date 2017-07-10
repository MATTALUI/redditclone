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
  vm.removePost = function(event, post){
    let postNumber = vm.posts.indexOf(post)
    $http.delete(`/api/posts/${post.id}`)
    .then(function(response){
      console.log(response);
      vm.posts.splice(postNumber, 1);
    })
  }
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
  vm.showPosts = function(){
    console.log(vm.posts);
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
  vm.addPost= function(){
    $http.post('/api/posts', vm.newPost)
    .then(function(response){
      response.data.comments = [];
      vm.posts.push(response.data);
    })

    delete vm.newPost;
    vm.makingNew = false;
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
    // $http.get('/api/posts').then(function(yoMomma){
    //   vm.posts = yoMomma.data;
    // });
    postsService.getAllPosts().then(function(post){
      vm.posts = post;
    })
    console.log(postsService);
    vm.sort = '-vote_count';
    vm.makingNew = false;
    // vm.posts= [
    //   {
    //     title: 'Sample post',
    //     vote_count: 4,
    //     commentsVisible: false,
    //     body: 'I ate 49 hotdogs; I feel sick.',
    //     author: 'a hipster',
    //     image: 'https://static.pexels.com/photos/69212/pexels-photo-69212.jpeg',
    //     comments: ['This is a cool sample post, man.', 'meh. I seen better.'],
    //     created_at: new Date()
    //   },
    //   {
    //     title: 'Post by guy #2',
    //     vote_count: 9,
    //     commentsVisible: false,
    //     body: 'Guy #1 is lame',
    //     author: 'guy #2',
    //     image: 'http://lorempixel.com/400/400/',
    //     comments: ['Guy #1 here, I don\'t think that I am lame.', 'you\'re right!'],
    //     created_at: new Date()
    //   }
    // ]
  }
}
}());
