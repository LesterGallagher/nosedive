import React, { Component } from 'react';
import './Authenticate.css';
import UserStore from '../../stores/UserStore';
import Login from '../../components/Login/Login';
import Register from '../../components/Register/Register';


class Authenticate extends Component {
  constructor(props) {
    super();
    this.state = { loggedin: UserStore.loggedin, actionType: 'login' };

    this.handleuserStoreChange = this.handleuserStoreChange.bind(this);
    this.setActionTypeRegister = this.setActionTypes.bind(this, 'register');
    this.setActionTypeLogin = this.setActionTypes.bind(this, 'login');
  }

  componentWillMount() {
    UserStore.on('change', this.handleuserStoreChange);
  }

  componentWillUnmount() {
    UserStore.removeListener('change', this.handleuserStoreChange);
  }

  handleuserStoreChange() {
    if (!this.state.loggedin && UserStore.loggedin) return; // dont update because the user just authenticated. 
    this.setState(prevstate => {
      prevstate.loggedin = UserStore.loggedin;
      prevstate.user = UserStore.user;
      return prevstate;
    });
  }

  render() {
    return (
      <div className='Authenticate'>
        {this.state.loggedin ? 'You are logged in' : this.renderNotLoggedInOptions()}
      </div>
    );
  }

  setActionTypes(val) {
    this.setState(prevstate => {
      prevstate.actionType = val;
      return prevstate;
    });
  }

  renderNotLoggedInOptions() {
    switch (this.state.actionType) {
      case 'login':
        return <div>
          <Login />
          <div className='authOrWrap'>
            <span className='authOr'>or</span>
          </div>
          <button className='pure-button' onClick={this.setActionTypeRegister}>Register</button>
        </div>;
      case 'register':
        return <div>
          <Register />
          <div className='authOrWrap'>
            <span className='authOr'>or</span>
          </div>
          <button className='pure-button' onClick={this.setActionTypeLogin}>Login</button>
        </div>;
      default: return 'error';
    }

  }
}

export default Authenticate;
