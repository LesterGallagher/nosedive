import { EventEmitter } from 'events';
import * as axios from 'axios';
import * as conf from '../conf.json'
import { encodeIntoQuery, toFormData } from '../util';

class PostsStore extends EventEmitter {

  constructor() {
    super();
    this.posts = {};
  }

  fetchPost(postid) {
    return axios.get(conf.apiurl + '/posts/' + postid)
      .then(res => {
        this.posts[postid] = res.data.rows[0];
        this.emit('change');
        return res.data.rows[0];
      });
  }

  searchPosts(q) {
    const postQ = {};
    ['name', 'description', 'content', 'orderby', 'orderdir', 'userid'].forEach(x => { if (q[x]) postQ[x] = q[x]; });
    return axios.get(conf.apiurl + '/posts/q' + encodeIntoQuery(postQ))
      .then(res => {
        res.data.rows.forEach(x => this.posts[x.id] = x);
        this.emit('change');
        return res.data.rows;
      });
  }

  searchPosts2(q, orderby = 'created', orderdir = 'DESC', strictsearch = false) {
    const postQ = {};
    ['name', 'description', 'content'].forEach(x => { postQ[x] = q; });
    return axios.get(conf.apiurl + '/posts/q' + encodeIntoQuery(Object.assign({orderby, orderdir, strictsearch}, postQ)))
      .then(res => {
        res.data.rows.forEach(x => this.posts[x.id] = x);
        this.emit('change');
        return res.data.rows;
      });
  }

  createPost(post, email, password) {
    const payload = toFormData(Object.assign({ email, password }, post));
    return axios.post(conf.apiurl + '/posts', payload)
      .then(res => {
        const id = res.data.rows[0].id;
        post.id = id;
        this.posts[res.data.rows[0].id] = post;
        this.emit('change');
        return post;
      });
  }

  updatePost(postId, props, email, password) {
    const payload = toFormData(Object.assign({ email, password }, props));
    return axios.put(conf.apiurl + '/posts/' + postId, payload)
      .then(res => {
        this.posts[postId] = Object.assign(this.posts[postId], props);
        this.emit('change');
        return this.posts[postId];
      });
  }
}

export default new PostsStore();
