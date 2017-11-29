import React, { Component } from 'react';
import {ListGroup, ListGroupItem} from 'reactstrap';
import Result from './Result/Result';

class ResultList extends Component {
  render() {
    const resultElements = this.props.results.map(result => {
      return (
        <ListGroupItem><Result value={result}/></ListGroupItem>
      )
    });

    return (
      <ListGroup>{resultElements}</ListGroup>
    );
  }
}

export default ResultList;
