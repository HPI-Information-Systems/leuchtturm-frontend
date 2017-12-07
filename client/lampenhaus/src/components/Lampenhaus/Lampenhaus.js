import React, { Component } from 'react';
import { connect } from 'react-redux';
import './Lampenhaus.css';
import { bindActionCreators } from 'redux';
import SearchBar from '../SearchBar/SearchBar';
import ResultList from '../ResultList/ResultList';
import { Col, Container, Row } from 'reactstrap';
import * as actions from '../../actions';
import FontAwesome from 'react-fontawesome';

const mapStateToProps = state => ({
    counter: state.counter,
    search: state.search,
});

const mapDispatchToProps = dispatch => bindActionCreators({
    onIncrement: actions.increment,
    onDecrement: actions.decrement,
    onUpdateSearchTerm: actions.updateSearchTerm,
    onSubmitSearch: actions.submitSearch,
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
                                onSubmit={this.props.onSubmitSearch}
                                onChange={e => this.props.onUpdateSearchTerm(e.target.value)}
                            />
                        </Col>
                    </Row>

                    <ResultList
                        results={this.props.search.resultList}
                        isFetching={this.props.search.isFetching}/>

                    <Row>
                        <Col sm="2">
                            Clicked: {this.props.counter} times
                        </Col>
                        <Col sm="2">
                            <button onClick={this.props.onIncrement}>+</button>
                            <button onClick={this.props.onDecrement}>-</button>
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Lampenhaus);
