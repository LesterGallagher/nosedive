import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import './SearchExtensive.css';
import SearchResultsStore from '../../stores/SearchResultsStore';

// import UserStore from '../../stores/UserStore';

class SearchExtensive extends Component {
  constructor(props) {
    super();
    this.state = {
      searchText: '',
      loading: false,
    };
    this.handleSearchResultsStore = this.handleSearchResultsStore.bind(this);
  }

  componentWillMount() {
    SearchResultsStore.on('change', this.handleSearchResultsStore);
  }

  componentWillUnmount() {
    SearchResultsStore.removeListener('change', this.handleSearchResultsStore);
  }

  handleSearchResultsStore() {
    this.setState({ searchText: SearchResultsStore.searchText });
  }

  render() {
    return (
      <div className='SearchExtensive'>
        <form method='POST' className='pure-form' onSubmit={this.handleSearchSubmit.bind(this)}>
          <div>Search</div>
          <div className='SearchInputGroup'>
            <input type='text' required value={this.state.searchText}
              onChange={this.handleSearchTextChange.bind(this)}
              placeholder='' />
            <button className={'buttonSearch pure-button ' + (this.state.loading ? 'loading' : '')} type='submit'>
              <i className='material-icons search' aria-hidden='true'>search</i>
              <span className='loadingIcon' aria-hidden='true' />
              <span className='sr-only' />
            </button>
          </div>
        </form>
      </div>
    );
  }

  handleSearchTextChange(e) {
    SearchResultsStore.searchText = e.target.value;
    SearchResultsStore.emit('change');
  }

  handleSearchSubmit(event) {
    event.preventDefault();
    this.setState({ loading: true });

    SearchResultsStore.doSearch(this.state.searchText)
      .then(searchResults => {
        if (this.props.redirect) this.props.history.push(this.props.redirect);
        this.setState({ loading: false });

      }).catch(err => {
        console.error(err);
        this.setState({ loading: false });
        alert('Unable to complete search');
      });
  }

  createFlatResults(r) {
    return [].concat([], r.posts.map(x => Object.assign({ type: 'post' }, x)))
      .concat([], r.users.map(x => Object.assign({ type: 'user' }, x)));
  }

}

export default withRouter(SearchExtensive);
