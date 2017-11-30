import React, { Component } from 'react';
import { connect } from 'react-redux';
import './App.css';
import { bindActionCreators } from 'redux';
import SearchBar from '../SearchBar/SearchBar';
import ResultList from '../ResultList/ResultList';
import {Col, Container, Row} from 'reactstrap';
import * as actions from '../../actions';

const mapStateToProps = function(state){
    return {
        counter: state.counter,
        results: state.results,
        searchTerm: state.searchTerm,
    }
}

const mapDispatchToProps = function (dispatch) {
    return bindActionCreators({
        onIncrement: actions.increment,
        onDecrement: actions.decrement,
        onUpdateSearchTerm: actions.updateSearchTerm,
        onSubmitSearch: actions.submitSearch,
    }, dispatch)
}

class Lampenhaus extends Component {
    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <h1 className="App-title">Lampenhaus</h1>
                </header>

                <Container fluid className="App">
                    <Row>
                        <Col>
                            <SearchBar
                                searchTerm={this.props.searchTerm}
                                onSubmit={this.props.onSubmitSearch}
                                onChange={e => this.props.onUpdateSearchTerm(e.target.value)}
                            />
                        </Col>
                    </Row>
                    <ResultList results={this.props.results}/>

                    <Row>
                        <Col>
                            Clicked: {this.props.counter} times
                            {' '}
                            <button onClick={this.props.onIncrement}>
                                +
                            </button>
                            {' '}
                            <button onClick={this.props.onDecrement}>
                                -
                            </button>
                        </Col>
                    </Row>
                  
                </Container>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Lampenhaus);


