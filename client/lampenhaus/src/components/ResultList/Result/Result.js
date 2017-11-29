import React, { Component } from 'react';

class Result extends Component {
  render() {
    return (
      <div>
        <h6>Document ID: {this.props.value.docId}</h6>
        <p>{this.props.value.snippet}</p>
      </div>
    );
  }
}

export default Result;
