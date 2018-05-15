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
import _ from 'lodash';
import { withRouter } from 'react-router';
import CorrespondentList from '../CorrespondentList/CorrespondentList';
import TermList from './TermList/TermList';
import Graph from '../Graph/Graph';
import TopicList from '../TopicList/TopicList';
import './CorrespondentView.css';
import {
    setCorrespondentEmailAddress,
    requestCorrespondents,
    requestTerms,
    requestTopicsForCorrespondent,
    requestMailboxAllEmails,
    requestMailboxReceivedEmails,
    requestMailboxSentEmails,
} from '../../actions/correspondentViewActions';
import Mailbox from './Mailbox/Mailbox';
import Spinner from '../Spinner/Spinner';

const mapStateToProps = state => ({
    emailAddress: state.correspondentView.emailAddress,
    globalFilters: state.globalFilters.filters,
    terms: state.correspondentView.terms,
    topics: state.correspondentView.topics,
    correspondents: state.correspondentView.correspondents,
    mailboxAllEmails: state.correspondentView.mailboxAllEmails,
    mailboxSentEmails: state.correspondentView.mailboxSentEmails,
    mailboxReceivedEmails: state.correspondentView.mailboxReceivedEmails,
    isFetchingTerms: state.correspondentView.isFetchingTerms,
    isFetchingCorrespondents: state.correspondentView.isFetchingCorrespondents,
    isFetchingTopics: state.correspondentView.isFetchingTopics,
    hasTopicsData: state.correspondentView.hasTopicsData,
    isFetchingMailboxAllEmails: state.correspondentView.isFetchingMailboxAllEmails,
    isFetchingMailboxReceivedEmails: state.correspondentView.isFetchingMailboxReceivedEmails,
    isFetchingMailboxSentEmails: state.correspondentView.isFetchingMailboxSentEmails,
});

const mapDispatchToProps = dispatch => bindActionCreators({
    setCorrespondentEmailAddress,
    requestTerms,
    requestTopicsForCorrespondent,
    requestCorrespondents,
    requestMailboxAllEmails,
    requestMailboxReceivedEmails,
    requestMailboxSentEmails,
}, dispatch);

class CorrespondentView extends Component {
    constructor(props) {
        super(props);
        const { emailAddress } = props.match.params;
        // FYI: CorrespondentView object has prop match.params because
        // its parent is assumed to be a <Route> of react-router-dom
        props.setCorrespondentEmailAddress(emailAddress, this.props.globalFilters);
        props.requestTerms(emailAddress, this.props.globalFilters);
        props.requestCorrespondents(emailAddress, this.props.globalFilters);
        props.requestTopicsForCorrespondent(emailAddress, this.props.globalFilters);
        props.requestMailboxAllEmails(emailAddress, this.props.globalFilters);
        props.requestMailboxReceivedEmails(emailAddress, this.props.globalFilters);
        props.requestMailboxSentEmails(emailAddress, this.props.globalFilters);
    }

    componentDidUpdate(prevProps) {
        document.title = `Correspondent - ${this.props.emailAddress}`;
        if (this.didCorrespondentViewParametersChange(prevProps)) {
            const { emailAddress } = this.props.match.params;
            this.props.setCorrespondentEmailAddress(emailAddress, this.props.globalFilters);
            this.props.requestTerms(emailAddress, this.props.globalFilters);
            this.props.requestCorrespondents(emailAddress, this.props.globalFilters);
            this.props.requestTopicsForCorrespondent(emailAddress, this.props.globalFilters);
            this.props.requestMailboxAllEmails(emailAddress, this.props.globalFilters);
            this.props.requestMailboxReceivedEmails(emailAddress, this.props.globalFilters);
            this.props.requestMailboxSentEmails(emailAddress, this.props.globalFilters);
        }
    }

    didCorrespondentViewParametersChange(prevProps) {
        return (
            prevProps.match.params.emailAddress !== this.props.match.params.emailAddress ||
            !_.isEqual(prevProps.globalFilters, this.props.globalFilters)
        );
    }

    render() {
        return (
            <Container fluid>
                <Row>
                    <Col sm="12">
                        <h4>Correspondent - {this.props.emailAddress}</h4>
                    </Col>
                </Row>
                <Row className="correspondent-view-cards">
                    <Col sm="3">
                        <Card className="correspondent-list">
                            <CardHeader tag="h4">Correspondents</CardHeader>
                            <CardBody>
                                <CorrespondentList
                                    correspondentsAll={this.props.correspondents.all}
                                    correspondentsTo={this.props.correspondents.to}
                                    correspondentsFrom={this.props.correspondents.from}
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
                                {this.props.isFetchingTopics ?
                                    <Spinner />
                                    : this.props.hasTopicsData && <TopicList topics={this.props.topics} />
                                }
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col sm="6">
                        <Card>
                            <CardHeader tag="h4">Top Correspondent Communication</CardHeader>
                            <CardBody>
                                <Graph
                                    emailAddresses={[this.props.emailAddress]}
                                    view="correspondent"
                                />
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
    globalFilters: PropTypes.shape({
        searchTerm: PropTypes.string.isRequired,
        startDate: PropTypes.string.isRequired,
        endDate: PropTypes.string.isRequired,
        sender: PropTypes.string.isRequired,
        recipient: PropTypes.string.isRequired,
        selectedTopics: PropTypes.array.isRequired,
        topicThreshold: PropTypes.number.isRequired,
        selectedEmailClasses: PropTypes.array.isRequired,
    }).isRequired,
    correspondents: PropTypes.shape({
        all: PropTypes.arrayOf(PropTypes.shape({
            count: PropTypes.number.isRequired,
            email_address: PropTypes.string.isRequired,
        })).isRequired,
        to: PropTypes.arrayOf(PropTypes.shape({
            count: PropTypes.number.isRequired,
            email_address: PropTypes.string.isRequired,
        })).isRequired,
        from: PropTypes.arrayOf(PropTypes.shape({
            count: PropTypes.number.isRequired,
            email_address: PropTypes.string.isRequired,
        })).isRequired,
    }).isRequired,
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
            date: PropTypes.string.isRequired,
        }).isRequired,
    })).isRequired,
    mailboxReceivedEmails: PropTypes.arrayOf(PropTypes.shape({
        body: PropTypes.string.isRequired,
        doc_id: PropTypes.string.isRequired,
        header: PropTypes.shape({
            subject: PropTypes.string.isRequired,
            date: PropTypes.string.isRequired,
        }).isRequired,
    })).isRequired,
    mailboxSentEmails: PropTypes.arrayOf(PropTypes.shape({
        body: PropTypes.string.isRequired,
        doc_id: PropTypes.string.isRequired,
        header: PropTypes.shape({
            subject: PropTypes.string.isRequired,
            date: PropTypes.string.isRequired,
        }).isRequired,
    })).isRequired,
    emailAddress: PropTypes.string.isRequired,
    setCorrespondentEmailAddress: PropTypes.func.isRequired,
    requestTerms: PropTypes.func.isRequired,
    requestTopicsForCorrespondent: PropTypes.func.isRequired,
    requestCorrespondents: PropTypes.func.isRequired,
    requestMailboxAllEmails: PropTypes.func.isRequired,
    requestMailboxSentEmails: PropTypes.func.isRequired,
    requestMailboxReceivedEmails: PropTypes.func.isRequired,
    isFetchingTerms: PropTypes.bool.isRequired,
    isFetchingTopics: PropTypes.bool.isRequired,
    hasTopicsData: PropTypes.bool.isRequired,
    isFetchingCorrespondents: PropTypes.bool.isRequired,
    isFetchingMailboxAllEmails: PropTypes.bool.isRequired,
    isFetchingMailboxSentEmails: PropTypes.bool.isRequired,
    isFetchingMailboxReceivedEmails: PropTypes.bool.isRequired,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CorrespondentView));
