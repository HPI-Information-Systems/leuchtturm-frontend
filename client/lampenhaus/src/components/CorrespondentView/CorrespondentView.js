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
    setCorrespondentIdentifyingName,
    requestCorrespondents,
    requestCorrespondentInfo,
    requestTerms,
    requestTopicsForCorrespondent,
    requestMailboxAllEmails,
    requestMailboxReceivedEmails,
    requestMailboxSentEmails,
} from '../../actions/correspondentViewActions';
import Mailbox from './Mailbox/Mailbox';
import CorrespondentInfo from './CorrespondentInfo/CorrespondentInfo';
import Spinner from '../Spinner/Spinner';

const mapStateToProps = state => ({
    identifyingName: state.correspondentView.identifyingName,
    globalFilter: state.globalFilter.filters,
    terms: state.correspondentView.terms,
    topics: state.correspondentView.topics,
    correspondents: state.correspondentView.correspondents,
    correspondentInfo: state.correspondentView.correspondentInfo,
    mailboxAllEmails: state.correspondentView.mailboxAllEmails,
    mailboxSentEmails: state.correspondentView.mailboxSentEmails,
    mailboxReceivedEmails: state.correspondentView.mailboxReceivedEmails,
    isFetchingTerms: state.correspondentView.isFetchingTerms,
    isFetchingCorrespondents: state.correspondentView.isFetchingCorrespondents,
    isFetchingCorrespondentInfo: state.correspondentView.isFetchingCorrespondentInfo,
    isFetchingTopics: state.correspondentView.isFetchingTopics,
    hasTopicsData: state.correspondentView.hasTopicsData,
    hasCorrespondentInfoData: state.correspondentView.hasCorrespondentInfoData,
    isFetchingMailboxAllEmails: state.correspondentView.isFetchingMailboxAllEmails,
    isFetchingMailboxReceivedEmails: state.correspondentView.isFetchingMailboxReceivedEmails,
    isFetchingMailboxSentEmails: state.correspondentView.isFetchingMailboxSentEmails,
});

const mapDispatchToProps = dispatch => bindActionCreators({
    setCorrespondentIdentifyingName,
    requestTerms,
    requestTopicsForCorrespondent,
    requestCorrespondents,
    requestCorrespondentInfo,
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

        const { identifyingName } = props.match.params;

        props.setCorrespondentIdentifyingName(identifyingName, this.props.globalFilter);
        props.requestTerms(identifyingName, this.props.globalFilter);
        props.requestCorrespondentInfo(identifyingName);
        props.requestCorrespondents(identifyingName, this.props.globalFilter);
        props.requestTopicsForCorrespondent(identifyingName, this.props.globalFilter);
        props.requestMailboxAllEmails(identifyingName, this.props.globalFilter);
        props.requestMailboxReceivedEmails(identifyingName, this.props.globalFilter);
        props.requestMailboxSentEmails(identifyingName, this.props.globalFilter);

        this.toggleMaximize = this.toggleMaximize.bind(this);
    }

    componentDidUpdate(prevProps) {
        document.title = `Correspondent - ${this.props.identifyingName}`;
        if (this.didCorrespondentViewParametersChange(prevProps)) {
            const { identifyingName } = this.props.match.params;
            this.props.setCorrespondentIdentifyingName(identifyingName, this.props.globalFilter);
            this.props.requestTerms(identifyingName, this.props.globalFilter);
            this.props.requestCorrespondentInfo(identifyingName);
            this.props.requestCorrespondents(identifyingName, this.props.globalFilter);
            this.props.requestTopicsForCorrespondent(identifyingName, this.props.globalFilter);
            this.props.requestMailboxAllEmails(identifyingName, this.props.globalFilter);
            this.props.requestMailboxReceivedEmails(identifyingName, this.props.globalFilter);
            this.props.requestMailboxSentEmails(identifyingName, this.props.globalFilter);
        }
    }

    didCorrespondentViewParametersChange(prevProps) {
        return (
            prevProps.match.params.identifyingName !== this.props.match.params.identifyingName ||
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
                <Row className="correspondent-view-cards">
                    <Col sm="3">
                        <Card>
                            <CardHeader tag="h4">{this.props.identifyingName}</CardHeader>
                            <CardBody>
                                <CorrespondentInfo
                                    correspondentInfo={this.props.correspondentInfo}
                                    isFetchingCorrespondentInfo={this.props.isFetchingCorrespondentInfo}
                                    hasCorrespondentInfoData={this.props.hasCorrespondentInfoData}
                                />
                            </CardBody>
                        </Card>
                    </Col>
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
                    <Col sm="4">
                        <Card>
                            <CardHeader tag="h4">Topics</CardHeader>
                            <CardBody className="topic-card">
                                {this.props.isFetchingTopics ?
                                    <Spinner />
                                    : this.props.hasTopicsData && <TopicList topics={this.props.topics} />
                                }
                            </CardBody>
                        </Card>
                    </Col>
                    <Col sm="3">
                        <Card>
                            <CardHeader tag="h4">Terms</CardHeader>
                            <CardBody>
                                <TermList
                                    identifyingName={this.props.identifyingName}
                                    terms={this.props.terms}
                                    isFetching={this.props.isFetchingTerms}
                                />
                            </CardBody>
                        </Card>
                    </Col>
                    <Col sm="5" className={this.state.maximized.graph ? 'maximized' : ''}>
                        <Graph
                            title="Communication Network"
                            identifyingNames={[this.props.identifyingName]}
                            view="correspondent"
                            isFetchingCorrespondents={this.props.isFetchingCorrespondents}
                            maximize={this.toggleMaximize}
                            isMaximized={this.state.maximized.graph}
                        />
                    </Col>
                </Row>
            </Container>
        );
    }
}

CorrespondentView.propTypes = {
    match: PropTypes.shape({
        params: PropTypes.shape({
            identifyingName: PropTypes.string,
        }),
    }).isRequired,
    topics: PropTypes.shape({
        main: PropTypes.shape({
            topics: PropTypes.arrayOf(PropTypes.shape({
                confidence: PropTypes.number,
                words: PropTypes.arrayOf(PropTypes.shape({
                    word: PropTypes.string,
                    confidence: PropTypes.number,
                })),
            })),
        }),
        singles: PropTypes.arrayOf(PropTypes.shape({
            topics: PropTypes.arrayOf(PropTypes.shape({
                confidence: PropTypes.number.isRequired,
                words: PropTypes.arrayOf(PropTypes.shape({
                    word: PropTypes.string.isRequired,
                    confidence: PropTypes.number.isRequired,
                })).isRequired,
            })).isRequired,
            doc_id: PropTypes.string,
        }).isRequired),
    }).isRequired,
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
            identifying_name: PropTypes.string.isRequired,
        })),
        to: PropTypes.arrayOf(PropTypes.shape({
            count: PropTypes.number,
            identifying_name: PropTypes.string.isRequired,
        })),
        from: PropTypes.arrayOf(PropTypes.shape({
            count: PropTypes.number,
            identifying_name: PropTypes.string.isRequired,
        })),
    }).isRequired,
    correspondentInfo: PropTypes.shape({
        aliases: PropTypes.arrayOf(PropTypes.string),
        aliases_from_signature: PropTypes.arrayOf(PropTypes.string),
        community: PropTypes.any,
        email_addresses: PropTypes.arrayOf(PropTypes.string),
        email_addresses_from_signature: PropTypes.arrayOf(PropTypes.string),
        hierarchy: PropTypes.any,
        identifying_name: PropTypes.string,
        numFound: PropTypes.number,
        phone_numbers_cell: PropTypes.arrayOf(PropTypes.string),
        phone_numbers_fax: PropTypes.arrayOf(PropTypes.string),
        phone_numbers_home: PropTypes.arrayOf(PropTypes.string),
        phone_numbers_office: PropTypes.arrayOf(PropTypes.string),
        role: PropTypes.any,
        signatures: PropTypes.arrayOf(PropTypes.string),
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
    identifyingName: PropTypes.string.isRequired,
    setCorrespondentIdentifyingName: PropTypes.func.isRequired,
    requestTerms: PropTypes.func.isRequired,
    requestTopicsForCorrespondent: PropTypes.func.isRequired,
    requestCorrespondents: PropTypes.func.isRequired,
    requestCorrespondentInfo: PropTypes.func.isRequired,
    requestMailboxAllEmails: PropTypes.func.isRequired,
    requestMailboxSentEmails: PropTypes.func.isRequired,
    requestMailboxReceivedEmails: PropTypes.func.isRequired,
    isFetchingTerms: PropTypes.bool.isRequired,
    isFetchingTopics: PropTypes.bool.isRequired,
    hasTopicsData: PropTypes.bool.isRequired,
    hasCorrespondentInfoData: PropTypes.bool.isRequired,
    isFetchingCorrespondents: PropTypes.bool.isRequired,
    isFetchingCorrespondentInfo: PropTypes.bool.isRequired,
    isFetchingMailboxAllEmails: PropTypes.bool.isRequired,
    isFetchingMailboxSentEmails: PropTypes.bool.isRequired,
    isFetchingMailboxReceivedEmails: PropTypes.bool.isRequired,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CorrespondentView));
