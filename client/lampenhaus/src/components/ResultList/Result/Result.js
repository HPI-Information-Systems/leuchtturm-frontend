import React, { Component } from 'react';
import {Col, Row} from 'reactstrap';

class Result extends Component {
  render() {
    return (
      <Row>
        <Col>
          <h6>Document ID: {this.props.value.docId}</h6>
          <p>{this.props.value.snippet}</p>
        </Col>
      </Row>
    );
  }
}

export default Result;
