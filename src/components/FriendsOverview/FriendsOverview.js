import React, { Component } from 'react';
import './FriendsOverview.css';
import FriendRequests from '../FriendRequests/FriendRequests';
import Friends from '../Friends/Friends';

class FriendsOverview extends Component {
  constructor(props) {
    super();
    this.state = {
    };

  }

  componentWillMount() {
  }

  componentWillUnmount() {
  }

  render() {
    return (
      <div className='FriendsOverview'>
        <h2>FriendsOverview</h2>
        <h4>Friend requests:</h4>
        <FriendRequests />
        <h4>Friends:</h4>
        <Friends />
      </div>
    );
  }
}

export default FriendsOverview;
