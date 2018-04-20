import React, { Component } from 'react';
import StackGrid from 'react-stack-grid';
import './Photos.css';
import UserStore from '../../stores/UserStore';
import PostsStore from '../../stores/PostsStore';

import conf from '../../conf.js';

class Photos extends Component {
  constructor(props) {
    super();
    this.feed = PostsStore.feed || { postRatingsUser: [], posts: [] };
    this.posts = PostsStore.posts || {};
    this.state = {
      imageIds: [],
    };
    this.handlePostStoreUpdate = this.handlePostStoreUpdate.bind(this);
    this.handleUserStoreUpdate = this.handleUserStoreUpdate.bind(this);
  }

  fetchPosts() {
    PostsStore.searchPosts(this.props.searchObj).then(posts => {
      this.setState(prevstate => {
        prevstate.posts = posts;
        return prevstate;
      });
    });
  }

  componentWillMount() {
    UserStore.on('change', this.handleUserStoreUpdate);
    PostsStore.on('change', this.handlePostStoreUpdate);
    if (!UserStore.loggedin) throw Error('In order to view photos of the user. The user has to be logged in');
    this.compileImages();
    this.fetchPosts();
  }

  componentWillUnmount() {
    UserStore.removeListener('change', this.handleUserStoreUpdate);
    PostsStore.removeListener('change', this.handlePostStoreUpdate);
  }

  handleUserStoreUpdate() {
    this.feed = UserStore.feed || { postRatingsUser: [], posts: [] };
    this.compileImages();
  }

  handlePostStoreUpdate() {
    this.posts = PostsStore.posts || {};
    this.compileImages();
  }

  compileImages() {
    if (!UserStore.loggedin) return;
    let imageIds = Object.values(this.posts).map(p => p.id)
      .concat(this.feed.posts.map(p => p.id))
      .concat(this.feed.postRatingsUser.map(p => p.postid));
    imageIds = imageIds.filter((id, i) => imageIds.indexOf(id) === i);
    this.setState({ imageIds });
  }

  render() {
    if (!UserStore.loggedin) return <div>Not logged in</div>;
    return (
      <div className='Photos'>
        <StackGrid monitorImagesLoaded
          columnWidth={300}>
          {this.state.imageIds.map((id, i) => this.renderImage(id, i))}
        </StackGrid>
      </div>
    );
  }

  renderImage(id, index) {
    return <div className='ImageItem' key={index}>
      <img src={conf.apiurl + '/posts/image/' + id + '.jpg'} alt='' />
    </div>;
  }
}

export default Photos;