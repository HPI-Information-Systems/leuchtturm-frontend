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
    globalFilter: state.globalFilter.filters,
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

        this.state = {
            maximized: {
                graph: false,
            },
        };

        const { emailAddress } = props.match.params;

        props.setCorrespondentEmailAddress(emailAddress, this.props.globalFilter);
        props.requestTerms(emailAddress, this.props.globalFilter);
        props.requestCorrespondents(emailAddress, this.props.globalFilter);
        props.requestTopicsForCorrespondent(emailAddress, this.props.globalFilter);
        props.requestMailboxAllEmails(emailAddress, this.props.globalFilter);
        props.requestMailboxReceivedEmails(emailAddress, this.props.globalFilter);
        props.requestMailboxSentEmails(emailAddress, this.props.globalFilter);

        this.toggleMaximize = this.toggleMaximize.bind(this);
    }

    componentDidUpdate(prevProps) {
        document.title = `Correspondent - ${this.props.emailAddress}`;
        if (this.didCorrespondentViewParametersChange(prevProps)) {
            const { emailAddress } = this.props.match.params;
            this.props.setCorrespondentEmailAddress(emailAddress, this.props.globalFilter);
            this.props.requestTerms(emailAddress, this.props.globalFilter);
            this.props.requestCorrespondents(emailAddress, this.props.globalFilter);
            this.props.requestTopicsForCorrespondent(emailAddress, this.props.globalFilter);
            this.props.requestMailboxAllEmails(emailAddress, this.props.globalFilter);
            this.props.requestMailboxReceivedEmails(emailAddress, this.props.globalFilter);
            this.props.requestMailboxSentEmails(emailAddress, this.props.globalFilter);
        }
    }

    didCorrespondentViewParametersChange(prevProps) {
        return (
            prevProps.match.params.emailAddress !== this.props.match.params.emailAddress ||
            !_.isEqual(prevProps.globalFilter, this.props.globalFilter)
        );
    }

    toggleMaximize(componentName) {
        this.setState({
            maximized: {
                ...this.state.maximized,
                [componentName]: !this.state.maximized[componentName],
            },
        });
    }

    render() {
        return (
            <Container fluid>
                <Row>
                    <Col sm="12">
                        <Card className="correspondent-list">
                            <CardHeader tag="h4">{this.props.emailAddress}</CardHeader>
                        </Card>
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
                    <Col sm="6" className={this.state.maximized.graph ? 'maximized' : ''}>
                        <Graph
                            title="Communication Network"
                            emailAddresses={[this.props.emailAddress]}
                            view="correspondent"
                            isFetchingCorrespondents={this.props.isFetchingCorrespondents}
                            maximize={this.toggleMaximize}
                            isMaximized={this.state.maximized.graph}
                        />
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
    globalFilter: PropTypes.shape({
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
            count: PropTypes.number,
            email_address: PropTypes.string,
        })),
        to: PropTypes.arrayOf(PropTypes.shape({
            count: PropTypes.number,
            email_address: PropTypes.string,
        })),
        from: PropTypes.arrayOf(PropTypes.shape({
            count: PropTypes.number,
            email_address: PropTypes.string,
        })),
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
