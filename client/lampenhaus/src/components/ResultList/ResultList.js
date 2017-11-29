import React, { Component } from 'react';
import {ListGroup, ListGroupItem} from 'reactstrap';
import Result from './Result/Result';

class ResultList extends Component {
  render() {
    const resultElements = this.props.results.map(docResult => {
      return (
        <ListGroupItem key={docResult.docId}><Result docResult={docResult}/></ListGroupItem>
      )
    });

    return (
      <ListGroup>{resultElements}</ListGroup>
    );
  }
}

export default ResultList;
