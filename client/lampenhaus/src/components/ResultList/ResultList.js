import React, { Component } from 'react';
import { ListGroup, ListGroupItem } from 'reactstrap';
import Result from './Result/Result';
import PaginationWrapper from "./PaginationWrapper/PaginationWrapper";

class ResultList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentPageNumber: 1,
            maxPageNumber: 22,
        }
    }

    changePageNumberBy(number) {
        let newPageNumber = this.state.currentPageNumber + number;
        if(newPageNumber >= 1 && newPageNumber <= this.state.maxPageNumber) {
            this.setState({currentPageNumber: this.state.currentPageNumber + number});
        }
    }

    changePageNumberTo(pageNumber) {
        this.setState({currentPageNumber: pageNumber});
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
                <PaginationWrapper
                    currentPageNumber={this.state.currentPageNumber}
                    maxPageNumber={this.state.maxPageNumber}
                    handlePageNumberClick={pageNumber => this.changePageNumberTo(pageNumber)}
                    handleArrowClick={number => this.changePageNumberBy(number)}
                />
            </div>
        );
    }
}

export default ResultList;
