import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './UserPanel.css';
import UserStore from '../../stores/UserStore';

import conf from '../../conf.js';

class UserPanel extends Component {
  constructor(props) {
    super();
    this.state = { user: UserStore.users[props.userid], userid: props.userid };

    this.handleUserPanelChange = this.handleUserPanelChange.bind(this);
    this.handleUserInvite = this.handleUserInvite.bind(this);
  }

  componentWillMount() {
    UserStore.on('change', this.handleUserPanelChange);
    if (this.state.user === undefined) {
      UserStore.users[this.state.userid] = null; // going to fetch user so set to null
      UserStore.fetchUser(this.state.userid);
    }
  }

  componentWillUnmount() {
    UserStore.removeListener('change', this.handleUserPanelChange);
  }

  handleUserPanelChange() {
    if (this.state.userid !== undefined) {
      this.setState(prevstate => {
        prevstate.user = UserStore.users[this.state.userid]
          ? UserStore.users[this.state.userid]
          : null;
        return prevstate;
      });
    }
  }

  render() {
    const _t = (this.state.user && this.state.user._t && '?t=' + this.state.user._t) || '';
    return (
      <div className='UserPanel'>
        <Link to={`/profile/${this.state.userid}`}>
          <figure className='ProfilePicture' style={{ backgroundImage: `url("${conf.apiurl}/users/avatar/${this.state.userid}.jpg${_t}")` }} />
          {this.state.user
            ? <h2 className='ProfileTitle'>
              <span className='Profilefname'>{this.state.user.fname}</span>
              <span className='Profilemname'> {this.state.user.mname} </span>
              <span className='Profilelname'>{this.state.user.lname}</span>
            </h2>
            : <div className='ProfileTitlePlaceholder' />
          }
          {
            this.getRating() !== null
              ? <span className='rating'>
                <span className='ratingLg'>{this.getRating().slice(0, 3)}</span>
                <span className='ratingSm'>{this.getRating().slice(3, 5)}</span>
              </span>
              : <span className='rating ratingNone'>no rating</span>
          }
          {this.state.user
            ? <h5 className='ProfileUsername'>&copy;{this.state.user.username}</h5>
            : <span className='ProfileUsernamePlaceholder' />
          }
        </Link>
        {this.shouldDisplayFriendInviteButton()
          ? <button className={'UserInvite pure-button' + (this.state.isinviting ? ' loading' : '')} onClick={this.handleUserInvite}>
            Friend invite
            <i className='material-icons invite-icon'>person_add</i>
            <i className='loadingIcon' />
          </button>
          : ''
        } {/* TODO Add another button to confirm or reject invite if their is a pending invite */}
      </div>
    );
  }

  handleUserInvite() {
    UserStore.createFriendRequest(this.state.userid).catch(err => err).then(x => this.state.isinviting = false);
    this.state.isinviting = true;
  }

  shouldDisplayFriendInviteButton() {
    return UserStore.loggedin && UserStore.user.id !== this.state.userid && UserStore.friendRequestsInvites[UserStore.user.id] === undefined
      && UserStore.friendRequests[UserStore.user.id] === undefined
      && UserStore.friends[UserStore.user.id] === undefined;
  }

  getRating() {
    if (this.state.user && !isNaN(parseFloat(this.state.user.avgreceivedrating)))
      return this.state.user.avgreceivedrating.trim();
    return null;
  }

}

export default UserPanel;
