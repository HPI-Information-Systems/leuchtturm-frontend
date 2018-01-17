import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Col, Container, Row } from 'reactstrap';
import FontAwesome from 'react-fontawesome';
import PropTypes from 'prop-types';
// eslint-disable-next-line import/no-extraneous-dependencies
import * as actions from '../../actions/actions';
import './FullTextSearch.css';
import ResultList from './ResultList/ResultList';
// import NetworkGraph from '../NetworkGraph/NetworkGraph';

const mapStateToProps = state => ({
    search: state.search,
});

const mapDispatchToProps = dispatch => bindActionCreators({
    onRequestPage: actions.requestPage,
}, dispatch);

class FullTextSearch extends Component {
    constructor(props) {
        super(props);

        const { searchTerm } = props.match.params;
        if (props.match && searchTerm) {
            props.fullTextSearch(searchTerm, this.props.search.resultsPerPage);
        }
    }

    componentDidUpdate(prevProps) {
        if (this.didSearchTermChange(prevProps)) {
            this.props.fullTextSearch(this.props.match.params.searchTerm, this.props.search.resultsPerPage);
        }
    }

    didSearchTermChange(prevProps) {
        return prevProps.match.params.searchTerm !== this.props.match.params.searchTerm;
    }

    render() {
        return (
            <div className="App">
                <Container fluid className="App">
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

                    <br />

                    {this.props.search.isFetching &&
                    <Row>
                        <Col className="text-center">
                            <FontAwesome spin name="spinner" size="3x" />
                        </Col>
                    </Row>
                    }

                    {this.props.search.hasData &&
                    <ResultList
                        results={this.props.search.results}
                        numberOfResults={this.props.search.numberOfResults}
                        activePageNumber={this.props.search.activePageNumber}
                        resultsPerPage={this.props.search.resultsPerPage}
                        maxPageNumber={Math.ceil(this.props.search.numberOfResults / this.props.search.resultsPerPage)}
                        onPageNumberChange={pageNumber => this.props.onRequestPage(
                            this.props.search.searchTerm,
                            this.props.search.resultsPerPage,
                            pageNumber,
                        )}
                    />
                    }

                    {/* <Row>
                        <Col>
                            <NetworkGraph />
                        </Col>
                    </Row> */}
                </Container>
            </div>
        );
    }
}

FullTextSearch.propTypes = {
    onRequestPage: PropTypes.func.isRequired,
    search: PropTypes.shape({
        searchTerm: PropTypes.string,
        resultsPerPage: PropTypes.number,
        hasData: PropTypes.bool,
        numberOfResults: PropTypes.number,
        isFetching: PropTypes.bool,
        results: PropTypes.array,
        activePageNumber: PropTypes.number,
    }).isRequired,
    fullTextSearch: PropTypes.func.isRequired,
    match: PropTypes.shape({
        params: PropTypes.shape({
            searchTerm: PropTypes.string,
        }),
    }).isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(FullTextSearch);
