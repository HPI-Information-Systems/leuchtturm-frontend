import React, { Component } from 'react';
import { Badge, Col, Container, ListGroup, ListGroupItem, Row } from 'reactstrap';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import './Correspondent.css';
import * as actions from '../../actions/actions';

const mapStateToProps = state => ({
    emailAddress: state.correspondent.emailAddress,
    correspondents: state.correspondent.correspondents,
});

const mapDispatchToProps = dispatch => bindActionCreators({
    onComponentDidMount: actions.requestCorrespondents,
}, dispatch);

// eslint-disable-next-line react/prefer-stateless-function
class Correspondent extends Component {
    componentDidMount() {
        this.props.onComponentDidMount(this.props.match.params.emailAddress);
    }

    render() {
        const correspondentElements = this.props.correspondents.map(correspondent => (
            // TODO: find better link mechanism here that doesn't rerender the whole page...
            <ListGroupItem
                key={correspondent.email_address}
                tag="a"
                href={`/correspondent/${correspondent.email_address}`}
            >
                <Badge color="primary" pill className="correspondent-count">
                    {correspondent.count}
                </Badge>
                {correspondent.email_address}
            </ListGroupItem>
        ));

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
                            { this.props.correspondents.length === 0
                                ? (
                                    <ListGroupItem>
                                        No correspondents found for {this.props.emailAddress}
                                    </ListGroupItem>
                                ) : correspondentElements
                            }
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
    onComponentDidMount: PropTypes.func.isRequired,
    correspondents: PropTypes.arrayOf(PropTypes.shape({
        count: PropTypes.number.isRequired,
        email_address: PropTypes.string.isRequired,
    })).isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Correspondent);
