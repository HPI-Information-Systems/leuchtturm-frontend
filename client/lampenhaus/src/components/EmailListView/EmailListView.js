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
import { withRouter } from 'react-router';
import {
    requestEmailList,
    requestCorrespondentResult,
    requestEmailListDates,
} from '../../actions/emailListViewActions';
import { updateSearchTerm } from '../../actions/globalFilterActions';
import setSort from '../../actions/sortActions';
import ResultList from '../ResultList/ResultList';
import Graph from '../Graph/Graph';
import CorrespondentList from '../CorrespondentList/CorrespondentList';
import Spinner from '../Spinner/Spinner';
import EmailListHistogram from '../EmailListHistogram/EmailListHistogram';
import './EmailListView.css';

const mapStateToProps = state => ({
    emailListView: state.emailListView,
    globalFilter: state.globalFilter.filters,
    sort: state.sort,
});

const mapDispatchToProps = dispatch => bindActionCreators({
    updateSearchTerm,
    requestEmailList,
    requestCorrespondentResult,
    requestEmailListDates,
    setSort,
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
        this.props.updateSearchTerm(searchTerm);
        this.props.requestEmailList(this.props.globalFilter, this.props.emailListView.resultsPerPage, 1);
        this.props.requestCorrespondentResult(this.props.globalFilter);
        this.props.requestEmailListDates(this.props.globalFilter);
    }

    componentDidUpdate(prevProps) {
        const { searchTerm } = this.props.globalFilter;
        setSearchPageTitle(searchTerm);
        if (this.didGlobalFilterChange(prevProps)) {
            this.props.requestEmailList(this.props.globalFilter, this.props.emailListView.resultsPerPage, 1);
            this.props.requestCorrespondentResult(this.props.globalFilter);
            this.props.requestEmailListDates(this.props.globalFilter);
        } else if (this.didSortChange(prevProps)) {
            this.props.requestEmailList(this.props.globalFilter, this.props.emailListView.resultsPerPage, 1);
        }
    }

    didGlobalFilterChange(prevProps) {
        return !_.isEqual(prevProps.globalFilter, this.props.globalFilter);
    }

    didSortChange(prevProps) {
        return prevProps.sort !== this.props.sort;
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
                                            <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggleDropdown}>
                                                <DropdownToggle caret>
                                                    {this.props.sort || 'Relevance'}
                                                </DropdownToggle>
                                                <DropdownMenu>
                                                    <DropdownItem header>Sort by</DropdownItem>
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
                                            this.props.globalFilter,
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
