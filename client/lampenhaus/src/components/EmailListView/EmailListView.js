import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
    Card,
    CardBody,
    CardHeader,
} from 'reactstrap';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { withRouter } from 'react-router';
import FontAwesome from 'react-fontawesome';
import {
    requestEmailList,
    requestCorrespondentResult,
    requestEmailListDates,
    setSortation,
    requestMatrixHighlighting,
} from '../../actions/emailListViewActions';
import { updateSearchTerm } from '../../actions/globalFilterActions';
import EmailListCard from './EmailListCard/EmailListCard';
import Graph from '../Graph/Graph';
import CorrespondentList from '../CorrespondentList/CorrespondentList';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import Matrix from '../Matrix/Matrix';
import EmailListHistogram from '../EmailListHistogram/EmailListHistogram';
import './EmailListView.css';

const mapStateToProps = state => ({
    emailList: state.emailListView.emailList,
    emailListCorrespondents: state.emailListView.emailListCorrespondents,
    emailListDates: state.emailListView.emailListDates,
    matrixHighlighting: state.emailListView.matrixHighlighting,
    globalFilter: state.globalFilter.filters,
});

const mapDispatchToProps = dispatch => bindActionCreators({
    updateSearchTerm,
    requestEmailList,
    requestCorrespondentResult,
    requestEmailListDates,
    setSortation,
    requestMatrixHighlighting,
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
            },
            showCorrespondentsAsList: true,
            resultsPerPage: 50,
            activePageNumber: 1,
        };

        this.toggleMaximize = this.toggleMaximize.bind(this);
        this.toggleShowCorrespondentsAsList = this.toggleShowCorrespondentsAsList.bind(this);
        this.onPageNumberChange = this.onPageNumberChange.bind(this);
    }

    componentDidMount() {
        let { searchTerm } = this.props.match.params;
        if (!searchTerm) searchTerm = '';
        setSearchPageTitle(searchTerm);
        this.props.updateSearchTerm(searchTerm);
        this.props.requestEmailList(
            this.props.globalFilter,
            this.state.resultsPerPage,
            1,
            this.props.emailList.sortation,
        );
        this.props.requestCorrespondentResult(this.props.globalFilter);
        this.props.requestEmailListDates(this.props.globalFilter);
    }

    componentWillReceiveProps(nextProps) {
        if (this.didGlobalFilterChange(nextProps) || this.didSortationChange(nextProps)) {
            this.setPageNumberTo(1);
        }
    }

    componentDidUpdate(prevProps) {
        const { searchTerm } = this.props.globalFilter;
        setSearchPageTitle(searchTerm);
        if (this.didGlobalFilterChange(prevProps)) {
            this.props.requestEmailList(
                this.props.globalFilter,
                this.state.resultsPerPage,
                this.state.activePageNumber,
                this.props.emailList.sortation,
            );
            this.props.requestCorrespondentResult(this.props.globalFilter);
            this.props.requestEmailListDates(this.props.globalFilter);
            this.props.requestMatrixHighlighting(this.props.globalFilter);
        } else if (this.didSortationChange(prevProps)) {
            this.props.requestEmailList(
                this.props.globalFilter,
                this.state.resultsPerPage,
                this.state.activePageNumber,
                this.props.emailList.sortation,
            );
        }
    }

    onPageNumberChange(pageNumber) {
        this.setPageNumberTo(pageNumber);
        this.props.requestEmailList(
            this.props.globalFilter,
            this.state.resultsPerPage,
            pageNumber,
            this.props.emailList.sortation,
        );
    }

    setPageNumberTo(pageNumber) {
        this.setState({ activePageNumber: pageNumber });
    }

    didGlobalFilterChange(props) {
        return !_.isEqual(props.globalFilter, this.props.globalFilter);
    }

    didSortationChange(props) {
        return props.emailList.sortation !== this.props.emailList.sortation;
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
        const identifyingNames =
            this.props.emailListCorrespondents.results.map(correspondent => correspondent.identifying_name);

        const showCorrespondentsList = this.state.maximized.correspondents || this.state.showCorrespondentsAsList;

        return (
            <div className="grid-container">
                <div className={`grid-item email-list-container ${this.state.maximized.emailList ? 'maximized' : ''}`}>
                    <ErrorBoundary displayAsCard title="Emails">
                        <EmailListCard
                            emailList={this.props.emailList}
                            onPageNumberChange={this.onPageNumberChange}
                            resultsPerPage={this.state.resultsPerPage}
                            activePageNumber={this.state.activePageNumber}
                            setSortation={this.props.setSortation}
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
                        <Card className={showCorrespondentsList ? '' : 'd-none'}>
                            <CardHeader tag="h4">
                                Top Correspondents
                                {this.props.emailListCorrespondents.results.length > 0 &&
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
                <div className="grid-item top-phrases-container">
                    <ErrorBoundary displayAsCard title="Top Phrases">
                        <Card>
                            <CardHeader tag="h4">
                                Top Phrases
                            </CardHeader>
                            <CardBody className="text-danger">
                                An error occurred while requesting the Top Phrases.
                            </CardBody>
                        </Card>
                    </ErrorBoundary>
                </div>
                <div className="grid-item timeline-container">
                    <ErrorBoundary displayAsCard title="Timeline">
                        <Card>
                            <CardHeader tag="h4">Timeline</CardHeader>
                            {this.props.emailListDates.hasRequestError ?
                                <CardBody className="text-danger">
                                    An error occurred while requesting the Email dates.
                                </CardBody>
                                :
                                <CardBody>
                                    <EmailListHistogram
                                        dates={this.props.emailListDates.results}
                                        isFetching={this.props.emailListDates.isFetching}
                                        hasData={this.props.emailListDates.hasData}
                                    />
                                </CardBody>
                            }
                        </Card>
                    </ErrorBoundary>
                </div>
                <div className="grid-item topic-spaces-container">
                    <ErrorBoundary displayAsCard title="Topic Spaces">
                        <Card>
                            <CardHeader tag="h4">
                                Topic Spaces
                            </CardHeader>
                            <CardBody className="text-danger">
                                An error occurred while requesting the Topic Spaces.
                            </CardBody>
                        </Card>
                    </ErrorBoundary>
                </div>
                <div className="grid-item matrix-container">
                    <Matrix
                        matrixHighlighting={this.props.matrixHighlighting}
                        toggleMaximize={() => this.toggleMaximize('matrix')}
                    />
                </div>
                <div className={this.state.maximized.matrix ? 'maximized' : 'hidden'}>
                    <Matrix
                        maximized
                        matrixHighlighting={this.props.matrixHighlighting}
                        toggleMaximize={() => this.toggleMaximize('matrix')}
                    />
                </div>
            </div>
        );
    }
}

EmailListView.propTypes = {
    updateSearchTerm: PropTypes.func.isRequired,
    requestEmailList: PropTypes.func.isRequired,
    requestCorrespondentResult: PropTypes.func.isRequired,
    requestEmailListDates: PropTypes.func.isRequired,
    requestMatrixHighlighting: PropTypes.func.isRequired,
    setSortation: PropTypes.func.isRequired,
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
    match: PropTypes.shape({
        params: PropTypes.shape({
            searchTerm: PropTypes.string,
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
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(EmailListView));
