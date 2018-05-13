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
    Dropdown,
    DropdownItem,
    DropdownToggle,
    DropdownMenu,
} from 'reactstrap';
import PropTypes from 'prop-types';
import _ from 'lodash';
// eslint-disable-next-line import/no-extraneous-dependencies
import { withRouter } from 'react-router';
import {
    requestEmailList,
    requestCorrespondentResult,
    requestEmailListDates,
} from '../../actions/emailListViewActions';
import { updateSearchTerm } from '../../actions/globalFiltersActions';
import { requestMatrixHighlighting } from '../../actions/matrixActions';
import setSort from '../../actions/sortActions';
import ResultList from '../ResultList/ResultList';
import Graph from '../Graph/Graph';
import CorrespondentList from '../CorrespondentList/CorrespondentList';
import Spinner from '../Spinner/Spinner';
import Matrix from '../Matrix/Matrix';
import EmailListHistogram from '../EmailListHistogram/EmailListHistogram';
import './EmailListView.css';

const mapStateToProps = state => ({
    emailListView: state.emailListView,
    globalFilters: state.globalFilters,
    sort: state.sort,
});

const mapDispatchToProps = dispatch => bindActionCreators({
    updateSearchTerm,
    requestEmailList,
    requestCorrespondentResult,
    requestEmailListDates,
    requestMatrixHighlighting,
    setSort,
}, dispatch);

class EmailListView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dropdownOpen: false,
        };

        this.toggleDropdown = this.toggleDropdown.bind(this);
    }

    componentDidMount() {
        let { searchTerm } = this.props.match.params;
        if (!searchTerm) searchTerm = '';
        this.props.updateSearchTerm(searchTerm);
    }

    componentDidUpdate(prevProps) {
        let { searchTerm } = this.props.match.params;
        if (!searchTerm) searchTerm = '';
        document.title = `Search - ${searchTerm}`;
        if (this.didGlobalFiltersChange(prevProps) ||
            (!this.props.emailListView.hasMailData && !this.props.emailListView.isFetchingMails)) {
            this.triggerFullTextSearch(searchTerm, this.props.emailListView.resultsPerPage);
            this.triggerCorrespondentSearch(searchTerm);
            this.triggerTermDatesRequest(searchTerm);
            this.triggerMatrixHighlightingSearch(searchTerm);
        } else if (this.didSortChange(prevProps)) {
            this.triggerFullTextSearch(searchTerm, this.props.emailListView.resultsPerPage);
        }
    }

    didGlobalFiltersChange(prevProps) {
        return !_.isEqual(prevProps.globalFilters, this.props.globalFilters);
    }

    didSortChange(prevProps) {
        return prevProps.sort !== this.props.sort;
    }

    triggerFullTextSearch(searchTerm, resultsPerPage) {
        this.props.requestEmailList(searchTerm, resultsPerPage, 1);
    }

    triggerMatrixHighlightingSearch(searchTerm) {
        if (searchTerm) {
            this.props.requestMatrixHighlighting(searchTerm);
        }
    }

    triggerCorrespondentSearch(searchTerm) {
        this.props.requestCorrespondentResult(searchTerm);
    }

    triggerTermDatesRequest(searchTerm) {
        this.props.requestEmailListDates(searchTerm);
    }

    toggleDropdown() {
        this.setState({ dropdownOpen: !this.state.dropdownOpen });
    }

    render() {
        const correspondents = [];
        if (this.props.emailListView.hasCorrespondentData) {
            this.props.emailListView.correspondentResults.forEach((correspondent) => {
                correspondents.push(correspondent.email_address);
            });
        }

        return (
            <div>
                <Container fluid>
                    <Row>
                        <Col sm="12">
                            <h4>Results for: {this.props.emailListView.activeSearchTerm}</h4>
                        </Col>
                    </Row>
                    <Row>
                        <Col sm="8">
                            <Card>
                                <CardHeader tag="h4">Mails</CardHeader>
                                <CardBody>
                                    {this.props.emailListView.hasMailData &&
                                    <Row className="mb-2">
                                        <Col>
                                            <h5>
                                                <span className="text-muted small">
                                                    {this.props.emailListView.numberOfMails} Mails
                                                </span>
                                            </h5>
                                        </Col>
                                        <Col className="text-right">
                                            Sort by:{' '}
                                            <Dropdown
                                                isOpen={this.state.dropdownOpen}
                                                toggle={this.toggleDropdown}
                                                className="d-inline-block"
                                            >
                                                <DropdownToggle caret>
                                                    {this.props.sort || 'Relevance'}
                                                </DropdownToggle>
                                                <DropdownMenu>
                                                    <DropdownItem onClick={() => this.props.setSort('Relevance')}>
                                                        Relevance
                                                    </DropdownItem>
                                                    <DropdownItem onClick={() => this.props.setSort('Newest first')}>
                                                        Newest first
                                                    </DropdownItem>
                                                    <DropdownItem onClick={() => this.props.setSort('Oldest first')}>
                                                        Oldest first
                                                    </DropdownItem>
                                                </DropdownMenu>
                                            </Dropdown>
                                        </Col>
                                    </Row>
                                    }
                                    {this.props.emailListView.isFetchingMails &&
                                    <Spinner />
                                    }
                                    {this.props.emailListView.hasMailData &&
                                    <ResultList
                                        activeSearchTerm={this.props.emailListView.activeSearchTerm}
                                        results={this.props.emailListView.mailResults}
                                        numberOfResults={this.props.emailListView.numberOfMails}
                                        activePageNumber={this.props.emailListView.activePageNumber}
                                        resultsPerPage={this.props.emailListView.resultsPerPage}
                                        maxPageNumber={Math.ceil(this.props.emailListView.numberOfMails /
                                            this.props.emailListView.resultsPerPage)}
                                        onPageNumberChange={pageNumber => this.props.requestEmailList(
                                            this.props.globalFilters.searchTerm,
                                            this.props.emailListView.resultsPerPage,
                                            pageNumber,
                                        )}
                                    />
                                    }
                                </CardBody>
                            </Card>
                        </Col>
                        <Col sm="4">
                            <Card>
                                <CardHeader tag="h4">Correspondents</CardHeader>
                                <CardBody>
                                    <CorrespondentList
                                        correspondents={this.props.emailListView.correspondentResults}
                                        isFetching={this.props.emailListView.isFetchingCorrespondents}
                                    />
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Card className="term-histogram">
                                <CardHeader tag="h4">Matching Emails over Time</CardHeader>
                                <CardBody>
                                    <EmailListHistogram
                                        dates={this.props.emailListView.emailListDatesResults}
                                        isFetching={this.props.emailListView.isFetchingEmailListDatesData}
                                    />
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Card>
                                <CardHeader tag="h4">Top Correspondent Communication</CardHeader>
                                <CardBody>
                                    <Graph
                                        emailAddresses={correspondents}
                                        view="term"
                                    />
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Card>
                                <CardHeader tag="h4">Communication Patterns</CardHeader>
                                <CardBody>
                                    <Matrix
                                        matrixHighlighting={this.props.emailListView.matrixHighlightingResults}
                                        isFetchingMatrixHighlighting={
                                            this.props.emailListView.isFetchingMatrixHighlighting}
                                        hasMatrixHighlightingData={this.props.emailListView.hasMatrixHighlightingData}
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
    requestEmailList: PropTypes.func.isRequired,
    requestCorrespondentResult: PropTypes.func.isRequired,
    updateSearchTerm: PropTypes.func.isRequired,
    requestEmailListDates: PropTypes.func.isRequired,
    setSort: PropTypes.func.isRequired,
    sort: PropTypes.string.isRequired,
    requestMatrixHighlighting: PropTypes.func.isRequired,
    emailListView: PropTypes.shape({
        activeSearchTerm: PropTypes.string,
        resultsPerPage: PropTypes.number,
        hasMailData: PropTypes.bool,
        numberOfMails: PropTypes.number,
        isFetchingMails: PropTypes.bool,
        isFetchingCorrespondents: PropTypes.bool,
        mailResults: PropTypes.array,
        correspondentResults: PropTypes.array,
        emailListDatesResults: PropTypes.array,
        hasEmailListDatesData: PropTypes.bool,
        activePageNumber: PropTypes.number,
        isFetchingEmailListDatesData: PropTypes.bool,
        hasCorrespondentData: PropTypes.bool,
        isFetchingMatrixHighlighting: PropTypes.bool,
        hasMatrixHighlightingData: PropTypes.bool,
        matrixHighlightingResults: PropTypes.array,
    }).isRequired,
    match: PropTypes.shape({
        params: PropTypes.shape({
            searchTerm: PropTypes.string,
        }),
    }).isRequired,
    globalFilters: PropTypes.shape({
        searchTerm: PropTypes.string.isRequired,
        startDate: PropTypes.string.isRequired,
        endDate: PropTypes.string.isRequired,
        sender: PropTypes.string.isRequired,
        recipient: PropTypes.string.isRequired,
        selectedTopics: PropTypes.array.isRequired,
        selectedEmailClasses: PropTypes.object.isRequired,
    }).isRequired,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(EmailListView));
