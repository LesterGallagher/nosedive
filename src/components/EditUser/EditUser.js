import React, { Component } from 'react';
import './EditUser.css';
import conf from '../../conf.js';

const validFileType = file => {
  return /image\/(jpg|jpeg|png|gif|bmp)$/i.test(file.type);
};

class EditUser extends Component {
  constructor(props) {
    super();
    const _t = (props.user && props.user._t && '?t=' + props.user._t) || '';
    this.state = {
      avatarUrl: `${conf.apiurl}/users/avatar/${props.user.id}.jpg${_t}`,
      user: props.user,
      userEdits: {},
    };
    this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handleFirstNameChange = this.handleFirstNameChange.bind(this);
    this.handleImageChange = this.handleImageChange.bind(this);
    this.handleImageError = this.handleImageError.bind(this);
    this.handleMiddleNameChange = this.handleMiddleNameChange.bind(this);
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.removeImage = this.removeImage.bind(this);

    if (!props.user) throw Error('The property user of EditUser is required and cannot be falsy');
  }

  render() {
    return (
      <div className='EditUser'>
        <label htmlFor='edit-user-form-username'>Username</label>
        <input onChange={this.handleUsernameChange} value={this.state.user.username} id='edit-user-form-username' name='username'
          type='text' required minLength='3' maxLength='200' className='editUsername' />

        <label htmlFor='edit-user-form-fname'>First name</label>
        <input onChange={this.handleFirstNameChange} value={this.state.user.fname} id='edit-user-form-fname' name='fname'
          type='text' required maxLength='200' className='editUserFname' />
        <label htmlFor='edit-user-form-mname'>Middle name</label>
        <input onChange={this.handleMiddleNameChange} value={this.state.user.mname} id='edit-user-form-mname' name='mname'
          type='text' maxLength='200' className='editUserMname' />
        <label htmlFor='edit-user-form-lname'>Last name</label>
        <input onChange={this.handleLastNameChange} value={this.state.user.lname} id='edit-user-form-lname' name='lname'
          type='text' required maxLength='200' className='editUserLname' />
        <input onChange={this.handleEmailChange} value={this.state.user.email} id='edit-user-form-email' name='email'
          type='email' required maxLength='200' className='editUserEmail' />

        <label htmlFor='edit-user-form-avatar'>Avatar</label>
        <div className='avatar'>
          {this.state.avatarUrl
            ? this.renderImage()
            : this.renderFileInput()}</div>
        <label htmlFor='edit-user-form-description'>Description</label>
        <textarea onChange={this.handleDescriptionChange} value={this.state.user.description} id='edit-user-form-description' rows='10'
          name='description' type='text' className='editDescription' />
      </div>
    );
  }

  renderImage() {
    return <div className='AvatarPreview'>
      <div className='AvatarImage' style={{ backgroundImage: `url("${this.state.avatarUrl}")` }} />
      <a onClick={this.removeImage} className='rmImage' role='button'>
        <i aria-hidden='true' className='icon trash material-icons'>delete</i>
        <span className='sr-only'>(remove)</span>
      </a>
    </div>;
  }

  handleImageError() {
    this.setState({ avatarUrl: null });
  }

  removeImage() {
    this.setState(prevstate => {
      prevstate.user.avatar = null;
      prevstate.userEdits.avatar = null;
      prevstate.avatarUrl = null;
      return prevstate;
    }, () => {
      if (this.props.onChange) this.props.onChange(this.state.userEdits);
    });
  }

  renderFileInput() {
    return <div className='imageInput'>
      <button type='button' className='pure-button'>Upload Image</button>
      <input onChange={this.handleImageChange} type='file'
        accept='image/*' id='edit-user-form-image' name='avatar' />
    </div>;
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
          prevstate.user.avatar = file;
          prevstate.userEdits.avatar = file;
          prevstate.avatarUrl = e2.target.result;
          return prevstate;
        }, () => {
          if (this.props.onChange) this.props.onChange(this.state.userEdits);
        });
      };
      reader.readAsDataURL(file);
    } else {
      // remove file
      this.setState(prevstate => {
        prevstate.user.avatar = null;
        prevstate.userEdits.avatar = null;
        prevstate.avatarUrl = null;
        return prevstate;
      }, () => {
        if (this.props.onChange) this.props.onChange(this.state.userEdits);
      });
    }
  }

  handleUsernameChange(e) {
    var val = e.target.value;
    this.setState(prevstate => {
      prevstate.user.username = val;
      prevstate.userEdits.username = val;
      return prevstate;
    }, () => {
      if (this.props.onChange) this.props.onChange(this.state.userEdits);
    });
  }

  handleDescriptionChange(e) {
    var val = e.target.value;
    this.setState(prevstate => {
      prevstate.user.description = val;
      prevstate.userEdits.description = val;
      return prevstate;
    }, () => {
      if (this.props.onChange) this.props.onChange(this.state.userEdits);
    });
  }

  handleFirstNameChange(e) {
    var val = e.target.value;
    this.setState(prevstate => {
      prevstate.user.fname = val;
      prevstate.userEdits.fname = val;
      return prevstate;
    }, () => {
      if (this.props.onChange) this.props.onChange(this.state.userEdits);
    });
  }

  handleMiddleNameChange(e) {
    var val = e.target.value;
    this.setState(prevstate => {
      prevstate.user.mname = val;
      prevstate.userEdits.mname = val;
      return prevstate;
    }, () => {
      if (this.props.onChange) this.props.onChange(this.state.userEdits);
    });
  }

  handleLastNameChange(e) {
    var val = e.target.value;
    this.setState(prevstate => {
      prevstate.user.lname = val;
      prevstate.userEdits.lname = val;
      return prevstate;
    }, () => {
      if (this.props.onChange) this.props.onChange(this.state.userEdits);
    });
  }

  handleEmailChange(e) {
    var val = e.target.value;
    this.setState(prevstate => {
      prevstate.user.email = val;
      prevstate.userEdits.email = val;
      return prevstate;
    }, () => {
      if (this.props.onChange) this.props.onChange(this.state.userEdits);
    });
  }
}

export default EditUser;
