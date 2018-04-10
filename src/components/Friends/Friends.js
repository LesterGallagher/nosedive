import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import UserStore from '../../stores/UserStore';
import './Friends.css';

import conf from '../../conf.json';

class Friends extends Component {
  constructor(props) {
    super();
    this.state = {
      friends: UserStore.friends,
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
    this.setState({ friends: UserStore.friends });
  }

  render() {
    if (!this.state.friends) return <ul className='Friends list-unstyled' />;
    return (
      <ul className='Friends list-unstyled'>
        {Object.values(this.state.friends).map((f, i) => this.renderFriendItem(f, i))}
      </ul>
    );
  }

  renderFriendItem(item, index) {
    const avatarUrl = `url("${conf.apiurl}/users/avatar/${item.friendid}.jpg")`;
    return <li className='FriendItem' key={index}>
      <Link to={'/profile/' + item.friendid}>
        <div className='AvatarPicture' style={{ backgroundImage: avatarUrl }} />
        <div className='Username'>@{item.friendusername}</div>
      </Link>
    </li>;
  }
}

export default Friends;
