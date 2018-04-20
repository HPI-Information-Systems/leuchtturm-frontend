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
// eslint-disable-next-line import/no-extraneous-dependencies
import { withRouter } from 'react-router';
import * as actions from '../../actions/actions';
import ResultList from '../ResultList/ResultList';
import Graph from '../Graph/Graph';
import CorrespondentList from '../CorrespondentList/CorrespondentList';
import Spinner from '../Spinner/Spinner';
import TermHistogram from '../TermHistogram/TermHistogram';
import './TermView.css';

const mapStateToProps = state => ({
    termView: state.termView,
    globalFilter: state.globalFilter,
});

const mapDispatchToProps = dispatch => bindActionCreators({
    onUpdateSearchTerm: actions.updateSearchTerm,
    onRequestSearchResultPage: actions.requestSearchResultPage,
    onRequestCorrespondentResult: actions.requestCorrespondentResult,
    onRequestTermDates: actions.requestTermDates,
}, dispatch);

class FullTextSearch extends Component {
    constructor(props) {
        super(props);
        const { searchTerm } = props.match.params;
        if (props.match && searchTerm) {
            this.triggerFullTextSearch(searchTerm, this.props.termView.resultsPerPage);
            this.triggerCorrespondentSearch(searchTerm);
            this.triggerTermDatesRequest(searchTerm);
        }
    }

    componentDidUpdate(prevProps) {
        document.title = `Search - ${this.props.match.params.searchTerm}`;
        if (this.didTermViewParametersChange(prevProps)) {
            this.triggerFullTextSearch(this.props.match.params.searchTerm, this.props.termView.resultsPerPage);
            this.triggerCorrespondentSearch(this.props.match.params.searchTerm);
            this.triggerTermDatesRequest(this.props.match.params.searchTerm);
        }
    }

    triggerFullTextSearch(searchTerm, resultsPerPage) {
        if (searchTerm) {
            this.props.onUpdateSearchTerm(searchTerm);
            this.props.onRequestSearchResultPage(searchTerm, resultsPerPage, 1);
        }
    }

    triggerCorrespondentSearch(searchTerm) {
        if (searchTerm) {
            this.props.onRequestCorrespondentResult(searchTerm);
        }
    }

    triggerTermDatesRequest(searchTerm) {
        if (searchTerm) {
            this.props.onRequestTermDates(searchTerm);
        }
    }

    didTermViewParametersChange(prevProps) {
        return (
            prevProps.match.params.searchTerm !== this.props.match.params.searchTerm ||
            prevProps.globalFilter !== this.props.globalFilter
        );
    }

    render() {
        const correspondents = [];
        if (this.props.termView.hasCorrespondentData) {
            this.props.termView.correspondentResults.forEach((correspondent) => {
                correspondents.push(correspondent.email_address);
            });
        }

        return (
            <div>
                <Container fluid>
                    <Row>
                        <Col sm="12">
                            <h4>Results for: {this.props.termView.searchTerm}</h4>
                        </Col>
                    </Row>
                    <Row>
                        <Col sm="8">
                            <Card>
                                <CardHeader tag="h4">Mails</CardHeader>
                                <CardBody>
                                    <Row>
                                        <Col>
                                            <h5>
                                                {this.props.termView.hasMailData &&
                                                <span className="text-muted small">
                                                    {this.props.termView.numberOfMails} Mails
                                                </span>
                                                }
                                            </h5>
                                        </Col>
                                    </Row>
                                    {this.props.termView.isFetchingMails &&
                                    <Spinner />
                                    }
                                    {this.props.termView.hasMailData &&
                                    <ResultList
                                        activeSearchTerm={this.props.termView.activeSearchTerm}
                                        results={this.props.termView.mailResults}
                                        numberOfResults={this.props.termView.numberOfMails}
                                        activePageNumber={this.props.termView.activePageNumber}
                                        resultsPerPage={this.props.termView.resultsPerPage}
                                        maxPageNumber={Math.ceil(this.props.termView.numberOfMails /
                                            this.props.termView.resultsPerPage)}
                                        onPageNumberChange={pageNumber => this.props.onRequestSearchResultPage(
                                            this.props.termView.searchTerm,
                                            this.props.termView.resultsPerPage,
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
                                        correspondents={this.props.termView.correspondentResults}
                                        isFetching={this.props.termView.isFetchingCorrespondents}
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
                                    <TermHistogram
                                        dates={this.props.termView.termDatesResults}
                                        isFetching={this.props.termView.isFetchingTermDatesData}
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

FullTextSearch.propTypes = {
    onRequestSearchResultPage: PropTypes.func.isRequired,
    onRequestCorrespondentResult: PropTypes.func.isRequired,
    onUpdateSearchTerm: PropTypes.func.isRequired,
    onRequestTermDates: PropTypes.func.isRequired,
    termView: PropTypes.shape({
        searchTerm: PropTypes.string,
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
    globalFilter: PropTypes.shape({
        startDate: PropTypes.string,
        endDate: PropTypes.string,
    }).isRequired,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(FullTextSearch));
