import React, { Component } from 'react';
import './EditPost.css';
import conf from '../../conf.json';

const validFileType = file => {
  return /image\/(jpg|jpeg|png|gif|bmp)$/i.test(file.type);
};

class EditPost extends Component {
  constructor(props) {
    super();
    this.state = {
      imageUrl: props.post ? conf.apiurl + '/posts/image/' + props.post.id + '.jpg' : null,
      post: props.post || { name: '', description: '', content: '', image: null },
    };
    this.handleContentChange = this.handleContentChange.bind(this);
    this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
    this.handleImageChange = this.handleImageChange.bind(this);
    this.handleImageError = this.handleImageError.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.removeImage = this.removeImage.bind(this);

  }

  componentWillMount() {
  }

  componentWillUnmount() {
  }

  render() {
    return (
      <div className='EditPost'>
        <label htmlFor='edit-post-form-name'>Name</label>
        <input onChange={this.handleNameChange} value={this.state.post.name} id='edit-post-form-name' name='name' type='text' required minLength='4' className='editPostName' />
        <label htmlFor='edit-post-form-description'>Description</label>
        <textarea onChange={this.handleDescriptionChange} value={this.state.post.description} id='edit-post-form-name' rows='2' name='description' type='text' required minLength='4' className='editPostDescription' />
        <label htmlFor='edit-post-form-image'>Image</label>
        <div className='image'>
          {this.state.imageUrl
            ? this.renderImage()
            : this.renderFileInput()}</div>
        <label htmlFor='edit-post-form-content'>Content</label>
        <textarea onChange={this.handleContentChange} value={this.state.post.content} id='edit-post-form-content' rows='10' name='description' type='text' required minLength='4' className='editPostContent' />
      </div>
    );
  }

  renderImage() {
    return <div className='ImagePreview'>
      <img onError={this.handleImageError} src={this.state.imageUrl} alt='Post Item' />
      <a onClick={this.removeImage} className='rmImage' role='button'>
        <i aria-hidden='true' className='material-icons'>delete</i>
        <span className='sr-only'>(remove)</span>
      </a>
    </div>;
  }

  handleImageError() {
    this.setState({ imageUrl: null });
  }

  removeImage() {
    this.setState(prevstate => {
      prevstate.post.image = null;
      prevstate.imageUrl = null;
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
          prevstate.post.image = file;
          prevstate.imageUrl = e2.target.result;
          return prevstate;
        }, () => {
          if (this.props.onChange) this.props.onChange(this.state.post);
        });
      };
      reader.readAsDataURL(file);
    } else {
      // remove file
      this.setState(prevstate => {
        prevstate.post.image = null;
        prevstate.imageUrl = null;
        return prevstate;
      }, () => {
        if (this.props.onChange) this.props.onChange(this.state.post);
      });
    }
  }

  handleNameChange(e) {
    var val = e.target.value;
    this.setState(prevstate => {
      prevstate.post.name = val;
      return prevstate;
    }, () => {
      if (this.props.onChange) this.props.onChange(this.state.post);
    });
  }

  handleDescriptionChange(e) {
    var val = e.target.value;
    this.setState(prevstate => {
      prevstate.post.description = val;
      return prevstate;
    }, () => {
      if (this.props.onChange) this.props.onChange(this.state.post);
    });
  }

  handleContentChange(e) {
    var val = e.target.value;
    this.setState(prevstate => {
      prevstate.post.content = val;
      return prevstate;
    }, () => {
      if (this.props.onChange) this.props.onChange(this.state.post);
    });
  }

}

export default EditPost;
