import React, { Component } from 'react';
import './OtherProfile.css';
import conf from '../../conf.js';
import UserStore from '../../stores/UserStore';
import { deltaTime } from '../../util';
import Stars from '../Stars/Stars';
import { pushRating } from '../../global';

class OtherProfile extends Component {
  constructor(props) {
    super();
    this.state = {
      userid: props.userid,
      otherUser: UserStore.users[props.userid],
      loggedin: UserStore.loggedin,
    };
    this.handleUserStoreChange = this.handleUserStoreChange.bind(this);

    if (UserStore.users[props.userid] === undefined) {
      this.state.otherUser = null;
      UserStore.fetchUser(this.state.userid);
    }

    this.onRated = this.onRated.bind(this);
  }

  componentWillMount() {
    UserStore.on('change', this.handleUserStoreChange);
  }

  componentWillUnmount() {
    UserStore.removeListener('change', this.handleUserStoreChange);
  }

  handleUserStoreChange() {
    this.setState({ loggedin: UserStore.loggedin, otherUser: UserStore.users[this.state.userid] }, () => {
      if (this.state.otherUser === undefined) {
        UserStore.users[this.state.userid] = null; // fetching
        UserStore.fetchUser(this.state.userid);
      }
    });
  }

  render() {
    const _t = (this.state.otherUser && this.state.otherUser._t && '?t=' + this.state.otherUser._t) || '';
    return (
      <div className='OtherProfile'>
        <figure className='ProfilePicture' style={{ backgroundImage: `url("${conf.apiurl}/users/avatar/${this.state.userid}.jpg${_t}")` }} />
        {
          this.getRating() !== null
            ? <span className='rating'>
              <span className='ratingLg'>{this.getRating().slice(0, 3)}</span>
              <span className='ratingSm'>{this.getRating().slice(3, 5)}</span>
            </span>
            : <span className='rating ratingNone'>no rating</span>
        }
        {this.state.otherUser
          ? <h2 className='ProfileTitle'>
            <span className='Profilefname'>{this.state.otherUser.fname}</span>
            <span className='Profilemname'>{this.state.otherUser.mname}</span>
            <span className='Profilelname'>{this.state.otherUser.lname}</span>
          </h2>
          : <div className='ProfileTitlePlaceholder' />
        }
        {this.state.otherUser
          ? <div>
            <Stars stars={0} readonly={!this.state.loggedin} onFinish={this.onRated} />
            <h5 className='ProfileUsername'>&copy;{this.state.otherUser.username}</h5>
            <div className='ProfileJoinedSince'>joined {deltaTime(new Date(this.state.otherUser.joined))}, &nbsp;
              {new Date(this.state.otherUser.joined).toLocaleDateString()}</div>
            <div className='ProfileRole'>role: {this.state.otherUser.role}</div>
            <div className='ProfileDescription'>{this.state.otherUser.description}</div>
          </div>
          : <div>
            <span className='ProfileUsernamePlaceholder' />
            <div className='ProfileJoinedSincePlaceholder' />
            <div className='ProfileRolePlaceholder' />
            <div className='ProfileDescriptionPlaceholder' />
          </div>
        }
      </div>
    );
  }

  onRated(stars) {
    pushRating(this.state.otherUser.id, stars)
      .then(result => {
        alert(`Succesfully gave ${this.state.otherUser.username} a ${stars} star rating.`);
      }).catch(err => {
        alert('Failed to submit rating');
      });
  }

  getRating() {
    if (this.state.otherUser && !isNaN(parseFloat(this.state.otherUser.avgreceivedrating)))
      return this.state.otherUser.avgreceivedrating.trim();
    return null;
  }
}

export default OtherProfile;
