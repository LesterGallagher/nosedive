import React, { Component } from 'react';
import { HashRouter as Router, Route, NavLink, Switch } from 'react-router-dom';

import './App.css';

import FeedPage from './pages/FeedPage/FeedPage';
import UserStore from './stores/UserStore';
import NotFound from './pages/404/NotFound';
import SearchPage from './pages/SearchPage/SearchPage';
import NewPostPage from './pages/NewPostPage/NewPostPage';
import EditPostPage from './pages/EditPostPage/EditPostPage';
import Profile from './pages/Profile/Profile';
import PostPage from './pages/PostPage/PostPage';

const logout = UserStore.logout.bind(UserStore);
class App extends Component {
  render() {
    return (
      <div className='App'>
        <Router>
          <div>
            <main>
              <div className='debugRoutes'>
                <NavLink className='pure-button' to='/'>Feed</NavLink>
                <button className='pure-button' onClick={logout}>Logout</button>
              </div>
              <div className='activeRoute'>
                <Switch>
                  <Route exact path='/' component={FeedPage} />
                  <Route path='/feed' component={FeedPage} />
                  <Route path='/posts/:postid' component={PostPage} />
                  <Route path='/edit/post/:postid' component={EditPostPage} />
                  <Route exact path='/profile/:userid' component={Profile} />
                  <Route exact path='/search' component={SearchPage} />
                  <Route exact path='/new-post' component={NewPostPage} />
                  <Route component={NotFound} />
                </Switch>
              </div>
            </main>
          </div>
        </Router>
      </div>
    );
  }
}

export default App;
