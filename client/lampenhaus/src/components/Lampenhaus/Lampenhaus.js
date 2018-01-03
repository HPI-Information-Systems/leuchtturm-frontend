import React, { Component } from 'react';
import { connect } from 'react-redux';
import './Lampenhaus.css';
import { bindActionCreators } from 'redux';
import SearchBar from '../SearchBar/SearchBar';
import ResultList from '../ResultList/ResultList';
import NetworkGraph from '../NetworkGraph/NetworkGraph'
import { Col, Container, Row, Badge } from 'reactstrap';
import * as actions from '../../actions/actions';
import FontAwesome from 'react-fontawesome';

const mapStateToProps = state => ({
    search: state.search,
});

const mapDispatchToProps = dispatch => bindActionCreators({
    onUpdateSearchTerm: actions.updateSearchTerm,
    onRequestPage: actions.requestPage,
    onSetEntitySearch: actions.setEntitySearch,
}, dispatch);


class Lampenhaus extends Component {
    fetchResults = (searchTerm, resultsPerPage) => {
        if (searchTerm) {
            this.props.onSetEntitySearch(false);
            this.props.onRequestPage(searchTerm, resultsPerPage, 1);
        }
    };

    searchEntity = (searchTerm, resultsPerPage) => {
        if (searchTerm) {
            this.props.onSetEntitySearch(true);
            this.props.onUpdateSearchTerm(searchTerm);
            this.props.onRequestPage(searchTerm, resultsPerPage, 1);
        }
    };

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <h1 className="App-title">
                        Lampenhaus
                        <FontAwesome name="lightbulb-o" className="ml-2"/>
                    </h1>

                </header>

                <br/>
                <Container fluid className="App">
                    <Row>
                        <Col>
                            <SearchBar
                                searchTerm={this.props.search.searchTerm}
                                onSubmitSearch={() => this.fetchResults(this.props.search.searchTerm, this.props.search.resultsPerPage)}
                                onPageNumberChange={e => this.props.onUpdateSearchTerm(e.target.value)}
                                isEntitySearch={this.props.search.isEntitySearch}/>
                        </Col>
                    </Row>

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

                    <br/>

                    {this.props.search.isFetching &&
                    <Row>
                        <Col className="text-center">
                            <FontAwesome spin name="spinner" size="3x"/>
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
                        onPageNumberChange={(pageNumber) => this.props.onRequestPage(this.props.search.searchTerm, this.props.search.resultsPerPage, pageNumber)}
                        onEntitySearch={(entityName) => this.searchEntity(entityName, this.props.search.resultsPerPage)}/>
                    }

                    <Row>
                        <Col className="function-panels">
                            Hier sollten Funktions-Panels hin
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <NetworkGraph/>
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Lampenhaus);
