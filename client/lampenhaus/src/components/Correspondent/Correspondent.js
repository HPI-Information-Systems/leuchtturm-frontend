import React, { Component } from 'react';
import { Col, Container, ListGroup, ListGroupItem, Row } from 'reactstrap';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import './Correspondent.css';
import * as actions from '../../actions/actions';

const mapStateToProps = state => ({
    emailAddress: state.correspondent.emailAddress,
});

const mapDispatchToProps = dispatch => bindActionCreators({
    onCorrespondentViewOpened: actions.setCorrespondentEmailAddress,
}, dispatch);

// eslint-disable-next-line react/prefer-stateless-function
class Correspondent extends Component {
    constructor(props) {
        super(props);
        props.onCorrespondentViewOpened(this.props.match.params.emailAddress);
    }

    render() {
        return (
            <Container fluid className="App">
                <Row id="correspondentHeadline">
                    <Col sm="12">
                        <h1>{this.props.emailAddress}</h1>
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
    match: PropTypes.shape({
        params: PropTypes.shape({
            emailAddress: PropTypes.string,
        }),
    }).isRequired,
    emailAddress: PropTypes.string.isRequired,
    onCorrespondentViewOpened: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Correspondent);
