import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
    Col,
    Container,
    Row,
    Card,
    CardBody,
    CardHeader,
} from 'reactstrap';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import _ from 'lodash';
import { withRouter } from 'react-router';
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
                graph: false,
                emailList: false,
                matrix: false,
            },
            resultsPerPage: 50,
            activePageNumber: 1,
        };

        this.toggleMaximize = this.toggleMaximize.bind(this);
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

    render() {
        const correspondents = [];
        if (this.props.emailListCorrespondents.results) {
            this.props.emailListCorrespondents.results.forEach((correspondent) => {
                correspondents.push(correspondent.identifying_name);
            });
        }

        return (
            <div>
                <Container fluid>
                    <Row>
                        <Col sm="4" className={this.state.maximized.emailList ? 'maximized' : ''}>
                            <ErrorBoundary displayAsCard info="Something went wrong with the Emails.">
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
                        </Col>
                        <Col sm="3">
                            <ErrorBoundary displayAsCard info="Something went wrong with the Top Correspondents.">
                                <Card className="top-correspondents">
                                    <CardHeader tag="h4">Top Correspondents</CardHeader>
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
                                        </CardBody>
                                    }
                                </Card>
                            </ErrorBoundary>
                        </Col>
                        <Col sm="5" className={this.state.maximized.graph ? 'maximized' : ''}>
                            <ErrorBoundary
                                displayAsCard
                                info="Something went wrong with the Top Correspondents Network."
                            >
                                <Graph
                                    title="Top Correspondents Network"
                                    isFetchingCorrespondents={this.props.emailListCorrespondents.isFetching}
                                    identifyingNames={correspondents}
                                    view="EmailList"
                                    toggleMaximize={() => this.toggleMaximize('graph')}
                                    isMaximized={this.state.maximized.graph}
                                />
                            </ErrorBoundary>
                        </Col>
                        <Col sm="9" >
                            <ErrorBoundary displayAsCard info="Something went wrong with the Timeline.">
                                <Card className="term-histogram">
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
                                            />
                                        </CardBody>
                                    }
                                </Card>
                            </ErrorBoundary>
                        </Col>
                        <Col sm="3">
                            <Card className="mini-matrix-card">
                                <CardHeader tag="h4">
                                    Communication Patterns
                                    <FontAwesome
                                        className="pull-right blue-button"
                                        name="arrows-alt"
                                        onClick={() => this.toggleMaximize('matrix')}
                                    />
                                </CardHeader>
                                <CardBody>
                                    <Matrix
                                        matrixHighlighting={this.props.matrixHighlighting.results}
                                        isFetchingMatrixHighlighting={this.props.matrixHighlighting.isFetching}
                                        hasMatrixHighlightingData={this.props.matrixHighlighting.hasData}
                                    />
                                </CardBody>
                            </Card>
                        </Col>
                        <Col className={this.state.maximized.matrix ? 'maximized' : 'maximized hidden'}>
                            <Card>
                                <CardHeader tag="h4">
                                    Communication Patterns
                                    <FontAwesome
                                        className="pull-right blue-button"
                                        name="times"
                                        onClick={() => this.toggleMaximize('matrix')}
                                    />
                                </CardHeader>
                                <CardBody>
                                    {this.props.matrixHighlighting.hasRequestError &&
                                        <span className="text-danger">
                                            An error occurred while requesting the Matrix highlighting.
                                        </span>
                                    }
                                    <Matrix
                                        maximized
                                        matrixHighlighting={this.props.matrixHighlighting.results}
                                        isFetchingMatrixHighlighting={this.props.matrixHighlighting.isFetching}
                                        hasMatrixHighlightingData={this.props.matrixHighlighting.hasData}
                                    />
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
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
        results: PropTypes.array.isRequired,
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
