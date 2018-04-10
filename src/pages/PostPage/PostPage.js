import React, { Component } from 'react';
import './PostPage.css';
import PostsStore from '../../stores/PostsStore';
import PostItem from '../../components/PostItem/PostItem';

class PostPage extends Component {
  constructor(props) {
    super();
    this.state = {
      postid: props.match.params.postid,
      post: PostsStore.posts[props.match.params.postid],
    };

    this.handlePostStoreChange = this.handlePostStoreChange.bind(this);
    if (!this.state.post) {
      PostsStore.fetchPost(this.state.postid);
    }
  }

  componentWillMount() {
    PostsStore.on('change', this.handlePostStoreChange);
  }

  componentWillUnmount() {
    PostsStore.removeListener('change', this.handlePostStoreChange);
  }

  handlePostStoreChange() {
    this.setState({ post: PostsStore.posts[this.state.postid] });
  }

  render() {
    if (!this.state.post) return (
      <div className='PostPage'>
        <div className='PostPageLoadingPlaceholder loadingPlaceholder' />
      </div>
    );
    return (
      <div className='PostPage'>
        <PostItem post={this.state.post} />
      </div>
    );
  }
}

export default PostPage;
