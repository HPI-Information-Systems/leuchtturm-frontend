import React, { Component } from 'react';
import { Col, Container, ListGroup, ListGroupItem, Row } from 'reactstrap';
import PropTypes from 'prop-types';
import './Correspondent.css';

// eslint-disable-next-line react/prefer-stateless-function
class Correspondent extends Component {
    render() {
        return (
            <Container fluid className="App">
                <Row id="correspondentHeadline">
                    <Col sm="12">
                        <h1>{this.props.match.params.emailAddress}</h1>
                    </Col>
                </Row>
                <Row>
                    <Col sm="6">
                        <h4> Correspondents </h4>
                        <ListGroup>
                            <ListGroupItem> 1 </ListGroupItem>
                            <ListGroupItem> 2 </ListGroupItem>
                        </ListGroup>
                    </Col>
                    <Col sm="6">
                        <h4> Terms </h4>
                        <ListGroup>
                            <ListGroupItem> 3 </ListGroupItem>
                            <ListGroupItem> 4 </ListGroupItem>
                        </ListGroup>
                    </Col>
                </Row>
            </Container>
        );
    }
}

Correspondent.propTypes = {
    match: PropTypes.string.isRequired,
};

export default Correspondent;
