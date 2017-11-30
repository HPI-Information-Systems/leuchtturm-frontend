import React, { Component } from 'react';
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';

class PaginationWrapper extends Component {

    renderPageButton(pageNumber) {
        return (
            <PaginationItem>
                <PaginationLink href="#" onClick={() => this.props.handlePageNumberClick(pageNumber)}>
                    {pageNumber}
                </PaginationLink>
            </PaginationItem>
        );
    }

    renderPageButtons(pageNumber) {
        let pageButtons = [];
        if(pageNumber <= 2) {
            for(let i = 1; i <= 5; i++) {
                pageButtons.push(this.renderPageButton(i));
            }
        } else if (pageNumber >= this.props.maxPageNumber - 2) {
            for(let i = this.props.maxPageNumber - 4; i <= this.props.maxPageNumber; i++) {
                pageButtons.push(this.renderPageButton(i));
            }
        }
        else {
            for(let i = pageNumber - 2; i <= pageNumber + 2; i++) {
                pageButtons.push(this.renderPageButton(i));
            }
        }
        return pageButtons;
    }

    render() {
        return (
            <Pagination>
                <PaginationItem>
                    <PaginationLink disabled previous href="#" onClick={() => this.props.handleArrowClick(-1)}/>
                </PaginationItem>
                {this.renderPageButtons(this.props.currentPageNumber)}
                <PaginationItem>
                    <PaginationLink next href="#" onClick={() => this.props.handleArrowClick(1)}/>
                </PaginationItem>
            </Pagination>
        );
    }
}

export default PaginationWrapper;