import React, { Component } from 'react';
import './FriendRequests.css';
import { Link } from 'react-router-dom';
import UserStore from '../../stores/UserStore';

import conf from '../../conf.json';

class FriendRequests extends Component {
  constructor(props) {
    super();
    this.state = {
      friendRequests: UserStore.friendRequests,
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
    this.setState({ friendRequests: UserStore.friendRequests });
  }

  render() {
    if (!this.state.friendRequests) return <ul className='Friends list-unstyled' />;
    return (
      <ul className='Friends list-unstyled'>
        {Object.values(this.state.friendRequests).map((f, i) => this.renderFriendRequestItem(f, i))}
      </ul>
    );
  }

  renderFriendRequestItem(item, index) {
    const acceptFriendship = () => this.updateFriendship(item.friendid, true);
    const rejectFriendship = () => this.updateFriendship(item.friendid, false);
    const avatarUrl = `url("${conf.apiurl}/users/avatar/${item.friendid}.jpg")`;
    return <li className='FriendItem' key={index}>
      <Link to={'/profile/' + item.friendid}>
        <div className='AvatarPicture' style={{ backgroundImage: avatarUrl }} />
        <div className='Username'>@{item.friendusername}</div>
      </Link>
      <button onClick={acceptFriendship} className='pure-button'>Accept <i className='material-icons'>person_add</i></button>
      <button onClick={rejectFriendship} className='pure-button'>Reject <i className='material-icons'>not_interested</i></button>
    </li>;
  }

  updateFriendship(friendid, accepted) {
    UserStore.updateFriendship(friendid, accepted)
      .catch(err => {
        console.error(err);
        alert(`Unable to ${accepted ? 'accept' : 'reject'} friendship: ${err.message}`);
      });
  }
}

export default FriendRequests;
