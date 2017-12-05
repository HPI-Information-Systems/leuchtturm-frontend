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
            maxPageNumber: 22,
        }
    }

    changePageNumberBy(number) {
        let newPageNumber = this.state.activePageNumber + number;
        if(newPageNumber >= 1 && newPageNumber <= this.state.maxPageNumber) {
            this.setState({activePageNumber: this.state.activePageNumber + number});
        }
    }

    changePageNumberTo(pageNumber) {
        this.setState({activePageNumber: pageNumber});
    }

    render() {
        const resultElements = this.props.results.map(docResult => {
            return (
                <ListGroupItem key={docResult.docId}>
                    <Result
                        snippets={docResult.snippets}
                        docId={docResult.docId}
                    />
                </ListGroupItem>
                )
            });

        return (
            <div>
                <ListGroup>{resultElements}</ListGroup>
                <br/>
                <Row>
                    <Col>
                        <PaginationWrapper
                            activePageNumber={this.state.activePageNumber}
                            maxPageNumber={this.state.maxPageNumber}
                            handlePageNumberClick={pageNumber => this.changePageNumberTo(pageNumber)}
                            handleArrowClick={number => this.changePageNumberBy(number)}/>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default ResultList;
