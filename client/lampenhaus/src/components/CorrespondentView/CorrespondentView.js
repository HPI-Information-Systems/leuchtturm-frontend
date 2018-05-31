import React, { Component } from 'react';
import {
    Col,
    Container,
    Row,
    Card,
    CardBody,
    CardHeader,
} from 'reactstrap';
import FontAwesome from 'react-fontawesome';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import _ from 'lodash';
import { withRouter } from 'react-router';
import CorrespondentList from '../CorrespondentList/CorrespondentList';
import TermList from './TermList/TermList';
import Graph from '../Graph/Graph';
import TopicSpace from '../TopicSpace/TopicSpace';
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
                correspondents: false,
                mailbox: false,
                topics: false,
            },
            showCorrespondentsAsList: true,
        };

        const { identifyingName } = props.match.params;

        this.toggleShowCorrespondentsAsList = this.toggleShowCorrespondentsAsList.bind(this);

        props.setCorrespondentIdentifyingName(identifyingName, this.props.globalFilter);
        props.requestTerms(identifyingName, this.props.globalFilter);
        props.requestCorrespondentInfo(identifyingName);
        props.requestCorrespondents(identifyingName, this.props.globalFilter);
        props.requestTopicsForCorrespondent(identifyingName, this.props.globalFilter);
        props.requestMailboxAllEmails(identifyingName, this.props.globalFilter);
        props.requestMailboxReceivedEmails(identifyingName, this.props.globalFilter);
        props.requestMailboxSentEmails(identifyingName, this.props.globalFilter);
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

    toggleShowCorrespondentsAsList() {
        this.setState({ showCorrespondentsAsList: !this.state.showCorrespondentsAsList });
    }

    render() {
        const showCorrespondentsList = this.state.maximized.correspondents || this.state.showCorrespondentsAsList;

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
                    <Col sm="6" className={this.state.maximized.mailbox ? 'maximized' : ''}>
                        <Card>
                            <CardHeader tag="h4">
                                Mailbox
                                <FontAwesome
                                    className="blue-button pull-right"
                                    name={this.state.maximized.mailbox ? 'times' : 'arrows-alt'}
                                    onClick={() => this.toggleMaximize('mailbox')}
                                />
                            </CardHeader>
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
                    <Col sm="6" className={this.state.maximized.correspondents ? 'maximized' : ''}>
                        <Card className={`top-correspondents ${showCorrespondentsList ? '' : 'd-none'}`}>
                            <CardHeader tag="h4">
                                Top Correspondents
                                <div className="pull-right">
                                    <FontAwesome
                                        className="blue-button mr-2"
                                        name="share-alt"
                                        onClick={this.toggleShowCorrespondentsAsList}
                                    />
                                    <FontAwesome
                                        className="blue-button"
                                        name={this.state.maximized.correspondents ? 'times' : 'arrows-alt'}
                                        onClick={() => this.toggleMaximize('correspondents')}
                                    />
                                </div>
                            </CardHeader>
                            <CardBody>
                                <CorrespondentList
                                    correspondentsAll={this.props.correspondents.all}
                                    correspondentsTo={this.props.correspondents.to}
                                    correspondentsFrom={this.props.correspondents.from}
                                    isFetching={this.props.isFetchingCorrespondents}
                                />
                            </CardBody>
                        </Card>
                        <Graph
                            title="Communication Network"
                            correspondentsList={this.props.correspondents.all}
                            identifyingNames={[this.props.identifyingName]}
                            view="correspondent"
                            isFetchingCorrespondents={this.props.isFetchingCorrespondents}
                            toggleMaximize={() => this.toggleMaximize('correspondents')}
                            isMaximized={this.state.maximized.correspondents}
                            toggleShowCorrespondentsAsList={this.toggleShowCorrespondentsAsList}
                            show={!this.state.showCorrespondentsAsList}
                        />
                    </Col>
                    <Col sm="6" className={this.state.maximized.topics ? 'maximized' : ''}>
                        <Card>
                            <CardHeader tag="h4">Topics
                                <FontAwesome
                                    className="pull-right blue-button"
                                    name={this.state.maximized.topics ? 'times' : 'arrows-alt'}
                                    onClick={() => {
                                        this.toggleMaximize('topics');
                                    }
                                    }
                                />
                            </CardHeader>
                            <CardBody className="topic-card">
                                {this.props.isFetchingTopics ?
                                    <Spinner />
                                    : this.props.hasTopicsData && <TopicSpace
                                        ref={(topicSpace) => { this.topicSpace = topicSpace; }}
                                        topics={this.props.topics}
                                        outerSpaceSize={this.state.maximized.topics ? 350 : 200}
                                    />
                                }
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
