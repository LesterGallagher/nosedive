import { EventEmitter } from 'events';
import Axios, * as axios from 'axios';
import * as conf from '../conf.json';
import { encodeIntoQuery, toFormData } from '../util';
import PostsStore from './PostsStore';

class UserStore extends EventEmitter {

  constructor() {
    super();
    this.user = null;
    this.loggedin = false;
    this.feed = null;
    this.users = {};
    this.friends = {};
    this.friendRequests = {};
    this.friendRequestsInvites = {};
  }

  getFeed() {
    if (this.loggedin) {
      return axios.post(conf.apiurl + '/users/feed', {
        email: this.user.email,
        password: this.user.password
      })
        .then(res => {
          this.feed = res.data;
          this.feed.posts.forEach(x => PostsStore.posts[x.id] = x);
          PostsStore.emit('change');

          this.emit('change');
          return res.data;
        });
    }
  }

  createUser(user) {
    return axios.post(conf.apiurl + '/users', toFormData(user))
      .then(res => {
        this.user = user;
        this.users[user.id] = user;
        return res.data.rows[0].id;
      });

  }
  logout() {
    this.loggedin = false;
    this.user = null;
    this.feed = null;
    this.emit('change');
  }

  login(email, password) {
    this.getFeed();
    return axios.post(conf.apiurl + '/users/valid-creds', { email, password })
      .then(res => {
        this.loggedin = true;
        this.user = res.data;
        this.user.password = password;

        this.emit('change');
        this.getFeed();
        this.fetchUserRelations();
        return res.data;
      });
  }
  fetchUser(id) {
    this.users[id] = null;
    return axios.get(conf.apiurl + '/users/' + id)
      .then(res => {
        this.users[id] = res.data.rows[0] || null;
        this.emit('change');
        return res.data.rows[0];
      });
  }
  searchUser(q, orderby = 'joined', orderdir = 'DESC', strictsearch = false) {
    const userQ = {};
    ['fname', 'mname', 'mname', 'username'].forEach(x => userQ[x] = q);
    return axios.get(conf.apiurl + '/users/q' + encodeIntoQuery(Object.assign({ orderby, orderdir, strictsearch }, userQ)))
      .then(res => {
        res.data.rows.forEach(x => { this.users[x.id] = x; });
        this.emit('change');
        return res.data.rows;
      });
  }
  updateUser(id, email, password, props) {
    const payload = {
      email: email,
      password: password,
      newemail: props.email,
      newpassword: props.password,
      fname: props.fname,
      mname: props.mname,
      lname: props.lname,
      username: props.username,
      description: props.description,
      avatar: props.avatar,
    };
    return axios.put(conf.apiurl + '/users/', toFormData(payload)).then(res => {
      if (props.avatar) props._t = new Date().getTime();
      if (this.users[id]) {
        Object.assign(this.users[id], props);
      }
      if (this.user) this.user = Object.assign(this.user, props);
      this.emit('change');
      return this.user;
    });
  }
  fetchUserRelations() {
    if (!this.loggedin) throw Error('You have to be loggedin to get friendships');
    return axios.get(conf.apiurl + '/friendships/' + this.user.id)
      .then(res => {
        const relations = res.data.rows;
        relations.forEach(friendship => {
          if (friendship.acceptedfriend && !friendship.accepteduser) this.friendRequests[friendship.friendid] = friendship;
          else if (friendship.acceptedfriend && friendship.accepteduser) this.friends[friendship.friendid] = friendship;
          else if (!friendship.acceptedfriend && friendship.accepteduser) this.friendRequestsInvites[friendship.friendid] = friendship;
        });
        this.emit('change');
      }).catch(err => {
        console.error('unable to fetch relations', err);
      });
  }

  createFriendRequest(friendid) {
    if (!this.loggedin) throw Error('You have to be logged in to create friend requests');
    const payload = {
      email: this.user.email,
      password: this.user.password,
      friendid,
    };
    return Axios.post(`${conf.apiurl}/friendships`, payload);
  }

  updateFriendship(friendid, accepted) {
    if (!this.loggedin) throw Error('You have to be logged in to send reply to a friend request');
    const payload = {
      email: this.user.email,
      password: this.user.password,
      friendid,
      accepted,
    };
    // not accepting a friendship will delete that relation from the database
    return Axios.put(`${conf.apiurl}/friendships`, payload).then(() => {
      if (accepted) {
        this.friends[friendid] = this.friendRequests[friendid];
        if(this.friendRequests[friendid]) delete this.friendRequests[friendid];
      } else {
        if (this.friendRequests[friendid]) delete this.friendRequests[friendid];
        else if (this.friends[friendid]) delete this.friends[friendid];
      }
      this.emit('change');
    });
  }
}

export default new UserStore();
