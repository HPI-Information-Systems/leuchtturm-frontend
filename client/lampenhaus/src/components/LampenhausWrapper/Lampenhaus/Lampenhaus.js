import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Col, Container, Row } from 'reactstrap';
import FontAwesome from 'react-fontawesome';
import PropTypes from 'prop-types';
// eslint-disable-next-line import/no-extraneous-dependencies
import { withRouter } from 'react-router';
import * as actions from '../../../actions/actions';
import '../../../assets/global.css';
import './Lampenhaus.css';
import FullTextSearch from '../../FullTextSearch/FullTextSearch';
import EmailView from '../../EmailView/EmailView';
import CorrespondentView from '../../CorrespondentView/CorrespondentView';
import SearchBar from '../../SearchBar/SearchBar';
import cobaLogo from '../../../assets/cobalogo.svg';

const mapStateToProps = state => ({
    search: state.search,
});

const mapDispatchToProps = dispatch => bindActionCreators({
    onUpdateSearchTerm: actions.updateSearchTerm,
    onRequestSearchResultPage: actions.requestSearchResultPage,
}, dispatch);


class Lampenhaus extends Component {
    constructor(props) {
        super(props);

        this.updateBrowserPath = this.updateBrowserPath.bind(this);
        this.updateBrowserSearchPath = this.updateBrowserSearchPath.bind(this);
        this.updateBrowserCorrespondentPath = this.updateBrowserCorrespondentPath.bind(this);
        this.triggerFullTextSearch = this.triggerFullTextSearch.bind(this);
    }

    updateBrowserPath(path) {
        if (path) {
            this.props.history.push(path);
        }
    }

    updateBrowserSearchPath(searchTerm) {
        if (searchTerm) {
            this.updateBrowserPath(`/search/${searchTerm}`);
        }
    }

    updateBrowserCorrespondentPath(correspondentMail) {
        if (correspondentMail) {
            this.updateBrowserPath(`/correspondent/${correspondentMail}`);
        }
    }

    triggerFullTextSearch(searchTerm, resultsPerPage) {
        if (searchTerm) {
            this.props.onUpdateSearchTerm(searchTerm);
            this.props.onRequestSearchResultPage(searchTerm, resultsPerPage, 1);
        }
    }

    render() {
        return (
            <div className="lampenhaus">
                <header className="app-header">
                    <Container fluid>
                        <Row>
                            <Col sm="2">
                                <h1 className="app-title">
                                    <FontAwesome name="lightbulb-o" className="ml-2" /> Lampenhaus
                                </h1>
                            </Col>
                            <Col sm="5">
                                <SearchBar
                                    updateBrowserSearchPath={this.updateBrowserSearchPath}
                                    search={this.props.search}
                                    searchTerm={this.props.search.searchTerm}
                                    onUpdateSearchTerm={e => this.props.onUpdateSearchTerm(e.target.value)}
                                />
                            </Col>
                            <Col sm="5" className="text-right coba-logo">
                                <img src={cobaLogo} alt="logo commerzbank" />
                            </Col>
                        </Row>
                        <br />
                    </Container>
                </header>

                <Route
                    exact
                    path="/"
                    render={props => (
                        <FullTextSearch
                            updateBrowserSearchPath={this.updateBrowserSearchPath}
                            triggerFullTextSearch={this.triggerFullTextSearch}
                            {...props}
                        />
                    )}
                />
                <Route
                    path="/search/:searchTerm"
                    render={props => (
                        <FullTextSearch
                            updateBrowserSearchPath={this.updateBrowserSearchPath}
                            triggerFullTextSearch={this.triggerFullTextSearch}
                            {...props}
                        />
                    )}
                />
                <Route
                    path="/correspondent/:emailAddress"
                    render={props => (
                        <CorrespondentView
                            updateBrowserCorrespondentPath={this.updateBrowserCorrespondentPath}
                            {...props}
                        />
                    )}
                />
                <Route
                    path="/email/:docId"
                    component={EmailView}
                />

            </div>
        );
    }
}

Lampenhaus.propTypes = {
    onRequestSearchResultPage: PropTypes.func.isRequired,
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
