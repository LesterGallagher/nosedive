import React, { Component } from 'react';
import './SearchPage.css';
import UserStore from '../../stores/UserStore';
import Feed from '../../components/Feed/Feed';
import Authenticate from '../../components/Authenticate/Authenticate';
import SearchResults from '../../components/SearchResults/SearchResults';
import SearchExtensive from '../../components/SearchExtensive/SearchExtensive';


class SearchPage extends Component {
  constructor(props) {
    super();
    this.state = { loggedin: UserStore.loggedin, user: null };

    this.handleUserStoreChange = this.handleUserStoreChange.bind(this);
  }

  componentWillMount() {
    UserStore.on('change', this.handleUserStoreChange);
  }

  componentWillUnmount() {
    UserStore.removeListener('change', this.handleUserStoreChange);
  }

  handleUserStoreChange() {
    this.setState({ loggedin: UserStore.loggedin, user: UserStore.user });
  }

  render() {
    return (
      <div className='SearchPage'>
        {this.state.loggedin
          ? <div>
            <SearchExtensive />
            <SearchResults /></div>
          : <div><Authenticate /></div>}
      </div>
    );
  }
}

export default SearchPage;
