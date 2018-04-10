import React, { Component } from 'react';

import './Posts.css';
import PostsStore from '../../stores/PostsStore';
import UserStore from '../../stores/UserStore';
import PostItem from '../PostItem/PostItem';

// { 
//     userid: this.state.userid, 
//     orderBy: 'created', 
//     orderDir: 'DESC' 
// }


class Posts extends Component {
  constructor(props) {
    super();
    this.state = {
      loggedin: UserStore.loggedin,
      user: UserStore.user,
      posts: [],
      len: props.len || 8,
    };
    this.handleUserChange = this.handleUserChange.bind(this);
  }

  componentWillMount() {
    this.fetchPosts();
    UserStore.on('change', this.handleUserChange);
  }

  componentWillUnmount() {
    UserStore.removeListener('change', this.handleUserChange);
  }

  handleUserChange() {
    this.setState({ user: UserStore.user, loggedin: UserStore.loggedin });
  }

  fetchPosts() {
    const orderby = this.props.orderby;
    const orderdir = this.props.orderdir;
    PostsStore.searchPosts(this.props.searchObj).then(posts => {
      this.setState(prevstate => {
        prevstate.posts = posts;
        return prevstate;
      });
    });
  }

  render() {
    return (
      <ul className='Posts list-unstyled'>
        {this.state.posts.map((entry, i) => <li key={i}><PostItem post={entry} /></li>)}
      </ul>
    );
  }
}

export default Posts;
