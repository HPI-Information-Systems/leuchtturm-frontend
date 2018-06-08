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
import { withRouter } from 'react-router';
import FontAwesome from 'react-fontawesome';
import {
    setShouldFetchData,
    setSortation,
    requestEmailList,
    requestCorrespondentResult,
    requestEmailListDates,
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
    shouldFetchData: state.emailListView.shouldFetchData,
    emailList: state.emailListView.emailList,
    emailListCorrespondents: state.emailListView.emailListCorrespondents,
    emailListDates: state.emailListView.emailListDates,
    matrixHighlighting: state.emailListView.matrixHighlighting,
    globalFilter: state.globalFilter.filters,
});

const mapDispatchToProps = dispatch => bindActionCreators({
    setShouldFetchData,
    setSortation,
    updateSearchTerm,
    requestEmailList,
    requestCorrespondentResult,
    requestEmailListDates,
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
        } else if (this.didSortationChange(nextProps)) {
            this.requestEmailDataForPage(nextProps, 1);
        }
    }

    onPageNumberChange(pageNumber) {
        this.requestEmailDataForPage(this.props, pageNumber);
    }

    requestAllData(props) {
        this.props.setShouldFetchData(false);
        this.requestEmailDataForPage(props, 1);
        this.props.requestCorrespondentResult(props.globalFilter);
        this.props.requestEmailListDates(props.globalFilter);
        this.props.requestMatrixHighlighting(props.globalFilter);
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
            <Container fluid>
                <Row>
                    <Col sm="6" className={this.state.maximized.emailList ? 'maximized' : ''}>
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
                    </Col>
                    <Col sm="6" className={this.state.maximized.correspondents ? 'maximized' : ''}>
                        <ErrorBoundary displayAsCard title="Top Correspondents">
                            <Card className={`top-correspondents ${showCorrespondentsList ? '' : 'd-none'}`}>
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
                    </Col>
                    <Col sm="9" >
                        <ErrorBoundary displayAsCard title="Timeline">
                            <EmailListHistogram
                                className="term-histogram"
                                dates={this.props.emailListDates.results}
                                isFetching={this.props.emailListDates.isFetching}
                                hasData={this.props.emailListDates.hasData}
                                hasRequestError={this.props.emailListDates.hasRequestError}
                            />
                        </ErrorBoundary>
                    </Col>
                    <Col sm="3">
                        <Matrix
                            matrixHighlighting={this.props.matrixHighlighting}
                            toggleMaximize={() => this.toggleMaximize('matrix')}
                        />
                    </Col>
                    <Col className={this.state.maximized.matrix ? 'maximized' : 'maximized hidden'}>
                        <Matrix
                            maximized
                            matrixHighlighting={this.props.matrixHighlighting}
                            toggleMaximize={() => this.toggleMaximize('matrix')}
                        />
                    </Col>
                </Row>
            </Container>
        );
    }
}

EmailListView.propTypes = {
    setShouldFetchData: PropTypes.func.isRequired,
    setSortation: PropTypes.func.isRequired,
    updateSearchTerm: PropTypes.func.isRequired,
    requestEmailList: PropTypes.func.isRequired,
    requestCorrespondentResult: PropTypes.func.isRequired,
    requestEmailListDates: PropTypes.func.isRequired,
    requestMatrixHighlighting: PropTypes.func.isRequired,
    shouldFetchData: PropTypes.bool.isRequired,
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
