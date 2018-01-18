import React, { Component } from 'react';
import { Col, Container, Row } from 'reactstrap';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import CorrespondentList from './CorrespondentList/CorrespondentList';
import TermList from './TermList/TermList';
import './CorrespondentView.css';
import * as actions from '../../actions/actions';

const mapStateToProps = state => ({
    emailAddress: state.correspondent.emailAddress,
    terms: state.correspondent.terms,
    correspondents: state.correspondent.correspondents,
});

const mapDispatchToProps = dispatch => bindActionCreators({
    onCorrespondentEmailAddressUpdated: actions.setCorrespondentEmailAddress,
    getTerms: actions.requestTerms,
    getCorrespondents: actions.requestCorrespondents,
}, dispatch);

// eslint-disable-next-line react/prefer-stateless-function
class CorrespondentView extends Component {
    constructor(props) {
        super(props);
        const { emailAddress } = props.match.params;
        // FYI: CorrespondentView object has prop match.params because
        // its parent is assumed to be a <Route> of react-router-dom
        props.onCorrespondentEmailAddressUpdated(emailAddress);
        props.getTerms(emailAddress);
        props.getCorrespondents(emailAddress);
    }

    componentDidUpdate(prevProps) {
        if (this.didCorrespondentEmailChange(prevProps)) {
            const { emailAddress } = this.props.match.params;
            this.props.onCorrespondentEmailAddressUpdated(emailAddress);
            this.props.getTerms(emailAddress);
            this.props.getCorrespondents(emailAddress);
        }
    }

    didCorrespondentEmailChange(prevProps) {
        return prevProps.match.params.emailAddress !== this.props.match.params.emailAddress;
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
                        <CorrespondentList
                            emailAddress={this.props.emailAddress}
                            correspondents={this.props.correspondents}
                        />
                    </Col>
                    <Col sm="6">
                        <h4> Terms </h4>
                        <TermList emailAddress={this.props.emailAddress} terms={this.props.terms} />
                    </Col>
                </Row>
            </Container>
        );
    }
}

CorrespondentView.propTypes = {
    match: PropTypes.shape({
        params: PropTypes.shape({
            emailAddress: PropTypes.string,
        }),
    }).isRequired,
    terms: PropTypes.shape({
        entity: PropTypes.string,
        entity_count: PropTypes.number,
        type: PropTypes.string,
    }).isRequired,
    correspondents: PropTypes.arrayOf(PropTypes.shape({
        count: PropTypes.number.isRequired,
        email_address: PropTypes.string.isRequired,
    })).isRequired,
    emailAddress: PropTypes.string.isRequired,
    onCorrespondentEmailAddressUpdated: PropTypes.func.isRequired,
    getTerms: PropTypes.func.isRequired,
    getCorrespondents: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(CorrespondentView);
