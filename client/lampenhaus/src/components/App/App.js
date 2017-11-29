import React, { Component } from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import ResultList from '../ResultList/ResultList';
import {Col, Container, Row} from 'reactstrap';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchInput: '',
      results: [
        {
          docId: '0000000_0001_000000404',
          snippets: [
            {
              text: '... snippet 1 ...',
              position: 214,
            },
            {
              text: '... snippet 2 ...',
              position: 215,
            },
          ],
        },
        {
          docId: '0000000_0001_000000712',
          snippets: [
            {
              text: '... snippet 3 ...',
              position: 216,
            },
            {
              text: '... snippet 4 ...',
              position: 217,
            },
            {
              text: '... snippet 5 ...',
              position: 219,
            },
          ],
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
        <Container fluid className="App">
          <Row>
            <Col>
              <SearchBar searchInput={this.state.searchInput} onSubmit={() => this.handleSearchClick()} onChange={(e) => this.handleSearchInputChange(e)}/>
            </Col>
          </Row>
          <ResultList results={this.state.results}/>
        </Container>
      </div>
    );
  }
}

export default App;
