import React, { Component } from 'react';
import { connect } from 'react-redux';
import './Lampenhaus.css';
import { bindActionCreators } from 'redux';
import SearchBar from '../SearchBar/SearchBar';
import ResultList from '../ResultList/ResultList';
import { Col, Container, Row } from 'reactstrap';
import * as actions from '../../actions/actions';
import FontAwesome from 'react-fontawesome';

const mapStateToProps = state => ({
    search: state.search,
    pagination: state.pagination,
});

const mapDispatchToProps = dispatch => bindActionCreators({
    onUpdateSearchTerm: actions.updateSearchTerm,
    onSubmitSearch: actions.fetchResults,
    onPageNumberChange: actions.changePageNumberTo,
}, dispatch);


class Lampenhaus extends Component {
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
                                onSubmitSearch={() => this.props.onSubmitSearch(this.props.search.searchTerm)}
                                onPageNumberChange={e => this.props.onUpdateSearchTerm(e.target.value)}
                            />
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
                        activePageNumber={this.props.pagination.activePageNumber}
                        onPageNumberChange={(pageNumber) => this.props.onPageNumberChange(pageNumber)}/>
                    }
                </Container>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Lampenhaus);
