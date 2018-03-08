import React, { Component } from 'react';
import {
    Col,
    Container,
    Row,
    Card,
    CardBody,
    CardHeader,
} from 'reactstrap';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
// eslint-disable-next-line import/no-extraneous-dependencies
import { withRouter } from 'react-router';
import CorrespondentList from '../CorrespondentList/CorrespondentList';
import TermList from './TermList/TermList';
import GraphView from '../GraphView/GraphView';
import TopicList from '../TopicList/TopicList';
import './CorrespondentView.css';
import * as actions from '../../actions/actions';
import Mailbox from './Mailbox/Mailbox';

const mapStateToProps = state => ({
    emailAddress: state.correspondent.emailAddress,
    terms: state.correspondent.terms,
    topics: state.correspondent.topics,
    correspondents: state.correspondent.correspondents,
    mailboxAllEmails: state.correspondent.mailboxAllEmails,
    mailboxSentEmails: state.correspondent.mailboxSentEmails,
    mailboxReceivedEmails: state.correspondent.mailboxReceivedEmails,
    isFetchingTerms: state.correspondent.isFetchingTerms,
    isFetchingCorrespondents: state.correspondent.isFetchingCorrespondents,
    isFetchingTopics: state.correspondent.isFetchingTopics,
    isFetchingMailboxAllEmails: state.correspondent.isFetchingMailboxAllEmails,
    isFetchingMailboxReceivedEmails: state.correspondent.isFetchingMailboxReceivedEmails,
    isFetchingMailboxSentEmails: state.correspondent.isFetchingMailboxSentEmails,
});

const mapDispatchToProps = dispatch => bindActionCreators({
    onCorrespondentEmailAddressUpdated: actions.setCorrespondentEmailAddress,
    getTerms: actions.requestTerms,
    getTopics: actions.requestTopics,
    getCorrespondents: actions.requestCorrespondents,
    getMailboxAllEmails: actions.requestMailboxAllEmails,
    getMailboxReceivedEmails: actions.requestMailboxReceivedEmails,
    getMailboxSentEmails: actions.requestMailboxSentEmails,
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
        props.getTopics(emailAddress);
        props.getMailboxAllEmails(emailAddress);
        props.getMailboxReceivedEmails(emailAddress);
        props.getMailboxSentEmails(emailAddress);
    }

    componentDidUpdate(prevProps) {
        document.title = `Correspondent - ${this.props.emailAddress}`;
        if (this.didCorrespondentEmailChange(prevProps)) {
            const { emailAddress } = this.props.match.params;
            this.props.onCorrespondentEmailAddressUpdated(emailAddress);
            this.props.getTerms(emailAddress);
            this.props.getTopics(emailAddress);
            this.props.getCorrespondents(emailAddress);
            this.props.getMailboxAllEmails(emailAddress);
            this.props.getMailboxReceivedEmails(emailAddress);
            this.props.getMailboxSentEmails(emailAddress);
        }
    }

    didCorrespondentEmailChange(prevProps) {
        return prevProps.match.params.emailAddress !== this.props.match.params.emailAddress;
    }

    render() {
        return (
            <Container fluid>
                <Row>
                    <Col sm="12">
                        <h4>Correspondent - {this.props.emailAddress}</h4>
                    </Col>
                </Row>
                <Row className="correspondent-lists">
                    <Col sm="3">
                        <Card>
                            <CardHeader tag="h4">Correspondents</CardHeader>
                            <CardBody>
                                <CorrespondentList
                                    correspondents={this.props.correspondents}
                                    isFetching={this.props.isFetchingCorrespondents}
                                />
                            </CardBody>
                        </Card>
                    </Col>
                    <Col sm="3">
                        <Card>
                            <CardHeader tag="h4">Terms</CardHeader>
                            <CardBody>
                                <TermList
                                    emailAddress={this.props.emailAddress}
                                    terms={this.props.terms}
                                    isFetching={this.props.isFetchingTerms}
                                />
                            </CardBody>
                        </Card>
                    </Col>
                    <Col sm="6">
                        <Card>
                            <CardHeader tag="h4">Topics</CardHeader>
                            <CardBody>
                                <TopicList
                                    emailAddress={this.props.emailAddress}
                                    topics={this.props.topics}
                                    isFetching={this.props.isFetchingTopics}
                                />
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col sm="6">
                        <Card>
                            <CardBody>
                                <GraphView emailAddress={this.props.emailAddress} />
                            </CardBody>
                        </Card>
                    </Col>
                    <Col sm="6">
                        <Card>
                            <CardHeader tag="h4">Mailbox</CardHeader>
                            <CardBody>
                                <Mailbox
                                    allEmails={this.props.mailboxAllEmails}
                                    isFetchingAllEmails={this.props.isFetchingMailboxAllEmails}
                                    receivedEmails={this.props.mailboxReceivedEmails}
                                    isFetchingReceivedEmails={this.props.isFetchingMailboxReceivedEmails}
                                    sentEmails={this.props.mailboxSentEmails}
                                    isFetchingSentEmails={this.props.isFetchingMailboxSentEmails}
                                />
                            </CardBody>
                        </Card>
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
    topics: PropTypes.arrayOf(PropTypes.shape({
        confidence: PropTypes.number.isRequired,
        words: PropTypes.arrayOf(PropTypes.shape({
            word: PropTypes.string.isRequired,
            confidence: PropTypes.number.isRequired,
        })).isRequired,
    })).isRequired,
    correspondents: PropTypes.arrayOf(PropTypes.shape({
        count: PropTypes.number.isRequired,
        email_address: PropTypes.string.isRequired,
    })).isRequired,
    terms: PropTypes.arrayOf(PropTypes.shape({
        entity: PropTypes.string.isRequired,
        count: PropTypes.number.isRequired,
        type: PropTypes.string.isRequired,
    })).isRequired,
    mailboxAllEmails: PropTypes.arrayOf(PropTypes.shape({
        body: PropTypes.string.isRequired,
        doc_id: PropTypes.string.isRequired,
        header: PropTypes.shape({
            subject: PropTypes.string.isRequired,
        }).isRequired,
    })).isRequired,
    mailboxReceivedEmails: PropTypes.arrayOf(PropTypes.shape({
        body: PropTypes.string.isRequired,
        doc_id: PropTypes.string.isRequired,
        header: PropTypes.shape({
            subject: PropTypes.string.isRequired,
        }).isRequired,
    })).isRequired,
    mailboxSentEmails: PropTypes.arrayOf(PropTypes.shape({
        body: PropTypes.string.isRequired,
        doc_id: PropTypes.string.isRequired,
        header: PropTypes.shape({
            subject: PropTypes.string.isRequired,
        }).isRequired,
    })).isRequired,
    emailAddress: PropTypes.string.isRequired,
    onCorrespondentEmailAddressUpdated: PropTypes.func.isRequired,
    getTerms: PropTypes.func.isRequired,
    getTopics: PropTypes.func.isRequired,
    getCorrespondents: PropTypes.func.isRequired,
    getMailboxAllEmails: PropTypes.func.isRequired,
    getMailboxSentEmails: PropTypes.func.isRequired,
    getMailboxReceivedEmails: PropTypes.func.isRequired,
    isFetchingTerms: PropTypes.bool.isRequired,
    isFetchingTopics: PropTypes.bool.isRequired,
    isFetchingCorrespondents: PropTypes.bool.isRequired,
    isFetchingMailboxAllEmails: PropTypes.bool.isRequired,
    isFetchingMailboxSentEmails: PropTypes.bool.isRequired,
    isFetchingMailboxReceivedEmails: PropTypes.bool.isRequired,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CorrespondentView));
