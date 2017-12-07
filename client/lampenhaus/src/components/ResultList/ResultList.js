import React, { Component } from 'react';
import { ListGroup, ListGroupItem } from 'reactstrap';
import Result from './Result/Result';
import PaginationWrapper from "./PaginationWrapper/PaginationWrapper";
import { Col, Row } from 'reactstrap';

class ResultList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activePageNumber: 1,
            maxPageNumber: Math.ceil(this.props.results.length / 10),
        }
    }

    handlePageNumberChange(pageNumber) {
        if(pageNumber >= 1 && pageNumber <= this.state.maxPageNumber) {
            this.setState({activePageNumber: pageNumber});
        }
    }

    render() {
        const resultElements = [];
        const firstResultNumber = (this.state.activePageNumber - 1) * 10;
        const lastResultNumber = Math.min(firstResultNumber + 10, this.props.results.length);

        for(let resultNumber = firstResultNumber; resultNumber < lastResultNumber; resultNumber++) {
            console.log(resultNumber);
            resultElements.push(
                <ListGroupItem key={this.props.results[resultNumber].docId}>
                    <Result
                        snippets={this.props.results[resultNumber].snippets}
                        docId={this.props.results[resultNumber].docId}
                    />
                </ListGroupItem>
            )
        }

        return (
            <div>
                <ListGroup>{resultElements}</ListGroup>
                <br/>
                <Row>
                    <Col>
                        {this.state.maxPageNumber > 1 &&
                        <PaginationWrapper
                            activePageNumber={this.state.activePageNumber}
                            maxPageNumber={this.state.maxPageNumber}
                            onPageNumberChange={pageNumber => this.handlePageNumberChange(pageNumber)}/>
                        }
                    </Col>
                </Row>
            </div>
        );
    }
}

export default ResultList;
