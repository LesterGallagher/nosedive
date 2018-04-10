import React, { Component } from 'react';
import './Lander.css';
import UserStore from '../../stores/UserStore';
import Login from '../../components/Login/Login';
import Register from '../../components/Register/Register';
import Authenticate from '../../components/Authenticate/Authenticate';


class Lander extends Component {
  constructor(props) {
    super();
    this.state = { loggedin: UserStore.loggedin, actionType: 'login', user: UserStore.user };

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
      <div className='Lander'>
        {this.state.loggedin ? <div>
          lander
        </div> : <Authenticate />}
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
          --- or ---
          <button className='pure-button' onClick={this.setActionTypes.bind(this, 'register')}>Register</button>
        </div>;
      case 'register':
        return <div>
          <Register />
          --- or ---
          <button className='pure-button' onClick={this.setActionTypes.bind(this, 'login')}>Login</button>
        </div>;
      default: return 'error';
    }

  }
}

export default Lander;
