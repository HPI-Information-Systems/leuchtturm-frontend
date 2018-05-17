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
import FontAwesome from 'react-fontawesome';
import _ from 'lodash';
import { withRouter } from 'react-router';
import {
    requestEmailList,
    requestCorrespondentResult,
    requestEmailListDates,
} from '../../actions/emailListViewActions';
import { updateSearchTerm } from '../../actions/globalFilterActions';
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
    globalFilter: state.globalFilter.filters,
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
            maximized: {
                graph: false,
                mailList: false,
            },
        };

        this.toggleDropdown = this.toggleDropdown.bind(this);
        this.toggleMaximize = this.toggleMaximize.bind(this);
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
            this.props.requestMatrixHighlighting(this.props.globalFilter);
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
        if (this.props.emailListView.hasCorrespondentData) {
            this.props.emailListView.correspondentResults.forEach((correspondent) => {
                correspondents.push(correspondent.email_address);
            });
        }

        return (
            <div>
                <Container fluid>
                    <Row>
                        <Col sm="4" className={this.state.maximized.mailList ? 'maximized' : ''}>
                            <Card className="email-list">
                                <CardHeader tag="h4">
                                    Mails
                                    {this.props.emailListView.hasMailData &&
                                    <div className="pull-right">
                                        <div className="email-count mr-2 small d-inline-block">
                                            {this.props.emailListView.numberOfMails} Mails
                                        </div>
                                        <Dropdown
                                            isOpen={this.state.dropdownOpen}
                                            toggle={this.toggleDropdown}
                                            size="sm"
                                            className="d-inline-block sort mr-2"
                                        >
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
                                        <FontAwesome
                                            className="blue-button"
                                            name={this.state.maximized.mailList ? 'times' : 'arrows-alt'}
                                            onClick={() => this.toggleMaximize('mailList')}
                                        />
                                    </div>
                                    }
                                </CardHeader>
                                <CardBody>

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
                        <Col sm="3">
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
                        <Col sm="5" className={this.state.maximized.graph ? 'maximized' : ''}>
                            <Graph
                                title="Top Correspondent Communication"
                                isFetchingCorrespondents={this.props.emailListView.isFetchingCorrespondents}
                                emailAddresses={correspondents}
                                view="EmailList"
                                maximize={this.toggleMaximize}
                                isMaximized={this.state.maximized.graph}
                            />
                        </Col>
                        <Col>
                            <Card className="term-histogram">
                                <CardHeader tag="h4">Timeline</CardHeader>
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
