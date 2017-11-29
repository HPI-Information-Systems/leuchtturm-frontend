import React, { Component } from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchInput: '',
    };
  }

  handleSearchInputChange(event) {
    this.setState({searchInput: event.target.value});
  }

  handleSearchClick() {
    console.log(this.state.searchInput)
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Lampenhaus</h1>
        </header>
        <SearchBar searchInput={this.state.searchInput} onSubmit={() => this.handleSearchClick()} onChange={(e) => this.handleSearchInputChange(e)}/>
      </div>
    );
  }
}

export default App;
