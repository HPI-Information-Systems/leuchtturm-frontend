import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Col, Container, Row } from 'reactstrap';
import PropTypes from 'prop-types';
// eslint-disable-next-line import/no-extraneous-dependencies
import { withRouter } from 'react-router';
import * as actions from '../../actions/actions';
import ResultList from '../ResultList/ResultList';
import Spinner from '../Spinner/Spinner';

const mapStateToProps = state => ({
    termView: state.termView,
});

const mapDispatchToProps = dispatch => bindActionCreators({
    onUpdateSearchTerm: actions.updateSearchTerm,
    onRequestSearchResultPage: actions.requestSearchResultPage,
    onRequestCorrespondentResult: actions.requestCorrespondentResult,
}, dispatch);

class FullTextSearch extends Component {
    constructor(props) {
        super(props);

        const { searchTerm } = props.match.params;
        if (props.match && searchTerm) {
            this.triggerFullTextSearch(searchTerm, this.props.termView.resultsPerPage);
            this.triggerCorrespondentSearch(searchTerm);
        }
    }

    componentDidUpdate(prevProps) {
        document.title = `Search - ${this.props.match.params.searchTerm}`;
        if (this.didSearchTermChange(prevProps)) {
            this.triggerFullTextSearch(this.props.match.params.searchTerm, this.props.termView.resultsPerPage);
            this.triggerCorrespondentSearch(this.props.match.params.searchTerm);
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

    didSearchTermChange(prevProps) {
        return prevProps.match.params.searchTerm !== this.props.match.params.searchTerm;
    }

    render() {
        return (
            <div className="App">
                <Container fluid>
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

                    <Row>
                        <Col sm="8">
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
                        </Col>
                        <Col sm="4">
                            Test
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
    termView: PropTypes.shape({
        searchTerm: PropTypes.string,
        activeSearchTerm: PropTypes.string,
        resultsPerPage: PropTypes.number,
        hasMailData: PropTypes.bool,
        numberOfMails: PropTypes.number,
        isFetchingMails: PropTypes.bool,
        mailResults: PropTypes.array,
        activePageNumber: PropTypes.number,
    }).isRequired,
    match: PropTypes.shape({
        params: PropTypes.shape({
            searchTerm: PropTypes.string,
        }),
    }).isRequired,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(FullTextSearch));
