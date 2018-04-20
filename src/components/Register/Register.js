import React, { Component } from 'react';
import './Register.css';
import UserStore from '../../stores/UserStore';
import ReCAPTCHA from 'react-google-recaptcha';

import conf from '../../conf.js';

const validFileType = file => {
  return /image\/(jpg|jpeg|png|gif|bmp)$/i.test(file.type);
};

class Register extends Component {
  constructor(props) {
    super();
    this.state = {
      loggedin: UserStore.loggedin,
      user: UserStore.user,
      registeremail: '',
      registerpwd: '',
      registerusername: '',
      registerfname: '',
      registermname: '',
      registerlname: '',
      registeravatar: '',
      avatarUrl: null,
    };

    this.handleUserStoreChange = this.handleUserStoreChange.bind(this);
    this.register = this.register.bind(this);
    this.handleImageChange = this.handleImageChange.bind(this);
    this.handleRecaptchaChange = this.handleRecaptchaChange.bind(this);
    this.handleRegisterEmailChange = this.handleRegisterEmailChange.bind(this);
    this.handleRegisterfnameChange = this.handleRegisterfnameChange.bind(this);
    this.handleRegisterlnameChange = this.handleRegisterlnameChange.bind(this);
    this.handleRegistermnameChange = this.handleRegistermnameChange.bind(this);
    this.handleRegisterPasswordChange = this.handleRegisterPasswordChange.bind(this);
    this.handleRegisterUsernameChange = this.handleRegisterUsernameChange.bind(this);
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
      <div className='Register'>
        {this.state.loggedin ? 'Already logged in' : this.renderRegister()}
      </div>
    );
  }
  renderRegister() {
    return <form method='POST' className='pure-form pure-form-stacked' onSubmit={this.register}>
      <input value={this.state.registeremail}
        onChange={this.handleRegisterEmailChange}
        required type='email' maxLength='200' placeholder='Your email' />
      <input value={this.state.registerfname}
        onChange={this.handleRegisterfnameChange}
        required type='text' maxLength='200' placeholder='First name' />
      <input value={this.state.registermname}
        onChange={this.handleRegistermnameChange}
        type='text' maxLength='200' placeholder='Middle name' />
      <input value={this.state.registerlname}
        onChange={this.handleRegisterlnameChange}
        required type='text' maxLength='200' placeholder='Last name' />
      <span className='usernameCopy'>@</span><input className='inputUsername' value={this.state.registerusername}
        onChange={this.handleRegisterUsernameChange}
        required type='text' minLength='3' maxLength='200' placeholder='Your username' />
      <input value={this.state.registerPwd}
        onChange={this.handleRegisterPasswordChange}
        required type='password' minLength='6' maxLength='200' placeholder='Your password' />
      <label htmlFor='edit-post-form-image'>Image</label>
      <div className='image'>
        {this.state.avatarUrl
          ? this.renderImage()
          : this.renderFileInput()}</div>
      <ReCAPTCHA
        ref='recpatcha'
        sitekey={conf.recaptchaSiteKey}
        onChange={this.handleRecaptchaChange} />
      <button className='pure-button' type='submit'>Register</button>
    </form>;
  }
  handleRecaptchaChange(value) {
    this.setState({ recaptcha: value });
  }

  handleRegisterEmailChange(e) {
    this.setState({ registeremail: e.target.value });
  }

  handleRegisterPasswordChange(e) {
    this.setState({ registerpwd: e.target.value });
  }

  handleRegisterUsernameChange(e) {
    this.setState({ registerusername: e.target.value });
  }

  handleRegisterfnameChange(e) {
    this.setState({ registerfname: e.target.value });
  }

  handleRegistermnameChange(e) {
    this.setState({ registermname: e.target.value });
  }

  handleRegisterlnameChange(e) {
    this.setState({ registerlname: e.target.value });
  }

  handleImageChange(e) {
    const file = e.target.files && e.target.files[0];
    if (file) {
      // add file
      if (!validFileType(file)) {
        return alert('Image is not a valid file type. Please use .jpg, .jpeg, .png, .gif or .bmp');
      }
      const reader = new FileReader();
      reader.onload = (e2) => {
        this.setState(prevstate => {
          prevstate.registeravatar = file;
          prevstate.avatarUrl = e2.target.result;
          return prevstate;
        }, () => {
          if (this.props.onChange) this.props.onChange(this.state.post);
        });
      };
      reader.readAsDataURL(file);
    } else {
      // remove file
      this.setState(prevstate => {
        prevstate.registeravatar = null;
        prevstate.imageUrl = null;
        return prevstate;
      }, () => {
        if (this.props.onChange) this.props.onChange(this.state.post);
      });
    }
  }

  register(event) {
    event.preventDefault();
    if (!window.grecaptcha.getResponse()) {
      alert('Recaptcha was not checked');
      return;
    }
    UserStore.createUser({
      'g-recaptcha-response': this.state.recaptcha,
      email: this.state.registeremail,
      password: this.state.registerpwd,
      username: this.state.registerusername,
      fname: this.state.registerfname,
      mname: this.state.registermname,
      description: this.state.registerdescription,
      avatar: this.state.registeravatar,
    }).then(() => {
      alert('success');
      window.grecaptcha.reset();
      this.setState(prevstate => {
        prevstate.registerusername = '';
        prevstate.registerpwd = '';
        prevstate.registeremail = '';
        return prevstate;
      });
    }).catch(err => {
      console.error(err);
      window.grecaptcha.reset();
      alert('Could not create an account');
    });
  }

  renderImage(isSmallRes = false) {
    return <div className='ImagePreview'>
      <figure className='AvatarImage' style={{ backgroundImage: `url("${this.state.avatarUrl}")` }} />
      {isSmallRes ? <strong className='alert alert-warning' /> : ''}
      <a onClick={this.removeImage} className='rmImage' role='button'>
        <span aria-hidden='true' className='icon trash' />
        <span className='sr-only'>(remove)</span>
      </a>
    </div>;
  }

  removeImage() {
    this.setState(prevstate => {
      prevstate.registeravatar = null;
      prevstate.avatarUrl = null;
      return prevstate;
    }, () => {
      if (this.props.onChange) this.props.onChange(this.state.post);
    });
  }

  renderFileInput() {
    return <div className='imageInput'>
      <button type='button' className='pure-button'>Upload Image</button>
      <input onChange={this.handleImageChange} type='file'
        accept='image/*' id='edit-post-form-image' name='image' />
    </div>;
  }
}

export default Register;
