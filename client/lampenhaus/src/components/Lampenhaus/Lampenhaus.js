import React, { Component } from 'react';
import {
    BrowserRouter as Router,
    Route,
} from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Col, Container, Row } from 'reactstrap';
import FontAwesome from 'react-fontawesome';
import PropTypes from 'prop-types';
import * as actions from '../../actions/actions';
import './Lampenhaus.css';
import FullTextSearch from '../FullTextSearch/FullTextSearch';
import Correspondent from '../Correspondent/Correspondent';
import SearchBar from '../SearchBar/SearchBar';
// import NetworkGraph from '../NetworkGraph/NetworkGraph';

const mapStateToProps = state => ({
    search: state.search,
});

const mapDispatchToProps = dispatch => bindActionCreators({
    onUpdateSearchTerm: actions.updateSearchTerm,
    onRequestPage: actions.requestPage,
    onSetEntitySearch: actions.setEntitySearch,
}, dispatch);


class Lampenhaus extends Component {
    fetchResults(searchTerm, resultsPerPage) {
        if (searchTerm) {
            this.props.onSetEntitySearch(false);
            this.props.onRequestPage(searchTerm, resultsPerPage, 1);
        }
    }

    render() {
        return (
            <Router>
                <div>
                    <header className="App-header">
                        <h1 className="App-title">
                            Lampenhaus
                            <FontAwesome name="lightbulb-o" className="ml-2" />
                        </h1>

                    </header>
                    <br />

                    <Container fluid className="App">
                        <Row>
                            <Col>
                                <SearchBar
                                    searchTerm={this.props.search.searchTerm}
                                    /* TODO: change to view FullTextSearch if correspondent view is shown and search is
                                    triggered  */
                                    onSubmitSearch={() => this.fetchResults(
                                        this.props.search.searchTerm,
                                        this.props.search.resultsPerPage,
                                    )}
                                    onPageNumberChange={e => this.props.onUpdateSearchTerm(e.target.value)}
                                    isEntitySearch={this.props.search.isEntitySearch}
                                />
                            </Col>
                        </Row>
                    </Container>

                    <Route exact path="/" component={FullTextSearch} />
                    <Route path="/correspondent" component={Correspondent} />
                </div>
            </Router>
        );
    }
}

Lampenhaus.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(Lampenhaus);
