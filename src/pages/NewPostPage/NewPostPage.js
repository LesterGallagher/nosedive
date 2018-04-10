import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import './NewPostPage.css';
import EditPost from '../../components/EditPost/EditPost';
import PostsStore from '../../stores/PostsStore';
import UserStore from '../../stores/UserStore';
import Authenticate from '../../components/Authenticate/Authenticate';


class NewPostPage extends Component {
  constructor(props) {
    super();
    this.state = {
      post: {
        name: '',
        description: '',
        content: '',
      },
      loggedin: UserStore.loggedin,
      user: null,
    };
    this.handleUserStoreChange = this.handleUserStoreChange.bind(this);
  }


  componentWillMount() {
    UserStore.on('change', this.handleUserStoreChange);
  }

  componentWillUnmount() {
    UserStore.removeListener('change', this.handleUserStoreChange);
  }

  handleUserStoreChange() {
    this.setState({ loggedin: UserStore.loggedin, user: UserStore.user });
  }

  render() {
    if (!this.state.loggedin) return <Authenticate />;
    return (
      <div className='NewPostPage'>
        <form method='POST' encType='multipart/form-data' className='pure-form pure-form-stacked' onSubmit={this.handleSubmitNewPost.bind(this)}>
          <h2>Write Post</h2>
          <EditPost onChange={this.handlePostChange.bind(this)} post={this.state.post} />
          <pre><code>{JSON.stringify(this.state.post, null, 4)}</code></pre>
          <button className='pure-button' type='submit'>Submit</button>
        </form>
      </div>
    );
  }

  handleSubmitNewPost(event) {
    event.preventDefault();
    alert(`submit ${JSON.stringify(this.state.post, null, 4)}`);
    if (!UserStore.loggedin) throw Error('Bug: New post page is being shown to the user without the user being logged in.');
    PostsStore.createPost(this.state.post, UserStore.user.email, UserStore.user.password)
      .then(result => {
        alert('Created post');
        this.props.history.goBack();
      })
      .catch(err => {
        alert('Unable to create post');
      });
  }

  handlePostChange(post) {
    this.setState({ post });
  }
}

export default withRouter(NewPostPage);
