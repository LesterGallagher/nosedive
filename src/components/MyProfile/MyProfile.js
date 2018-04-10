import React, { Component } from 'react';
import './MyProfile.css';
import EditUser from '../EditUser/EditUser';
import UserStore from '../../stores/UserStore';

class MyProfile extends Component {
  constructor(props) {
    super();
    this.state = {
      loggedin: UserStore.loggedin,
      user: UserStore.loggedin ? this.createUserEditTemplate(UserStore.user) : null,
      userEdits: {},
    };
    this.handleUserStoreChange = this.handleUserStoreChange.bind(this);
    this.handleUserEdit = this.handleUserEdit.bind(this);
    this.editUser = this.editUser.bind(this);
  }

  createUserEditTemplate(user) {
    return {
      id: user.id, // for image loading
      _t: user._t, // for image loading
      fname: user.fname,
      mname: user.mname,
      lname: user.lname,
      email: user.email,
      description: user.description,
      avatar: user.avatar,
      username: user.username
    };
  }

  componentWillMount() {
    UserStore.on('change', this.handleUserStoreChange);
  }

  componentWillUnmount() {
    UserStore.removeListener('change', this.handleUserStoreChange);
  }

  handleUserStoreChange() {
    // dont set on content change because it might reset the users changes
    if (UserStore.loggedin && this.state.loggedin && this.state.user.id === UserStore.user.id) return;
    this.setState({ loggedin: UserStore.loggedin, user: this.createUserEditTemplate(UserStore.user) });
  }

  render() {
    return (
      <div className='MyProfile'>
        <form method='POST' className='pure-form pure-form-stacked' onSubmit={this.editUser}>
          {this.state.loggedin
            ? <div><EditUser user={this.state.user} onChange={this.handleUserEdit} />
              <button type='submit' className='pure-button'>Update</button>
            </div>
            : 'Not logged in.'}
        </form>
      </div>
    );
  }

  handleUserEdit(userEdits) {
    this.setState({ userEdits });
  }

  editUser(e) {
    if (!UserStore.loggedin) {
      alert('Sorry you are not logged in anymore');
      return;
    }
    e.preventDefault();
    const { id, email, password } = UserStore.user;
    UserStore.updateUser(id, email, password, this.state.userEdits)
      .then(user => {
        this.setState({ user, userEdits: {} });
        alert('Succesfully updated user');
      })
      .catch(err => {
        console.error(err);
        alert('Error while updating user');
      });
  }
}

export default MyProfile;
