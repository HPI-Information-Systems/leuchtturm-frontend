import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
    Card,
    CardBody,
    CardHeader,
    Dropdown,
    DropdownItem,
    DropdownToggle,
    DropdownMenu,
    ListGroup,
    ListGroupItem,
} from 'reactstrap';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import FontAwesome from 'react-fontawesome';
import {
    setShouldFetchData,
    setEmailListSortation,
    requestEmailList,
    setCorrespondentListSortation,
    requestCorrespondentResult,
    requestEmailListDates,
    requestMatrixHighlighting,
    requestKeyphrases,
} from '../../actions/emailListViewActions';
import { updateSearchTerm, handleGlobalFilterChange } from '../../actions/globalFilterActions';
import EmailListCard from './EmailListCard/EmailListCard';
import Graph from '../Graph/Graph';
import CorrespondentList from '../CorrespondentList/CorrespondentList';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import Matrix from '../Matrix/Matrix';
import EmailListTimeline from '../EmailListTimeline/EmailListTimeline';
import './EmailListView.css';
import Spinner from '../Spinner/Spinner';
import TopicSpace from '../TopicSpace/TopicSpace';

const mapStateToProps = state => ({
    shouldFetchData: state.emailListView.shouldFetchData,
    emailList: state.emailListView.emailList,
    emailListCorrespondents: state.emailListView.emailListCorrespondents,
    emailListDates: state.emailListView.emailListDates,
    topicsForEmailList: state.emailListView.topicsForEmailList,
    matrixHighlighting: state.emailListView.matrixHighlighting,
    keyphrases: state.emailListView.keyphrases,
    globalFilter: state.globalFilter.filters,
});

const mapDispatchToProps = dispatch => bindActionCreators({
    setShouldFetchData,
    setEmailListSortation,
    requestEmailList,
    setCorrespondentListSortation,
    requestCorrespondentResult,
    requestEmailListDates,
    requestMatrixHighlighting,
    requestKeyphrases,
    updateSearchTerm,
    handleGlobalFilterChange,
}, dispatch);

function setSearchPageTitle(searchTerm) {
    if (!searchTerm) {
        document.title = 'Lampenhaus';
    } else {
        document.title = `Search - ${searchTerm}`;
    }
}

class EmailListView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            maximized: {
                correspondents: false,
                emailList: false,
                matrix: false,
                topics: false,
            },
            showCorrespondentsAsList: true,
            resultsPerPage: 50,
            activePageNumber: 1,
            topCorrespondentDropdownOpen: false,
        };

        this.toggleMaximize = this.toggleMaximize.bind(this);
        this.toggleShowCorrespondentsAsList = this.toggleShowCorrespondentsAsList.bind(this);
        this.toggleTopCorrespondentDropdown = this.toggleTopCorrespondentDropdown.bind(this);
        this.onPageNumberChange = this.onPageNumberChange.bind(this);
        this.searchFor = this.searchFor.bind(this);
    }

    componentDidMount() {
        let { searchTerm } = this.props.match.params;
        if (!searchTerm) {
            searchTerm = '';
        }
        this.props.updateSearchTerm(searchTerm);
        this.props.setShouldFetchData(true);
    }

    componentWillReceiveProps(nextProps) {
        const { searchTerm } = nextProps.globalFilter;
        setSearchPageTitle(searchTerm);
        if (nextProps.shouldFetchData) {
            this.requestAllData(nextProps);
        } else if (this.didEmailListSortationChange(nextProps)) {
            this.requestEmailDataForPage(nextProps, 1);
        } else if (this.didCorrespondentListSortationChange(nextProps)) {
            this.props.requestCorrespondentResult(nextProps.globalFilter, nextProps.emailListCorrespondents.sortation);
        }
    }

    onPageNumberChange(pageNumber) {
        this.requestEmailDataForPage(this.props, pageNumber);
    }

    requestAllData(props) {
        this.props.setShouldFetchData(false);
        this.requestEmailDataForPage(props, 1);
        this.props.requestCorrespondentResult(props.globalFilter, props.emailListCorrespondents.sortation);
        this.props.requestEmailListDates(props.globalFilter);
        this.props.requestMatrixHighlighting(props.globalFilter);
        this.props.requestKeyphrases(props.globalFilter);
    }

    requestEmailDataForPage(props, pageNumber) {
        this.setState({ activePageNumber: pageNumber });
        this.props.requestEmailList(
            props.globalFilter,
            this.state.resultsPerPage,
            pageNumber,
            props.emailList.sortation,
        );
    }

    toggleTopCorrespondentDropdown() {
        this.setState({ topCorrespondentDropdownOpen: !this.state.topCorrespondentDropdownOpen });
    }

    didEmailListSortationChange(props) {
        return props.emailList.sortation !== this.props.emailList.sortation;
    }

    didCorrespondentListSortationChange(props) {
        return props.emailListCorrespondents.sortation !== this.props.emailListCorrespondents.sortation;
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

    searchFor(searchTerm) {
        const newFilter = {
            ...this.props.globalFilter,
            searchTerm,
        };
        this.props.handleGlobalFilterChange(newFilter);
        this.props.setShouldFetchData(true);
    }

    render() {
        const identifyingNames =
            this.props.emailListCorrespondents.results.map(correspondent => correspondent.identifying_name);

        const showCorrespondentsList = this.state.maximized.correspondents || this.state.showCorrespondentsAsList;

        return (
            <div className="email-list-view grid-container">
                <div className={`grid-item email-list-container ${this.state.maximized.emailList ? 'maximized' : ''}`}>
                    <ErrorBoundary displayAsCard title="Emails">
                        <EmailListCard
                            emailList={this.props.emailList}
                            onPageNumberChange={this.onPageNumberChange}
                            resultsPerPage={this.state.resultsPerPage}
                            activePageNumber={this.state.activePageNumber}
                            setSortation={this.props.setEmailListSortation}
                            toggleMaximize={() => this.toggleMaximize('emailList')}
                            isMaximized={this.state.maximized.emailList}
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
                                {!this.props.emailListCorrespondents.isFetching &&
                                    this.props.emailListCorrespondents.results.length > 0 &&
                                    <div className="pull-right">
                                        <Dropdown
                                            isOpen={this.state.topCorrespondentDropdownOpen}
                                            toggle={this.toggleTopCorrespondentDropdown}
                                            size="sm"
                                            className="d-inline-block card-header-dropdown mr-2"
                                        >
                                            <DropdownToggle caret>
                                                {this.props.emailListCorrespondents.sortation || 'Number of Emails'}
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
                            {this.props.emailListCorrespondents.hasRequestError ?
                                <CardBody className="text-danger">
                                    An error occurred while requesting the Top Correspondents.
                                </CardBody>
                                :
                                <CardBody>
                                    <CorrespondentList
                                        correspondents={this.props.emailListCorrespondents.results}
                                        isFetching={this.props.emailListCorrespondents.isFetching}
                                    />
                                </CardBody>}
                        </Card>
                    </ErrorBoundary>
                    <ErrorBoundary displayAsCard title="Top Correspondents Network">
                        <Graph
                            title="Top Correspondents Network"
                            isFetchingCorrespondents={this.props.emailListCorrespondents.isFetching}
                            identifyingNames={identifyingNames}
                            view="EmailList"
                            toggleMaximize={() => this.toggleMaximize('correspondents')}
                            isMaximized={this.state.maximized.correspondents}
                            toggleShowCorrespondentsAsList={this.toggleShowCorrespondentsAsList}
                            show={!this.state.showCorrespondentsAsList}
                        />
                    </ErrorBoundary>
                </div>
                <div className="grid-item keyphrases-container">
                    <ErrorBoundary displayAsCard title="Top Phrases">
                        <Card>
                            <CardHeader tag="h4">
                                Top Phrases
                            </CardHeader>
                            {this.props.keyphrases.hasRequestError ?
                                <CardBody className="text-danger">
                                    An error occurred while requesting the Keyphrases.
                                </CardBody>
                                :
                                <CardBody>
                                    {this.props.keyphrases.isFetching ?
                                        <Spinner />
                                        :
                                        <ListGroup>
                                            {this.props.keyphrases.results.map(phrase => (
                                                <ListGroupItem>
                                                    <Link
                                                        to={`/search/${phrase}`}
                                                        onClick={() => this.searchFor(phrase)}
                                                    >
                                                        {phrase}
                                                    </Link>
                                                </ListGroupItem>))}
                                        </ListGroup>
                                    }
                                </CardBody>}
                        </Card>
                    </ErrorBoundary>
                </div>
                <div className="grid-item timeline-container">
                    <ErrorBoundary displayAsCard title="Timeline">
                        <EmailListTimeline
                            className="term-timeline"
                            dates={this.props.emailListDates.results}
                            isFetching={this.props.emailListDates.isFetching}
                            hasData={this.props.emailListDates.hasData}
                            hasRequestError={this.props.emailListDates.hasRequestError}
                            setShouldFetchData={this.props.setShouldFetchData}
                            globalFilter={this.props.globalFilter}
                            handleGlobalFilterChange={this.props.handleGlobalFilterChange}
                        />
                    </ErrorBoundary>
                </div>
                <div className={`grid-item topic-spaces-container ${this.state.maximized.topics ? 'maximized' : ''}`}>
                    <ErrorBoundary displayAsCard title="Topics">
                        <Card>
                            <CardHeader tag="h4">Topics
                                {this.props.topicsForEmailList.hasData &&
                                    <FontAwesome
                                        className="pull-right blue-button"
                                        name={this.state.maximized.topics ? 'times' : 'arrows-alt'}
                                        onClick={() => this.toggleMaximize('topics')}
                                    />}
                            </CardHeader>
                            <CardBody className="topic-card">
                                {this.props.topicsForEmailList.isFetching ?
                                    <Spinner /> :
                                    this.props.topicsForEmailList.hasData &&
                                    <TopicSpace
                                        topics={this.props.topicsForEmailList.results}
                                        setShouldFetchData={this.props.setShouldFetchData}
                                        globalFilter={this.props.globalFilter}
                                        handleGlobalFilterChange={this.props.handleGlobalFilterChange}
                                        outerSpaceSize={this.state.maximized.topics ? 400 : 200}
                                    />}
                            </CardBody>
                        </Card>
                    </ErrorBoundary>
                </div>
                <div className={`grid-item matrix-card-container ${this.state.maximized.matrix && 'maximized'}`}>
                    <ErrorBoundary displayAsCard title="Communication Patterns">
                        <Matrix
                            maximized={this.state.maximized.matrix}
                            matrixHighlighting={this.props.matrixHighlighting}
                            toggleMaximize={() => this.toggleMaximize('matrix')}
                            globalFilter={this.props.globalFilter}
                        />
                    </ErrorBoundary>
                </div>
            </div>
        );
    }
}

EmailListView.propTypes = {
    match: PropTypes.shape({
        params: PropTypes.shape({
            searchTerm: PropTypes.string,
        }),
    }).isRequired,
    handleGlobalFilterChange: PropTypes.func.isRequired,
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
    shouldFetchData: PropTypes.bool.isRequired,
    setShouldFetchData: PropTypes.func.isRequired,
    setEmailListSortation: PropTypes.func.isRequired,
    updateSearchTerm: PropTypes.func.isRequired,
    requestEmailList: PropTypes.func.isRequired,
    setCorrespondentListSortation: PropTypes.func.isRequired,
    requestCorrespondentResult: PropTypes.func.isRequired,
    requestEmailListDates: PropTypes.func.isRequired,
    requestMatrixHighlighting: PropTypes.func.isRequired,
    requestKeyphrases: PropTypes.func.isRequired,
    emailList: PropTypes.shape({
        isFetching: PropTypes.bool.isRequired,
        hasRequestError: PropTypes.bool.isRequired,
        results: PropTypes.array.isRequired,
        number: PropTypes.number.isRequired,
        sortation: PropTypes.string.isRequired,
    }).isRequired,
    emailListCorrespondents: PropTypes.shape({
        isFetching: PropTypes.bool.isRequired,
        hasRequestError: PropTypes.bool.isRequired,
        results: PropTypes.array.isRequired,
        sortation: PropTypes.string.isRequired,
    }).isRequired,
    emailListDates: PropTypes.shape({
        isFetching: PropTypes.bool.isRequired,
        hasRequestError: PropTypes.bool.isRequired,
        results: PropTypes.shape.isRequired,
        hasData: PropTypes.bool.isRequired,
    }).isRequired,
    matrixHighlighting: PropTypes.shape({
        isFetching: PropTypes.bool.isRequired,
        hasRequestError: PropTypes.bool.isRequired,
        results: PropTypes.array.isRequired,
        hasData: PropTypes.bool.isRequired,
    }).isRequired,
    keyphrases: PropTypes.shape({
        isFetching: PropTypes.bool.isRequired,
        hasRequestError: PropTypes.bool.isRequired,
        results: PropTypes.array.isRequired,
        hasData: PropTypes.bool.isRequired,
    }).isRequired,
    topicsForEmailList: PropTypes.shape({
        isFetching: PropTypes.bool.isRequired,
        hasData: PropTypes.bool.isRequired,
        hasRequestError: PropTypes.bool.isRequired,
        results: PropTypes.shape({
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
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(EmailListView));
