import React, { Component } from 'react';
import './App.css';
import { InputGroup, InputGroupButton, Input } from 'reactstrap';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: '',
    };
  }

  handleSearchInputChange(event) {
    this.setState({inputValue: event.target.value});
  }

  handleSearchClick() {
    console.log(this.state.inputValue)
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Lampenhaus</h1>
        </header>
        <InputGroup>
          <Input placeholder="Ken Lay" defaultValue={this.state.inputValue} onChange={(e) => this.handleSearchInputChange(e)}/>
          <InputGroupButton color="primary" onClick={() => this.handleSearchClick()}>Search</InputGroupButton>
        </InputGroup>
      </div>
    );
  }
}

export default App;
