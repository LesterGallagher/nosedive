import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './Feed.css';
import UserStore from '../../stores/UserStore';

import conf from '../../conf.json';
import { strcap } from '../../util';

class Feed extends Component {
  constructor(props) {
    super();
    this.state = {

      feed: UserStore.feed ? this.createPostsFeed(UserStore.feed)
        .sort((a, b) => new Date(b.created) - new Date(a.created)) : null,
      len: props.len || 8
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
    if (UserStore.feed) {
      this.setState(prevstate => {
        prevstate.feed = this.createPostsFeed(UserStore.feed)
          .sort((a, b) => new Date(b.created) - new Date(a.created));
        return prevstate;
      });
    }
  }

  createPostsFeed(f) {
    return [].concat([], f.posts.map(x => Object.assign({ type: 'post' }, x)));
  }

  render() {
    if (!this.state.feed) return <div className='Feed' />;
    return (
      <div className='Feed'>
        {this.state.feed.slice(0, this.state.len).map((x, i) => this.renderFeedItem(x, i))}
      </div>
    );
  }

  renderFeedItem(item, index) {
    switch (item.type) {
      case 'post':
        return this.renderPostItem(item, index);
    }
  }

  renderPostItem(item, index) {
    const avatarUrl = `url("${conf.apiurl}/users/avatar/${item.userid}.jpg")`;
    const postImage = `${conf.apiurl}/posts/image/${item.id}.jpg`;
    const linkEditClass = this.state.loggedin && this.state.user.id === item.userid ? 'editPost' : 'editPost hidden';
    return <div className='FeedItem FeedPostItem' key={index}>
      <div className='User'>
        <Link to={'/profile/' + item.userid}>
          <div className='AvatarPicture' style={{ backgroundImage: avatarUrl }} />
          <div className='Username'>@{item.username}</div>
        </Link>
      </div>
      <div className='Helpers'>
        <Link to={'/edit/post/' + item.id} role='button' className={linkEditClass}>
          <i aria-hidden='true' className='material-icons icon edit'>mode_edit</i>
          <span className='sr-only'>(edit)</span>
        </Link>
        <Link to={'/posts/' + item.id} role='button' className='icon open'>
          <i className='material-icons' aria-hidden='true'>exit_to_app</i>
          <span className='sr-only'>(open)</span>
        </Link>
        <Link to={'/profile/' + item.userid} role='button' className='icon user'>
          <i className='material-icons' aria-hidden='true'>account_circle</i>
          <span className='sr-only'>(user)</span>
        </Link>
      </div>
      <div className='Post'>
        <div className='PostName'>{strcap(item.name, 40)}</div>
        {item.userid === UserStore.user.id
          ? <Link className='EditPost' to={'/edit/post/' + item.id}>
            <i aria-hidden='true' className='material-icons icon edit'>mode_edit</i><span className='sr-only'>(edit)</span>
          </Link>
          : ''}
        <img className='PostImage' src={postImage} alt={''} />
        <div className='PostDescription'>{strcap(item.description, 100)}</div>
        <div className='PostContent'>{strcap(item.content, 120)}</div>
        <small className='PostCreated'>{new Date(item.created).toLocaleString()}</small>
      </div>
    </div>;
  }

}

export default Feed;
