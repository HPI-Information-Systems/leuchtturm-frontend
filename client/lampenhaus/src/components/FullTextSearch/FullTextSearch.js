import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Col, Container, Row, Badge } from 'reactstrap';
import FontAwesome from 'react-fontawesome';
import PropTypes from 'prop-types';
import * as actions from '../../actions/actions';
import './FullTextSearch.css';
import ResultList from './ResultList/ResultList';
// import NetworkGraph from '../NetworkGraph/NetworkGraph';

const mapStateToProps = state => ({
    search: state.search,
});

const mapDispatchToProps = dispatch => bindActionCreators({
    onUpdateSearchTerm: actions.updateSearchTerm,
    onRequestPage: actions.requestPage,
    onSetEntitySearch: actions.setEntitySearch,
}, dispatch);

class FullTextSearch extends Component {
    searchEntity(searchTerm, resultsPerPage) {
        if (searchTerm) {
            this.props.onSetEntitySearch(true);
            this.props.onUpdateSearchTerm(searchTerm);
            this.props.onRequestPage(searchTerm, resultsPerPage, 1);
        }
    }

    render() {
        return (
            <div className="App">
                <Container fluid className="App">
                    <Row>
                        <Col>
                            <h5>
                                {this.props.search.isEntitySearch &&
                                <Badge className="entity-badge" color="success">Entity</Badge>
                                }
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
                        onEntitySearch={entityName => this.searchEntity(entityName, this.props.search.resultsPerPage)}
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
    onSetEntitySearch: PropTypes.func.isRequired,
    onUpdateSearchTerm: PropTypes.func.isRequired,
    search: PropTypes.shape({
        searchTerm: PropTypes.string,
        resultsPerPage: PropTypes.number,
        isEntitySearch: PropTypes.bool,
        hasData: PropTypes.bool,
        numberOfResults: PropTypes.number,
        isFetching: PropTypes.bool,
        results: PropTypes.array,
        activePageNumber: PropTypes.number,
    }).isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(FullTextSearch);
