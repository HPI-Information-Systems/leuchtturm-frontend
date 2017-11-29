import React, { Component } from 'react';
import {ListGroup, ListGroupItem} from 'reactstrap';
import Result from './Result/Result';

class ResultList extends Component {
  render() {
    const resultElements = this.props.results.map(result => {
      return (
        // TODO docId is not an optimal key because there can be multiple list entries w/ the same docId
        <ListGroupItem key={result.docId}><Result value={result}/></ListGroupItem>
      )
    });

    return (
      <ListGroup>{resultElements}</ListGroup>
    );
  }
}

export default ResultList;
