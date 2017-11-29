import React, { Component } from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import ResultList from '../ResultList/ResultList';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchInput: '',
      results: [
        {
          docId: '0000000_0001_000000404',
          snippet: '... the same name, which he founded in 1982.\n' +
          'From 1980 to 1982, Mr. Chatpar was employed by Bayly\n' +
          'Engineering Limited, a manufacturer of digital\n' +
          'telecommunication systems and a member of A.E.G.\n' +
          'Telefunken Group, as a General Manager of Digital\n' +
          'Transmission and Fiber Optics Engineering (research and\n' +
          'development). From 1974 ...',
        },
        {
          docId: '0000000_0001_000000712',
          snippet: '... ch sector is recovering, "Today,\n' +
          'retail companies with PC exposure gave a first-hand view of\n' +
          'souring conditions. Circuit City (CC) released its same-\n' +
          'store sales of 1982, which were down 25% year-over-year, led by\n' +
          'poor PC sales. And Ingram Micro (IM) announced layoffs. It\n' +
          'is no secret that demand stin ...',
        },
      ],
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
        <ResultList results={this.state.results}/>
      </div>
    );
  }
}

export default App;
