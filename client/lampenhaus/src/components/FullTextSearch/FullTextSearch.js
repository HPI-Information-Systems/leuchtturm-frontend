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
    search: state.search,
});

const mapDispatchToProps = dispatch => bindActionCreators({
    onUpdateSearchTerm: actions.updateSearchTerm,
    onRequestSearchResultPage: actions.requestSearchResultPage,
}, dispatch);

class FullTextSearch extends Component {
    constructor(props) {
        super(props);

        const { searchTerm } = props.match.params;
        if (props.match && searchTerm) {
            this.triggerFullTextSearch(searchTerm, this.props.search.resultsPerPage);
        }
    }

    componentDidUpdate(prevProps) {
        document.title = `Search - ${this.props.match.params.searchTerm}`;
        if (this.didSearchTermChange(prevProps)) {
            this.triggerFullTextSearch(this.props.match.params.searchTerm, this.props.search.resultsPerPage);
        }
    }

    triggerFullTextSearch(searchTerm, resultsPerPage) {
        if (searchTerm) {
            this.props.onUpdateSearchTerm(searchTerm);
            this.props.onRequestSearchResultPage(searchTerm, resultsPerPage, 1);
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
                                {this.props.search.hasData &&
                                <span className="text-muted small">
                                    {this.props.search.numberOfResults} Results
                                </span>
                                }
                            </h5>
                        </Col>
                    </Row>

                    {this.props.search.isFetching &&
                    <Spinner />
                    }

                    {this.props.search.hasData &&
                    <ResultList
                        activeSearchTerm={this.props.search.activeSearchTerm}
                        results={this.props.search.results}
                        numberOfResults={this.props.search.numberOfResults}
                        activePageNumber={this.props.search.activePageNumber}
                        resultsPerPage={this.props.search.resultsPerPage}
                        maxPageNumber={Math.ceil(this.props.search.numberOfResults / this.props.search.resultsPerPage)}
                        onPageNumberChange={pageNumber => this.props.onRequestSearchResultPage(
                            this.props.search.searchTerm,
                            this.props.search.resultsPerPage,
                            pageNumber,
                        )}
                    />
                    }
                </Container>
            </div>
        );
    }
}

FullTextSearch.propTypes = {
    onRequestSearchResultPage: PropTypes.func.isRequired,
    onUpdateSearchTerm: PropTypes.func.isRequired,
    search: PropTypes.shape({
        searchTerm: PropTypes.string,
        activeSearchTerm: PropTypes.string,
        resultsPerPage: PropTypes.number,
        hasData: PropTypes.bool,
        numberOfResults: PropTypes.number,
        isFetching: PropTypes.bool,
        results: PropTypes.array,
        activePageNumber: PropTypes.number,
    }).isRequired,
    match: PropTypes.shape({
        params: PropTypes.shape({
            searchTerm: PropTypes.string,
        }),
    }).isRequired,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(FullTextSearch));
