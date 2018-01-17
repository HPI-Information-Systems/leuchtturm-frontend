import React, { Component } from 'react';
import {
    Route,
} from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Col, Container, Row } from 'reactstrap';
import FontAwesome from 'react-fontawesome';
import PropTypes from 'prop-types';
// eslint-disable-next-line import/no-extraneous-dependencies
import { withRouter } from 'react-router';
import * as actions from '../../../actions/actions';
import './Lampenhaus.css';
import FullTextSearch from '../../FullTextSearch/FullTextSearch';
import CorrespondentView from '../../CorrespondentView/CorrespondentView';
import SearchBar from '../../SearchBar/SearchBar';

const mapStateToProps = state => ({
    search: state.search,
});

const mapDispatchToProps = dispatch => bindActionCreators({
    onUpdateSearchTerm: actions.updateSearchTerm,
    onRequestPage: actions.requestPage,
}, dispatch);


class Lampenhaus extends Component {
    constructor(props) {
        super(props);

        this.fullTextSearch = this.fullTextSearch.bind(this);
    }

    fullTextSearch(searchTerm, resultsPerPage) {
        if (searchTerm) {
            this.props.history.push(`/search/${searchTerm}`);
            this.props.onUpdateSearchTerm(searchTerm);
            this.props.onRequestPage(searchTerm, resultsPerPage, 1);
        }
    }

    render() {
        return (
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
                                fullTextSearch={this.fullTextSearch}
                                search={this.props.search}
                                searchTerm={this.props.search.searchTerm}
                                onUpdateSearchTerm={e => this.props.onUpdateSearchTerm(e.target.value)}
                            />
                        </Col>
                    </Row>
                </Container>

                <Route
                    exact
                    path="/"
                    render={props => <FullTextSearch fullTextSearch={this.fullTextSearch} {...props} />}
                />
                <Route
                    path="/search/:searchTerm"
                    render={props => <FullTextSearch fullTextSearch={this.fullTextSearch} {...props} />}
                />
                <Route
                    path="/correspondent/:emailAddress"
                    component={CorrespondentView}
                />
            </div>
        );
    }
}

Lampenhaus.propTypes = {
    onRequestPage: PropTypes.func.isRequired,
    onUpdateSearchTerm: PropTypes.func.isRequired,
    history: PropTypes.shape({
        push: PropTypes.func,
    }).isRequired,
    search: PropTypes.shape({
        searchTerm: PropTypes.string,
        resultsPerPage: PropTypes.number,
        hasData: PropTypes.bool,
        numberOfResults: PropTypes.number,
        isFetching: PropTypes.bool,
        results: PropTypes.array,
        activePageNumber: PropTypes.number,
    }).isRequired,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Lampenhaus));
