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
    requestCorrespondentsForCorrespondent,
    requestCorrespondentInfo,
    requestTermsForCorrespondent,
    requestTopicsForCorrespondent,
    requestMailboxAllEmails,
    requestMailboxReceivedEmails,
    requestMailboxSentEmails,
} from '../../actions/correspondentViewActions';
import Mailbox from './Mailbox/Mailbox';
import CorrespondentInfo from './CorrespondentInfo/CorrespondentInfo';
import Spinner from '../Spinner/Spinner';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';

const mapStateToProps = state => ({
    globalFilter: state.globalFilter.filters,
    identifyingName: state.correspondentView.identifyingName,
    termsForCorrespondent: state.correspondentView.termsForCorrespondent,
    topicsForCorrespondent: state.correspondentView.topicsForCorrespondent,
    correspondentsForCorrespondent: state.correspondentView.correspondentsForCorrespondent,
    correspondentInfo: state.correspondentView.correspondentInfo,
    mailboxAllEmails: state.correspondentView.mailboxAllEmails,
    mailboxSentEmails: state.correspondentView.mailboxSentEmails,
    mailboxReceivedEmails: state.correspondentView.mailboxReceivedEmails,
});

const mapDispatchToProps = dispatch => bindActionCreators({
    setCorrespondentIdentifyingName,
    requestCorrespondentInfo,
    requestCorrespondentsForCorrespondent,
    requestTermsForCorrespondent,
    requestTopicsForCorrespondent,
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
        this.toggleShowCorrespondentsAsList = this.toggleShowCorrespondentsAsList.bind(this);
    }

    componentWillMount() {
        this.getAllDataForCorrespondent();
    }

    componentDidUpdate(prevProps) {
        document.title = `Correspondent - ${this.props.identifyingName}`;
        if (this.didCorrespondentViewParametersChange(prevProps)) {
            this.getAllDataForCorrespondent();
        }
    }

    getAllDataForCorrespondent() {
        const { identifyingName } = this.props.match.params;
        this.props.setCorrespondentIdentifyingName(identifyingName, this.props.globalFilter);
        this.props.requestTermsForCorrespondent(identifyingName, this.props.globalFilter);
        this.props.requestCorrespondentInfo(identifyingName);
        this.props.requestCorrespondentsForCorrespondent(identifyingName, this.props.globalFilter);
        this.props.requestTopicsForCorrespondent(identifyingName, this.props.globalFilter);
        this.props.requestMailboxAllEmails(identifyingName, this.props.globalFilter);
        this.props.requestMailboxReceivedEmails(identifyingName, this.props.globalFilter);
        this.props.requestMailboxSentEmails(identifyingName, this.props.globalFilter);
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
                        <ErrorBoundary displayAsCard title={this.props.identifyingName}>
                            <Card>
                                <CardHeader tag="h4">{this.props.identifyingName}</CardHeader>
                                {this.props.correspondentInfo.hasRequestError ?
                                    <CardBody className="text-danger">
                                        An error occurred while requesting Correspondent Info.
                                    </CardBody> :
                                    <CardBody>
                                        <CorrespondentInfo
                                            correspondentInfo={this.props.correspondentInfo.data}
                                            isFetchingCorrespondentInfo={this.props.correspondentInfo.isFetching}
                                            hasCorrespondentInfoData={this.props.correspondentInfo.hasData}
                                        />
                                    </CardBody>}
                            </Card>
                        </ErrorBoundary>
                    </Col>
                    <Col sm="6" className={this.state.maximized.mailbox ? 'maximized' : ''}>
                        <ErrorBoundary displayAsCard title="Mailbox">
                            <Card>
                                <CardHeader tag="h4">
                                    Mailbox
                                    {this.props.mailboxAllEmails.data.length > 0 &&
                                        <FontAwesome
                                            className="blue-button pull-right"
                                            name={this.state.maximized.mailbox ? 'times' : 'arrows-alt'}
                                            onClick={() => this.toggleMaximize('mailbox')}
                                        />}
                                </CardHeader>
                                <CardBody>
                                    <Mailbox
                                        allEmails={this.props.mailboxAllEmails}
                                        receivedEmails={this.props.mailboxReceivedEmails}
                                        sentEmails={this.props.mailboxSentEmails}
                                    />
                                </CardBody>
                            </Card>
                        </ErrorBoundary>
                    </Col>
                    <Col sm="3">
                        <ErrorBoundary displayAsCard title="Top Terms">
                            <Card>
                                <CardHeader tag="h4">Top Terms</CardHeader>
                                {this.props.termsForCorrespondent.hasRequestError ?
                                    <CardBody className="text-danger">
                                        An error occurred while requesting the Top Terms.
                                    </CardBody> :
                                    <CardBody>
                                        <TermList
                                            identifyingName={this.props.identifyingName}
                                            terms={this.props.termsForCorrespondent.data}
                                            isFetching={this.props.termsForCorrespondent.isFetching}
                                        />
                                    </CardBody>}
                            </Card>
                        </ErrorBoundary>
                    </Col>
                    <Col sm="6" className={this.state.maximized.correspondents ? 'maximized' : ''}>
                        <ErrorBoundary displayAsCard title="Top Correspondents">
                            <Card className={`top-correspondents ${showCorrespondentsList ? '' : 'd-none'}`}>
                                <CardHeader tag="h4">
                                    Top Correspondents
                                    {this.props.correspondentsForCorrespondent.data.all &&
                                    this.props.correspondentsForCorrespondent.data.all.length > 0 &&
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
                                        </div>}
                                </CardHeader>
                                {this.props.correspondentsForCorrespondent.hasRequestError ?
                                    <CardBody className="text-danger">
                                        An error occurred while requesting the Top Correspondents.
                                    </CardBody> :
                                    <CardBody>
                                        <CorrespondentList
                                            correspondentsAll={this.props.correspondentsForCorrespondent.data.all}
                                            correspondentsTo={this.props.correspondentsForCorrespondent.data.to}
                                            correspondentsFrom={this.props.correspondentsForCorrespondent.data.from}
                                            isFetching={this.props.correspondentsForCorrespondent.isFetching}
                                        />
                                    </CardBody>}
                            </Card>
                        </ErrorBoundary>
                        <ErrorBoundary displayAsCard title="Communication Network">
                            <Graph
                                title="Communication Network"
                                correspondentsList={this.props.correspondentsForCorrespondent.data.all}
                                identifyingNames={[this.props.identifyingName]}
                                view="correspondent"
                                isFetchingCorrespondents={this.props.correspondentsForCorrespondent.isFetching}
                                toggleMaximize={() => this.toggleMaximize('correspondents')}
                                isMaximized={this.state.maximized.correspondents}
                                toggleShowCorrespondentsAsList={this.toggleShowCorrespondentsAsList}
                                show={!this.state.showCorrespondentsAsList}
                            />
                        </ErrorBoundary>
                    </Col>
                    <Col sm="6" className={this.state.maximized.topics ? 'maximized' : ''}>
                        <ErrorBoundary displayAsCard title="Topics">
                            <Card>
                                <CardHeader tag="h4">Topics
                                    {this.props.topicsForCorrespondent.hasData &&
                                        <FontAwesome
                                            className="pull-right blue-button"
                                            name={this.state.maximized.topics ? 'times' : 'arrows-alt'}
                                            onClick={() => this.toggleMaximize('topics')}
                                        />}
                                </CardHeader>
                                <CardBody className="topic-card">
                                    {this.props.topicsForCorrespondent.isFetching ?
                                        <Spinner /> :
                                        this.props.topicsForCorrespondent.hasData &&
                                        <TopicSpace
                                            ref={(topicSpace) => { this.topicSpace = topicSpace; }}
                                            topics={this.props.topicsForCorrespondent.data}
                                            outerSpaceSize={this.state.maximized.topics ? 350 : 200}
                                        />}
                                </CardBody>
                            </Card>
                        </ErrorBoundary>
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
    setCorrespondentIdentifyingName: PropTypes.func.isRequired,
    requestTermsForCorrespondent: PropTypes.func.isRequired,
    requestTopicsForCorrespondent: PropTypes.func.isRequired,
    requestCorrespondentsForCorrespondent: PropTypes.func.isRequired,
    requestCorrespondentInfo: PropTypes.func.isRequired,
    requestMailboxAllEmails: PropTypes.func.isRequired,
    requestMailboxSentEmails: PropTypes.func.isRequired,
    requestMailboxReceivedEmails: PropTypes.func.isRequired,
    identifyingName: PropTypes.string.isRequired,
    correspondentInfo: PropTypes.shape({
        isFetching: PropTypes.bool.isRequired,
        hasData: PropTypes.bool.isRequired,
        hasRequestError: PropTypes.bool.isRequired,
        data: PropTypes.shape({
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
    }).isRequired,
    topicsForCorrespondent: PropTypes.shape({
        isFetching: PropTypes.bool.isRequired,
        hasData: PropTypes.bool.isRequired,
        hasRequestError: PropTypes.bool.isRequired,
        data: PropTypes.shape({
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
    }).isRequired,
    correspondentsForCorrespondent: PropTypes.shape({
        isFetching: PropTypes.bool.isRequired,
        hasData: PropTypes.bool.isRequired,
        hasRequestError: PropTypes.bool.isRequired,
        data: PropTypes.shape({
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
    }).isRequired,
    termsForCorrespondent: PropTypes.shape({
        isFetching: PropTypes.bool.isRequired,
        hasData: PropTypes.bool.isRequired,
        hasRequestError: PropTypes.bool.isRequired,
        data: PropTypes.arrayOf(PropTypes.shape({
            entity: PropTypes.string.isRequired,
            count: PropTypes.number.isRequired,
            type: PropTypes.string.isRequired,
        })).isRequired,
    }).isRequired,
    mailboxAllEmails: PropTypes.shape({
        isFetching: PropTypes.bool.isRequired,
        hasData: PropTypes.bool.isRequired,
        hasRequestError: PropTypes.bool.isRequired,
        data: PropTypes.arrayOf(PropTypes.shape({
            body: PropTypes.string.isRequired,
            doc_id: PropTypes.string.isRequired,
            header: PropTypes.shape({
                subject: PropTypes.string.isRequired,
                date: PropTypes.string.isRequired,
            }).isRequired,
        })).isRequired,
    }).isRequired,
    mailboxSentEmails: PropTypes.shape({
        isFetching: PropTypes.bool.isRequired,
        hasData: PropTypes.bool.isRequired,
        hasRequestError: PropTypes.bool.isRequired,
        data: PropTypes.arrayOf(PropTypes.shape({
            body: PropTypes.string.isRequired,
            doc_id: PropTypes.string.isRequired,
            header: PropTypes.shape({
                subject: PropTypes.string.isRequired,
                date: PropTypes.string.isRequired,
            }).isRequired,
        })).isRequired,
    }).isRequired,
    mailboxReceivedEmails: PropTypes.shape({
        isFetching: PropTypes.bool.isRequired,
        hasData: PropTypes.bool.isRequired,
        hasRequestError: PropTypes.bool.isRequired,
        data: PropTypes.arrayOf(PropTypes.shape({
            body: PropTypes.string.isRequired,
            doc_id: PropTypes.string.isRequired,
            header: PropTypes.shape({
                subject: PropTypes.string.isRequired,
                date: PropTypes.string.isRequired,
            }).isRequired,
        })).isRequired,
    }).isRequired,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CorrespondentView));
