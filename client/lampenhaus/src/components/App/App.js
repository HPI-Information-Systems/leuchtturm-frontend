import React, { Component } from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import ResultList from '../ResultList/ResultList';
import {Col, Container, Row} from 'reactstrap';

class Lampenhaus extends Component {

    updateSearchTerm(searchInput) {
        this.setState({searchInput: searchInput}); //doesnt work right now
        console.log(searchInput);
    }

    handleSearchClick() {
        console.log(this.props.state.searchInput);
        this.props.onSubmitSearch();
    }

    render() {
        const { state, onIncrement, onDecrement, onUpdateSearchTerm, onSubmitSearch } = this.props;
        return (
            <div className="App">
                <header className="App-header">
                    <h1 className="App-title">Lampenhaus</h1>
                </header>

                <Container fluid className="App">
                    <Row>
                        <Col>
                            <SearchBar
                                searchInput={state.searchInput}
                                onSubmit={() => this.handleSearchClick()}
                                onChange={e => this.updateSearchTerm(e.target.value)}
                            />
                        </Col>
                    </Row>
                    <ResultList results={state.results}/>

                    <Row>
                        <Col>
                            Clicked: {state.counter} times
                            {' '}
                            <button onClick={onIncrement}>
                                +
                            </button>
                            {' '}
                            <button onClick={onDecrement}>
                                -
                            </button>
                        </Col>
                    </Row>
                  
                </Container>
            </div>
        )
    }
}

export default Lampenhaus;


