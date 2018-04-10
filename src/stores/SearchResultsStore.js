import { EventEmitter } from 'events';
import UserStore from './UserStore';
import PostsStore from './PostsStore';

class SearchResultsStore extends EventEmitter {

    constructor() {
        super();
        this.searchResults = null;
        this.searchText = '';
    }

    reset() {
        if (this.searchResults === null) return;
        this.searchResults = null;
        this.emit('change');
    }

    doSearch (q) {
        return Promise.all([UserStore.searchUser(q), PostsStore.searchPosts2(q)]).then(results => {
            const data = {
                users: results[0],
                posts: results[1],  
            };
            this.searchResults = data;
            this.emit('change');
            return data;
        });
    }

    getFlatResults(r) {
        return [].concat([], r.posts.map(x => Object.assign({ type: 'post'}, x)))
            .concat([], r.users.map(x => Object.assign({ type: 'user'}, x)));
    }
}

export default new SearchResultsStore();
