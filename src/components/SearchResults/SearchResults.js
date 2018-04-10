import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import './SearchResults.css';
import SearchResultsStore from '../../stores/SearchResultsStore';
import UserPanel from '../UserPanel/UserPanel';
import PostItem from '../PostItem/PostItem';

// import UserStore from '../../stores/UserStore';
const flattenResults = SearchResultsStore.getFlatResults.bind(SearchResultsStore);

class SearchResults extends Component {
  constructor(props) {
    super();
    this.state = {
      results: SearchResultsStore.searchResults,
    };
    this.handleSearchResultsStoreChange = this.handleSearchResultsStoreChange.bind(this);
  }

  componentWillMount() {
    SearchResultsStore.on('change', this.handleSearchResultsStoreChange);
  }

  componentWillUnmount() {
    SearchResultsStore.removeListener('change', this.handleSearchResultsStoreChange);
  }

  handleSearchResultsStoreChange() {
    this.setState({ results: SearchResultsStore.searchResults });
  }

  render() {
    return (
      <div className='SearchResults'>
        {this.state.results
          ? this.renderResults()
          : ''}
      </div>
    );
  }

  renderResults() {
    return <ul className='list-unstyled'>{flattenResults(this.state.results).map((x, i) => this.renderResultItem(x, i))
      .sort((a, b) => new Date(b.joined || b.created) - new Date(a.joined || a.created))}</ul>;
  }

  renderResultItem(item, index) {
    switch (item.type) {
      case 'user':
        return this.renderUserResult(item, index);
      case 'post':
        return this.renderPostResult(item, index);
      default:
        throw Error('unknown type: ' + item.type);
    }
  }

  renderUserResult(user, index) {
    return <li key={index}><UserPanel userid={user.id} /></li>;
  }

  renderPostResult(post, index) {
    return <li key={index}><PostItem post={post} /></li>;
  }
}

export default withRouter(SearchResults);
