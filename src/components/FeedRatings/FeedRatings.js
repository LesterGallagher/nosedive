import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import './FeedRatings.css';
import UserStore from '../../stores/UserStore';
import Stars from '../Stars/Stars';
import { strcap } from '../../util';
import conf from '../../conf.js';

class FeedRatings extends Component {
  constructor(props) {
    super();
    this.state = {
      ratings: UserStore.feed ? this.createRatingsFeed(UserStore.feed, props.len || 8)
        .sort((a, b) => new Date(b.created) - new Date(a.created)) : null,
      len: props.len || 8,
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
        prevstate.ratings = this.createRatingsFeed(UserStore.feed);
        return prevstate;
      });
    }
  }

  render() {
    if (!UserStore.loggedin) throw Error('Can not display feed ratings when not logged in');
    if (!this.state.ratings) return <div className='Feed' />;
    return (
      <div className='FeedRatings'>
        {this.state.ratings.slice(0, this.state.len).map((x, i) => this.renderFeedItem(x, i))}
      </div>
    );
  }

  createRatingsFeed(f) {
    return [].concat([], f.userReceiverRatings.map(x => Object.assign({ type: 'userReceiverRating' }, x)))
      .concat([], f.userSenderRatings.map(x => Object.assign({ type: 'userSenderRatings' }, x)))
      .concat([], f.postRatingsUser.map(x => Object.assign({ type: 'postRatingsUser' }, x)))
      .concat([], f.postRatedUser.map(x => Object.assign({ type: 'postRatedUser' }, x)))
      .sort((a, b) => new Date(b.created) - new Date(a.created));
  }

  renderFeedItem(item, index) {
    switch (item.type) {
      case 'userReceiverRating':
        return this.renderReceivedRatings(item, index);
      case 'userSenderRatings':
        return this.renderSentRatings(item, index);
      case 'postRatingsUser':
        return this.renderPostRating(item, index);
      case 'postRatedUser':
        return this.renderPostRatedUser(item, index);
      default:
        throw new Error('no feed item type: ' + item.type);
    }
  }

  // the user recieved a rating
  renderReceivedRatings(item, index) {
    const avatarUrl = `url("${conf.apiurl}/users/avatar/${item.senderid}.jpg")`;
    return <div className='ReceivedRating FeedItem' key={index}>
      <Link to={'/profile/' + item.senderid}>
        <div className='AvatarPicture' style={{ backgroundImage: avatarUrl }} />
        <p className='from'>@{strcap(item.username, 120)} rated you.</p>
      </Link>
      <Stars readonly stars={item.rating} />
      <p className='created Date'>{new Date(item.created).toLocaleString()}</p>
      <div className='Helpers'>
        <Link to={'/profile/' + item.senderid} className='pure-button'>User <i className='material-icons'>account_circle</i></Link>
      </div>
    </div>;
  }

  // the user rated another user
  renderSentRatings(item, index) {
    const avatarUrl = `url("${conf.apiurl}/users/avatar/${item.userid}.jpg")`;
    return <div className='SentRating FeedItem' key={index}>
      <Link to={'/profile/' + item.userid}>
        <div className='AvatarPicture' style={{ backgroundImage: avatarUrl }} />
        <p className='to'>You rated @{strcap(item.username, 120)}.</p>
      </Link>
      <Stars readonly stars={item.rating} />
      <p className='created Date'>{new Date(item.created).toLocaleString()}</p>
      <div className='Helpers'>
        <Link to={'/profile/' + item.userid} className='pure-button'>User <i className='material-icons'>account_circle</i></Link>
      </div>

    </div>;
  }

  // the user rated another post
  renderPostRating(item, index) {
    const avatarUrl = `url("${conf.apiurl}/users/avatar/${item.userid}.jpg")`;
    return <div className='PostRating FeedItem' key={index}>
      <Link to={'/profile/' + item.userid}>
        <div className='AvatarPicture' style={{ backgroundImage: avatarUrl }} />
        <p className='name'>You rated the post "{strcap(item.name, 200)}" from user "@{strcap(item.username, 60)}".</p>
      </Link>
      <Stars readonly stars={item.rating} />
      <div className='Date created'>{new Date(item.created).toLocaleString()}</div>
      <div className='Helpers'>
        <Link to={'/profile/' + item.userid} className='pure-button'>User <i className='material-icons'>account_circle</i></Link>
        <Link to={'/posts/' + item.id} className='pure-button'>Post <i className='material-icons'>panorama</i></Link>
      </div>
    </div>;
  }

  // post from user was rated by other user
  renderPostRatedUser(item, index) {
    const avatarUrl = `url("${conf.apiurl}/users/avatar/${item.senderid}.jpg")`;
    return <div className='FeedItem PostRatedUser' key={index}>
      <Link to={'/profile/' + item.senderid}>
        <div className='AvatarPicture' style={{ backgroundImage: avatarUrl }} />
        <p className='OtherUser'>Your post "{item.name}" was rated by @{strcap(item.username, 120)}.</p>
      </Link>
      <Stars readonly stars={item.rating} />
      <div className='Date created'>{new Date(item.created).toLocaleString()}</div>
      <div className='Helpers'>
        <Link to={'/profile/' + item.senderid} className='pure-button'>User <i className='material-icons'>account_circle</i></Link>
        <Link to={'/posts/' + item.id} className='pure-button'>Post <i className='material-icons'>panorama</i></Link>
      </div>
    </div>;
  }
}

export default FeedRatings;
