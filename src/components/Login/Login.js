import React, { Component } from 'react';
import './Login.css';
import UserStore from '../../stores/UserStore';

class Login extends Component {
  constructor(props) {
    super();
    const loginemail = (window.localStorage && window.localStorage.loginemail) || '';
    const loginpwd = (window.localStorage && window.localStorage.loginpwd || '');
    this.state = {
      loggedin: UserStore.loggedin,
      user: UserStore.user,
      loginemail,
      loginpwd,
    };
    this.handleUserStoreChange = this.handleUserStoreChange.bind(this);
    this.handleLoginEmailChange = this.handleLoginEmailChange.bind(this);
    this.handleLoginPasswordChange = this.handleLoginPasswordChange.bind(this);
    this.login = this.login.bind(this);
  }

  componentWillMount() {
    UserStore.on('change', this.handleUserStoreChange);
  }

  componentWillUnmount() {
    UserStore.removeListener('change', this.handleUserStoreChange);
  }

  handleUserStoreChange() {
    if (!this.state.loggedin && UserStore.loggedin) return; // dont update because the user just authenticated. 
    this.setState(prevstate => {
      prevstate.loggedin = UserStore.loggedin;
      prevstate.user = UserStore.user;
      return prevstate;
    });
  }

  render() {
    return (
      <div className='Login'>
        {this.state.loggedin ? 'Already logged in' : this.renderLogin()}
      </div>
    );
  }
  renderLogin() {
    return <form method='POST' className='pure-form  pure-form-stacked' onSubmit={this.login}>
      <input value={this.state.loginemail}
        onChange={this.handleLoginEmailChange}
        type='email' required placeholder='Your email' />
      <input value={this.state.loginpwd}
        onChange={this.handleLoginPasswordChange}
        type='password' minLength='6' maxLength='200' required placeholder='Your password' />
      <button className='pure-button' type='submit'>Login</button>
    </form>;
  }
  handleLoginEmailChange(e) {
    this.setState({ loginemail: e.target.value });
  }

  handleLoginPasswordChange(e) {
    this.setState({ loginpwd: e.target.value });
  }
  login(event) {
    event.preventDefault();
    event.target.reset();
    UserStore.login(this.state.loginemail, this.state.loginpwd)
      .then(x => {
        if(window.localStorage) window.localStorage.loginemail = this.state.loginemail;
        if(window.localStorage) window.localStorage.loginpwd = this.state.loginpwd;
      }).catch(err => {
        console.error('Unable to login', err);
        alert(`Unable to login: ${err.message}`);
      });
  }
}

export default Login;
