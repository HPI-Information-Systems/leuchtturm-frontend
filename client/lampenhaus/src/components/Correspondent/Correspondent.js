import React, { Component } from 'react';
import { Badge, Col, Container, ListGroup, ListGroupItem, Row } from 'reactstrap';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import './Correspondent.css';
import * as actions from '../../actions/actions';

const mapStateToProps = state => ({
    emailAddress: state.correspondent.emailAddress,
    correspondents: state.correspondent.correspondents,
    terms: state.correspondent.terms,
});

const mapDispatchToProps = dispatch => bindActionCreators({
    onCorrespondentEmailAddressUpdated: actions.setCorrespondentEmailAddress,
    getCorrespondents: actions.requestCorrespondents,
    getTerms: actions.requestTerms,
}, dispatch);

// eslint-disable-next-line react/prefer-stateless-function
class Correspondent extends Component {
    componentDidMount() {
        this.props.onCorrespondentEmailAddressUpdated(this.props.match.params.emailAddress);
        this.props.getCorrespondents();
        this.props.getTerms();
    }

    componentDidUpdate() {
        if (this.didCorrespondentEmailChange()) {
            this.props.onCorrespondentEmailAddressUpdated(this.props.match.params.emailAddress);
            this.props.getCorrespondents();
            this.props.getTerms();
        }
    }

    didCorrespondentEmailChange() {
        return this.props.match.params.emailAddress !== this.props.emailAddress;
    }

    render() {
        const correspondentElements = this.props.correspondents.map(correspondent => (
            <Link to={`/correspondent/${correspondent.email_address}`} key={correspondent.email_address}>
                <ListGroupItem>
                    <Badge color="primary" pill className="count">
                        {correspondent.count}
                    </Badge>
                    {correspondent.email_address}
                </ListGroupItem>
            </Link>
        ));

        const termElements = this.props.terms.map(term => (
            <ListGroupItem key={term.entity}>
                {term.entity}
                <Badge color="primary" pill className="count">
                    {term.count}
                </Badge>
                {term.type}
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
                            { this.props.terms.length === 0
                                ? (
                                    <ListGroupItem>
                                        No terms found for {this.props.emailAddress}
                                    </ListGroupItem>
                                ) : termElements
                            }
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
    onCorrespondentEmailAddressUpdated: PropTypes.func.isRequired,
    getCorrespondents: PropTypes.func.isRequired,
    getTerms: PropTypes.func.isRequired,
    correspondents: PropTypes.arrayOf(PropTypes.shape({
        count: PropTypes.number.isRequired,
        email_address: PropTypes.string.isRequired,
    })).isRequired,
    terms: PropTypes.arrayOf(PropTypes.shape({
        entity: PropTypes.string.isRequired,
        count: PropTypes.number.isRequired,
        type: PropTypes.string.isRequired,
    })).isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Correspondent);
