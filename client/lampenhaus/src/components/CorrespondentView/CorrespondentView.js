import React, { Component } from 'react';
import {
    Card,
    CardBody,
    CardHeader,
    Dropdown,
    DropdownItem,
    DropdownToggle,
    DropdownMenu,
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
    setShouldFetchData,
    setCorrespondentIdentifyingName,
    setCorrespondentListSortation,
    requestCorrespondentsForCorrespondent,
    requestCorrespondentInfo,
    requestTermsForCorrespondent,
    requestTopicsForCorrespondent,
    requestMailboxAllEmails,
    requestMailboxReceivedEmails,
    requestMailboxSentEmails,
    requestEmailDates,
    requestClassesForCorrespondent,
} from '../../actions/correspondentViewActions';
import { handleGlobalFilterChange } from '../../actions/globalFilterActions';
import Mailbox from './Mailbox/Mailbox';
import CategoryChart from './CategoryChart/CategoryChart';
import CorrespondentInfo from './CorrespondentInfo/CorrespondentInfo';
import Spinner from '../Spinner/Spinner';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import EmailListTimeline from '../EmailListTimeline/EmailListTimeline';

const mapStateToProps = state => ({
    globalFilter: state.globalFilter.filters,
    shouldFetchData: state.correspondentView.shouldFetchData,
    identifyingName: state.correspondentView.identifyingName,
    termsForCorrespondent: state.correspondentView.termsForCorrespondent,
    topicsForCorrespondent: state.correspondentView.topicsForCorrespondent,
    correspondentsForCorrespondent: state.correspondentView.correspondentsForCorrespondent,
    correspondentInfo: state.correspondentView.correspondentInfo,
    mailboxAllEmails: state.correspondentView.mailboxAllEmails,
    mailboxSentEmails: state.correspondentView.mailboxSentEmails,
    mailboxReceivedEmails: state.correspondentView.mailboxReceivedEmails,
    emailDates: state.correspondentView.emailDates,
    classesForCorrespondent: state.correspondentView.classesForCorrespondent,
});

const mapDispatchToProps = dispatch => bindActionCreators({
    setShouldFetchData,
    setCorrespondentIdentifyingName,
    requestCorrespondentInfo,
    setCorrespondentListSortation,
    requestCorrespondentsForCorrespondent,
    requestTermsForCorrespondent,
    requestTopicsForCorrespondent,
    requestMailboxAllEmails,
    requestMailboxReceivedEmails,
    requestMailboxSentEmails,
    requestEmailDates,
    requestClassesForCorrespondent,
    handleGlobalFilterChange,
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
            topCorrespondentDropdownOpen: false,
        };
        this.toggleShowCorrespondentsAsList = this.toggleShowCorrespondentsAsList.bind(this);
        this.toggleTopCorrespondentDropdown = this.toggleTopCorrespondentDropdown.bind(this);
    }

    componentDidMount() {
        this.props.setShouldFetchData(true);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.shouldFetchData) {
            this.getAllDataForCorrespondent(nextProps);
        } else if (this.didCorrespondentListSortationChange(nextProps)) {
            this.props.requestCorrespondentsForCorrespondent(
                nextProps.match.params.identifyingName,
                nextProps.globalFilter,
                nextProps.correspondentsForCorrespondent.sortation,
            );
        }
    }

    componentDidUpdate(prevProps) {
        document.title = `Correspondent - ${this.props.identifyingName}`;
        if (this.didCorrespondentViewParametersChange(prevProps)) {
            this.getAllDataForCorrespondent(this.props);
        }
    }

    getAllDataForCorrespondent(nextProps) {
        const { identifyingName } = nextProps.match.params;
        this.props.setShouldFetchData(false);
        this.props.setCorrespondentIdentifyingName(identifyingName, nextProps.globalFilter);
        this.props.requestTermsForCorrespondent(identifyingName, nextProps.globalFilter);
        this.props.requestCorrespondentInfo(identifyingName);
        this.props.requestCorrespondentsForCorrespondent(
            identifyingName,
            nextProps.globalFilter,
            nextProps.correspondentsForCorrespondent.sortation,
        );
        this.props.requestTopicsForCorrespondent(identifyingName, nextProps.globalFilter);
        this.props.requestMailboxAllEmails(identifyingName, nextProps.globalFilter);
        this.props.requestMailboxReceivedEmails(identifyingName, nextProps.globalFilter);
        this.props.requestMailboxSentEmails(identifyingName, nextProps.globalFilter);
        this.props.requestClassesForCorrespondent(identifyingName, nextProps.globalFilter);
        this.props.requestEmailDates(identifyingName, nextProps.globalFilter);
        this.props.requestTopicsForCorrespondent(identifyingName, nextProps.globalFilter);
    }

    didCorrespondentViewParametersChange(prevProps) {
        return (
            prevProps.match.params.identifyingName !== this.props.match.params.identifyingName ||
            !_.isEqual(prevProps.globalFilter, this.props.globalFilter)
        );
    }

    didCorrespondentListSortationChange(props) {
        return props.correspondentsForCorrespondent.sortation !== this.props.correspondentsForCorrespondent.sortation;
    }

    toggleMaximize(componentName) {
        this.setState({
            maximized: {
                ...this.state.maximized,
                [componentName]: !this.state.maximized[componentName],
            },
        });
    }

    toggleTopCorrespondentDropdown() {
        this.setState({ topCorrespondentDropdownOpen: !this.state.topCorrespondentDropdownOpen });
    }

    toggleShowCorrespondentsAsList() {
        this.setState({ showCorrespondentsAsList: !this.state.showCorrespondentsAsList });
    }

    render() {
        const showCorrespondentsList = this.state.maximized.correspondents || this.state.showCorrespondentsAsList;

        return (
            <div className="correspondent-view grid-container">
                <div className="grid-item info-card-container">
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
                </div>
                <div className="grid-item categories-container">
                    <ErrorBoundary displayAsCard title="Categories">
                        <Card className="categories-card">
                            <CardHeader tag="h4">Categories</CardHeader>
                            {this.props.classesForCorrespondent.hasRequestError ?
                                <CardBody className="text-danger">
                                    An error occurred while requesting Correspondent Classes.
                                </CardBody> :
                                <CardBody>
                                    <CategoryChart
                                        categories={this.props.classesForCorrespondent.data}
                                        isFetching={this.props.classesForCorrespondent.isFetching}
                                    />
                                </CardBody>}
                        </Card>
                    </ErrorBoundary>
                </div>
                <div className={`grid-item mailbox-container ${this.state.maximized.mailbox ? 'maximized' : ''}`}>
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
                </div>
                <div className="grid-item top-phrases-container">
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
                </div>
                <div className="grid-item timeline-container">
                    <ErrorBoundary displayAsCard title="Timeline">
                        <EmailListTimeline
                            className="correspondent-timeline"
                            dates={this.props.emailDates.data}
                            isFetching={this.props.emailDates.isFetching}
                            hasData={this.props.emailDates.hasData}
                            hasRequestError={this.props.emailDates.hasRequestError}
                            setShouldFetchData={this.props.setShouldFetchData}
                            globalFilter={this.props.globalFilter}
                            handleGlobalFilterChange={this.props.handleGlobalFilterChange}
                        />
                    </ErrorBoundary>
                </div>
                <div
                    className={
                        `grid-item top-correspondents-container
                        ${this.state.maximized.correspondents ? 'maximized' : ''}`
                    }
                >
                    <ErrorBoundary displayAsCard title="Top Correspondents">
                        <Card className={`top-correspondents ${showCorrespondentsList ? '' : 'd-none'}`}>
                            <CardHeader tag="h4">
                                Top Correspondents
                                {this.props.correspondentsForCorrespondent.data.all &&
                                this.props.correspondentsForCorrespondent.data.all.length > 0 &&
                                <div className="pull-right">
                                    <Dropdown
                                        isOpen={this.state.topCorrespondentDropdownOpen}
                                        toggle={this.toggleTopCorrespondentDropdown}
                                        size="sm"
                                        className="d-inline-block card-header-dropdown mr-2"
                                    >
                                        <DropdownToggle caret>
                                            {this.props.correspondentsForCorrespondent.sortation ||
                                            'Number of Emails'}
                                        </DropdownToggle>
                                        <DropdownMenu>
                                            <DropdownItem header>Sort by</DropdownItem>
                                            <DropdownItem
                                                onClick={e =>
                                                    this.props.setCorrespondentListSortation(e.target.innerHTML)}
                                            >
                                                Number of Emails
                                            </DropdownItem>
                                            <DropdownItem
                                                onClick={e =>
                                                    this.props.setCorrespondentListSortation(e.target.innerHTML)}
                                            >
                                                Hierarchy Score
                                            </DropdownItem>
                                        </DropdownMenu>
                                    </Dropdown>
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
                                }
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
                </div>
                <div className={`grid-item topic-spaces-container ${this.state.maximized.topics ? 'maximized' : ''}`}>
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
                                        globalFilter={this.props.globalFilter}
                                        handleGlobalFilterChange={this.props.handleGlobalFilterChange}
                                        setShouldFetchData={this.props.setShouldFetchData}
                                        outerSpaceSize={this.state.maximized.topics ? 350 : 200}
                                    />}
                            </CardBody>
                        </Card>
                    </ErrorBoundary>
                </div>
            </div>
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
    handleGlobalFilterChange: PropTypes.func.isRequired,
    setShouldFetchData: PropTypes.func.isRequired,
    shouldFetchData: PropTypes.bool.isRequired,
    setCorrespondentIdentifyingName: PropTypes.func.isRequired,
    requestTermsForCorrespondent: PropTypes.func.isRequired,
    requestTopicsForCorrespondent: PropTypes.func.isRequired,
    requestCorrespondentsForCorrespondent: PropTypes.func.isRequired,
    requestCorrespondentInfo: PropTypes.func.isRequired,
    requestMailboxAllEmails: PropTypes.func.isRequired,
    requestMailboxSentEmails: PropTypes.func.isRequired,
    requestMailboxReceivedEmails: PropTypes.func.isRequired,
    requestClassesForCorrespondent: PropTypes.func.isRequired,
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
        sortation: PropTypes.string.isRequired,
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
    requestEmailDates: PropTypes.func.isRequired,
    emailDates: PropTypes.shape({
        isFetching: PropTypes.bool.isRequired,
        hasRequestError: PropTypes.bool.isRequired,
        data: PropTypes.shape.isRequired,
        hasData: PropTypes.bool.isRequired,
    }).isRequired,
    classesForCorrespondent: PropTypes.shape({
        isFetching: PropTypes.bool.isRequired,
        hasData: PropTypes.bool.isRequired,
        hasRequestError: PropTypes.bool.isRequired,
        data: PropTypes.array.isRequired,
    }).isRequired,
    setCorrespondentListSortation: PropTypes.func.isRequired,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CorrespondentView));
