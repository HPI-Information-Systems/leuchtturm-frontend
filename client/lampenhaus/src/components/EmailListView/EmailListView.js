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
import * as actions from '../../actions/actions';
import ResultList from '../ResultList/ResultList';
import Graph from '../Graph/Graph';
import CorrespondentList from '../CorrespondentList/CorrespondentList';
import Spinner from '../Spinner/Spinner';
import EmailListHistogram from '../EmailListHistogram/EmailListHistogram';
import './EmailListView.css';

const mapStateToProps = state => ({
    emailListView: state.emailListView,
    globalFilters: state.globalFilters,
    sort: state.sort,
});

const mapDispatchToProps = dispatch => bindActionCreators({
    onUpdateSearchTerm: actions.updateSearchTerm,
    onRequestSearchResultPage: actions.requestSearchResultPage,
    onRequestCorrespondentResult: actions.requestCorrespondentResult,
    onRequestTermDates: actions.requestTermDates,
    onSetSort: actions.setSort,
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
            dropdownOpen: false,
        };

        this.toggleDropdown = this.toggleDropdown.bind(this);
    }

    componentDidMount() {
        let { searchTerm } = this.props.match.params;
        if (!searchTerm) searchTerm = '';
        setSearchPageTitle(searchTerm);
        this.props.onUpdateSearchTerm(searchTerm);
        this.triggerFullTextSearch(this.props.globalFilters, this.props.emailListView.resultsPerPage);
        this.triggerCorrespondentSearch(this.props.globalFilters);
        this.triggerTermDatesRequest(this.props.globalFilters);
    }

    componentDidUpdate(prevProps) {
        const { searchTerm } = this.props.globalFilters;
        setSearchPageTitle(searchTerm);
        if (this.didGlobalFiltersChange(prevProps)) {
            this.triggerFullTextSearch(this.props.globalFilters, this.props.emailListView.resultsPerPage);
            this.triggerCorrespondentSearch(this.props.globalFilters);
            this.triggerTermDatesRequest(this.props.globalFilters);
        } else if (this.didSortChange(prevProps)) {
            this.triggerFullTextSearch(this.props.globalFilters, this.props.emailListView.resultsPerPage);
        }
    }

    didGlobalFiltersChange(prevProps) {
        return !_.isEqual(prevProps.globalFilters, this.props.globalFilters);
    }

    didSortChange(prevProps) {
        return prevProps.sort !== this.props.sort;
    }

    triggerFullTextSearch(globalFilters, resultsPerPage) {
        this.props.onRequestSearchResultPage(globalFilters, resultsPerPage, 1);
    }

    triggerCorrespondentSearch(searchTerm) {
        this.props.onRequestCorrespondentResult(searchTerm);
    }

    triggerTermDatesRequest(searchTerm) {
        this.props.onRequestTermDates(searchTerm);
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
                                                    <DropdownItem onClick={() => this.props.onSetSort('Relevance')}>
                                                        Relevance
                                                    </DropdownItem>
                                                    <DropdownItem onClick={() => this.props.onSetSort('Newest first')}>
                                                        Newest first
                                                    </DropdownItem>
                                                    <DropdownItem onClick={() => this.props.onSetSort('Oldest first')}>
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
                                        onPageNumberChange={pageNumber => this.props.onRequestSearchResultPage(
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
                                        dates={this.props.emailListView.termDatesResults}
                                        isFetching={this.props.emailListView.isFetchingTermDatesData}
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
                </Container>
            </div>
        );
    }
}

EmailListView.propTypes = {
    onRequestSearchResultPage: PropTypes.func.isRequired,
    onRequestCorrespondentResult: PropTypes.func.isRequired,
    onUpdateSearchTerm: PropTypes.func.isRequired,
    onRequestTermDates: PropTypes.func.isRequired,
    onSetSort: PropTypes.func.isRequired,
    sort: PropTypes.string.isRequired,
    emailListView: PropTypes.shape({
        activeSearchTerm: PropTypes.string,
        resultsPerPage: PropTypes.number,
        hasMailData: PropTypes.bool,
        numberOfMails: PropTypes.number,
        isFetchingMails: PropTypes.bool,
        isFetchingCorrespondents: PropTypes.bool,
        mailResults: PropTypes.array,
        correspondentResults: PropTypes.array,
        termDatesResults: PropTypes.array,
        hasTermDatesData: PropTypes.bool,
        activePageNumber: PropTypes.number,
        isFetchingTermDatesData: PropTypes.bool,
        hasCorrespondentData: PropTypes.bool,
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
