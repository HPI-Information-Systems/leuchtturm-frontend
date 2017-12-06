import React, { Component } from 'react';
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import './PaginationWrapper.css';

class PaginationWrapper extends Component {

    static getPageButtonNumbers(activePageNumber, maxPageNumber) {
        let pageButtonNumbers = [];

        if(activePageNumber < 5) {
            let maxPageButtonNumber = (maxPageNumber > 5) ? 5 : maxPageNumber;
            for(let i = 1; i <= maxPageButtonNumber; i++) {
                pageButtonNumbers.push(i);
            }
        } else if (activePageNumber > maxPageNumber - 2) {
            for(let i = maxPageNumber - 4; i <= maxPageNumber; i++) {
                pageButtonNumbers.push(i);
            }
        }
        else {
            for(let i = activePageNumber - 2; i <= activePageNumber + 2; i++) {
                pageButtonNumbers.push(i);
            }
        }

        return pageButtonNumbers;
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

    renderPageButtons(activePageNumber, maxPageNumber) {
        const pageNumbers = PaginationWrapper.getPageButtonNumbers(activePageNumber, maxPageNumber);
        let pageButtons = [];

        for(let pageIndex = 0; pageIndex < pageNumbers.length; pageIndex++) {
            const isActivePage = (pageNumbers[pageIndex] === activePageNumber);
            pageButtons.push(this.renderPageButton(pageIndex, pageNumbers[pageIndex], isActivePage));
        }

        return pageButtons;
    }

    render() {
        return (
            <Pagination size="lg">
                <PaginationItem disabled={this.props.activePageNumber === 1}>
                    <PaginationLink
                        previous
                        href="#"
                        onClick={() => this.props.handlePageNumberClick(this.props.activePageNumber - 1)}/>
                </PaginationItem>
                {this.renderPageButtons(this.props.activePageNumber, this.props.maxPageNumber)}
                <PaginationItem disabled={this.props.activePageNumber === this.props.maxPageNumber}>
                    <PaginationLink
                        next
                        href="#"
                        onClick={() => this.props.handlePageNumberClick(this.props.activePageNumber + 1)}/>
                </PaginationItem>
            </Pagination>
        );
    }
}

export default PaginationWrapper;