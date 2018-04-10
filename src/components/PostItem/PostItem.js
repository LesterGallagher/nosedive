import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import './PostItem.css';
import UserStore from '../../stores/UserStore';
import { strcap } from '../../util';
import UserPanel from '../UserPanel/UserPanel';
import conf from '../../conf.json';

class PostItem extends Component {
  constructor(props) {
    super();
    this.state = {
      loggedin: UserStore.loggedin,
      user: UserStore.user,
      len: props.len || 8,
    };
    this.handleUserChange = this.handleUserChange.bind(this);
  }

  componentWillMount() {
    UserStore.on('change', this.handleUserChange);
  }

  componentWillUnmount() {
    UserStore.removeListener('change', this.handleUserChange);
  }

  handleUserChange() {
    this.setState({ user: UserStore.user, loggedin: UserStore.loggedin });
  }

  render() {
    const post = this.props.post;
    const linkEditClass = this.state.loggedin && this.state.user.id === post.userid ? 'editPost' : 'editPost hidden';
    const postImage = conf.apiurl + '/posts/image/' + post.id + '.jpg';
    return <div className='PostItem'>
      <div className='Helpers'>
        <Link to={'/edit/post/' + post.id} role='button' className={linkEditClass}>
          <i aria-hidden='true' className='material-icons icon edit'>mode_edit</i>
          <span className='sr-only'>(edit)</span>
        </Link>
        <Link to={'/posts/' + post.id} role='button' className='icon open'>
          <i className='material-icons' aria-hidden='true'>exit_to_app</i>
          <span className='sr-only'>(open)</span>
        </Link>
      </div>
      <UserPanel userid={post.userid} />
      <h3 className='title'>{post.name}</h3>
      <span className='description lead'>{strcap(post.description, 120)}</span>
      <img className='PostImage' src={postImage} alt={''} />
      {
        post.avgrating !== null
          ? <div className='rating'>
            <span className='ratingLg'>{post.avgrating.slice(0, 3)}</span>
            <span className='ratingSm'>{post.avgrating.slice(3, 5)}</span>
          </div>
          : <div className='ratingPlaceholder'>no rating</div>
      }
      <small className='Date'>{new Date(this.props.post.created).toLocaleString()}</small>
      <p className='content'>{strcap(post.content, 120)}</p>
    </div>;
  }
}

export default PostItem;
