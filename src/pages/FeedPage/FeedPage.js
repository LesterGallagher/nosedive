import React, { Component } from 'react';
import { Route, NavLink, Switch } from 'react-router-dom';
import './FeedPage.css';
import UserStore from '../../stores/UserStore';
import Feed from '../../components/Feed/Feed';
import UserPanel from '../../components/UserPanel/UserPanel';
import Authenticate from '../../components/Authenticate/Authenticate';
import Search from '../../components/Search/Search';
import Posts from '../../components/Posts/Posts';
import FriendsOverview from '../../components/FriendsOverview/FriendsOverview';
import Photos from '../Photos/Photos';
import FeedRatings from '../../components/FeedRatings/FeedRatings';


class FeedPage extends Component {
  constructor(props) {
    super();
    this.state = { loggedin: UserStore.loggedin, user: UserStore.user };

    this.handleUserStoreChange = this.handleUserStoreChange.bind(this);
  }

  componentWillMount() {
    UserStore.on('change', this.handleUserStoreChange);
  }

  componentWillUnmount() {
    UserStore.removeListener('change', this.handleUserStoreChange);
  }

  handleUserStoreChange() {
    this.setState(prevstate => {
      prevstate.loggedin = UserStore.loggedin;
      prevstate.user = UserStore.user;
      return prevstate;
    });
  }

  render() {
    return (
      <div className='FeedPage'>
        {this.state.loggedin ? <div>
          <div className='mainContent'>
            <div className='FeedHeader'>
              <UserPanel userid={this.state.user.id} />
            </div>
            <div className='FeedPageSubMenu pure-menu pure-menu-horizontal'>
              <ul className='pure-menu-list'>
                <li className='pure-menu-item'><NavLink className='pure-menu-link' to='/feed/activity'>Activity</NavLink></li>
                <li className='pure-menu-item'><NavLink className='pure-menu-link' to='/feed/my-posts'>My Posts</NavLink></li>
                <li className='pure-menu-item'><NavLink className='pure-menu-link' to='/feed/photos'>Photos</NavLink></li>
                <li className='pure-menu-item'><NavLink className='pure-menu-link' to='/feed/rated'>Rated</NavLink></li>
                <li className='pure-menu-item'><NavLink className='pure-menu-link' to='/feed/friends'>Friends</NavLink></li>
              </ul>
            </div>
            <Switch>
              <Route exact path='/feed/activity' component={Feed} />
              <Route exact path='/feed/my-posts' render={() => <Posts searchObj={{
                userid: this.state.user.id,
                orderby: 'created',
                orderdir: 'DESC',
              }} />} />
              <Route exact path='/feed/photos' render={() => <Photos searchObj={{
                userid: this.state.user.id,
                orderby: 'created',
                orderdir: 'DESC',
              }} />} />
              <Route exact path='/feed/rated' component={FeedRatings} />
              <Route exact path='/feed/friends' component={FriendsOverview} />
              <Route component={Feed} />
            </Switch>
          </div>
          <aside className='contentAside'>
            <Search redirect='/search' />
          </aside>
        </div> : <Authenticate />}
      </div>
    );
  }
}

export default FeedPage;
