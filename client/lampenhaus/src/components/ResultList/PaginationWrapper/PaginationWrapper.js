import React, { Component } from 'react';
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import './PaginationWrapper.css';

class PaginationWrapper extends Component {

    getPageNumbers(activePageNumber) {
        let pageNumbers = [];

        if(activePageNumber < 4) {
            pageNumbers = [1, 2, 3, 4, 5];
        } else if (activePageNumber > this.props.maxPageNumber - 2) {
            for(let i = this.props.maxPageNumber - 4; i <= this.props.maxPageNumber; i++) {
                pageNumbers.push(i);
            }
        }
        else {
            for(let i = activePageNumber - 2; i <= activePageNumber + 2; i++) {
                pageNumbers.push(i);
            }
        }

        return pageNumbers;
    }

    renderPageButton(pageIndex, pageNumber, isActive) {
        return (
            <PaginationItem active={isActive} key={pageIndex}>
                <PaginationLink href="#" onClick={() => this.props.handlePageNumberClick(pageNumber)}>
                    {pageNumber}
                </PaginationLink>
            </PaginationItem>
        );
    }

    renderPageButtons(activePageNumber) {
        let pageNumbers = this.getPageNumbers(activePageNumber);
        let pageButtons = [];

        for(let pageIndex = 0; pageIndex < 5; pageIndex++) {
            let isActivePage = (pageNumbers[pageIndex] === activePageNumber);
            pageButtons.push(this.renderPageButton(pageIndex, pageNumbers[pageIndex], isActivePage));
        }

        return pageButtons;
    }

    render() {
        return (
            <Pagination size="lg">
                <PaginationItem disabled={this.props.activePageNumber === 1}>
                    <PaginationLink previous href="#" onClick={() => this.props.handleArrowClick(-1)}/>
                </PaginationItem>
                {this.renderPageButtons(this.props.activePageNumber)}
                <PaginationItem disabled={this.props.activePageNumber === this.props.maxPageNumber}>
                    <PaginationLink next href="#" onClick={() => this.props.handleArrowClick(1)}/>
                </PaginationItem>
            </Pagination>
        );
    }
}

export default PaginationWrapper;