import React, { Component } from 'react';
import { InputGroup, InputGroupButton, Input } from 'reactstrap';

class SearchBar extends Component {
  render() {
    return (
      <InputGroup>
        <Input placeholder="Ken Lay" value={this.props.searchInput} onChange={this.props.onChange}/>
        <InputGroupButton color="primary" onClick={this.props.onSubmit}>Search</InputGroupButton>
      </InputGroup>
    );
  }
}

export default SearchBar;
