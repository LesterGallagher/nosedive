import React, { Component } from 'react';
import './EditPostPage.css';
import UserStore from '../../stores/UserStore';
import Authenticate from '../../components/Authenticate/Authenticate';
import PostsStore from '../../stores/PostsStore';
import EditPost from '../../components/EditPost/EditPost';

class EditPostPage extends Component {
  constructor(props) {
    super();
    this.state = {
      loggedin: UserStore.loggedin,
      user: UserStore.user,
      postid: props.match.params.postid,
      post: PostsStore.posts[props.match.params.postid],
    };
    this.handleUserStoreChange = this.handleUserStoreChange.bind(this);
    this.handlePostStoreChange = this.handlePostStoreChange.bind(this);
    if (this.state.post === undefined) {
      PostsStore.posts[this.state.postid] = null;
      PostsStore.fetchPost(this.state.postid);
    }
  }


  componentWillMount() {
    UserStore.on('change', this.handleUserStoreChange);
    PostsStore.on('change', this.handlePostStoreChange);
  }

  componentWillUnmount() {
    UserStore.removeListener('change', this.handleUserStoreChange);
    PostsStore.removeListener('change', this.handlePostStoreChange);
  }

  handleUserStoreChange() {
    this.setState({ loggedin: UserStore.loggedin, user: UserStore.user });
  }

  handlePostStoreChange() {
    this.setState({ post: PostsStore.posts[this.state.postid] }, () => {
      if (this.state.post === undefined) {
        PostsStore.posts[this.state.postid] = null;
        PostsStore.fetchPost(this.state.postid);
      }
    });
  }


  render() {
    if (!this.state.loggedin) return <div className='EditPostPage'><Authenticate /></div>;
    if (!this.state.post) return <div className='EditPostPage'><div className='loadingPost' /></div>;
    return (
      <div className='EditPostPage'>
        <form method='POST' encType='multipart/form-data' className='pure-form pure-form-stacked' onSubmit={this.handleSubmitNewPost.bind(this)}>
          EditPostPage Component {this.state.postid}
          <EditPost post={this.state.post} onChange={this.handlePostChange.bind(this)} />
          <pre><code>{JSON.stringify(this.state.post, null, 4)}</code></pre>
          <button className='pure-button' type='submit'>Submit</button>
        </form>
      </div>
    );
  }

  handleSubmitNewPost(event) {
    console.log('submitting', this.state.post);
    event.preventDefault();
    if (!UserStore.loggedin) throw Error('Bug: New post page is being shown to the user without the user being logged in.');
    PostsStore.updatePost(this.state.postid, this.state.post, UserStore.user.email, UserStore.user.password)
      .then(result => {

        console.log('update result', result);
        alert('succesfully updated post');
        this.props.history.goBack();
      })
      .catch(err => {
        console.error(err);
        alert('Unable to update post');
      });
    // PostsStore.createPost(this.state.post, UserStore.user.email, UserStore.user.password)
    // .then(result => {
    //     alert('Created post');
    //     this.props.history.goBack();
    // })
    // .catch(err => {
    //     alert('Unable to create post');
    // });
  }

  handlePostChange(post) {
    this.setState({ post });
  }
}

export default EditPostPage;
