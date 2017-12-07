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
            maxPageNumber: 15,
        }
    }

    handlePageNumberChange(pageNumber) {
        if(pageNumber >= 1 && pageNumber <= this.state.maxPageNumber) {
            this.setState({activePageNumber: pageNumber});
        }
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
                            onPageNumberChange={pageNumber => this.handlePageNumberChange(pageNumber)}/>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default ResultList;
