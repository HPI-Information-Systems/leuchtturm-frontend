import React, { Component } from 'react';
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import PropTypes from 'prop-types';
import './PaginationWrapper.css';

class PaginationWrapper extends Component {
    static getPageButtonNumbers(activePageNumber, maxPageNumber) {
        const pageButtonNumbers = [];

        if (activePageNumber < 4) {
            const maxPageButtonNumber = (maxPageNumber > 7) ? 7 : maxPageNumber;
            for (let i = 1; i <= maxPageButtonNumber; i++) {
                pageButtonNumbers.push(i);
            }
        } else if (activePageNumber > maxPageNumber - 3) {
            const minPageButtonNumber = (maxPageNumber - 6 < 1) ? 1 : maxPageNumber - 6;
            for (let i = minPageButtonNumber; i <= maxPageNumber; i++) {
                pageButtonNumbers.push(i);
            }
        } else {
            for (let i = activePageNumber - 3; i <= activePageNumber + 3; i++) {
                pageButtonNumbers.push(i);
            }
        }

        return pageButtonNumbers;
    }

    renderPageButton(pageIndex, pageNumber, isActive) {
        return (
            <PaginationItem active={isActive} key={pageIndex}>
                <PaginationLink href="#" onClick={() => this.props.onPageNumberChange(pageNumber)}>
                    {pageNumber}
                </PaginationLink>
            </PaginationItem>
        );
    }

    renderPageButtons(activePageNumber, maxPageNumber) {
        const pageNumbers = PaginationWrapper.getPageButtonNumbers(activePageNumber, maxPageNumber);
        const pageButtons = [];

        for (let pageIndex = 0; pageIndex < pageNumbers.length; pageIndex++) {
            const isActivePage = (pageNumbers[pageIndex] === activePageNumber);
            pageButtons.push(this.renderPageButton(pageIndex, pageNumbers[pageIndex], isActivePage));
        }

        return pageButtons;
    }

    render() {
        return (
            <Pagination>
                <PaginationItem disabled={this.props.activePageNumber === 1}>
                    <PaginationLink
                        previous
                        href="#"
                        onClick={() => this.props.onPageNumberChange(this.props.activePageNumber - 1)}
                    />
                </PaginationItem>
                {this.renderPageButtons(this.props.activePageNumber, this.props.maxPageNumber)}
                <PaginationItem disabled={this.props.activePageNumber === this.props.maxPageNumber}>
                    <PaginationLink
                        next
                        href="#"
                        onClick={() => this.props.onPageNumberChange(this.props.activePageNumber + 1)}
                    />
                </PaginationItem>
            </Pagination>
        );
    }
}

PaginationWrapper.propTypes = {
    activePageNumber: PropTypes.number.isRequired,
    maxPageNumber: PropTypes.number.isRequired,
    onPageNumberChange: PropTypes.func.isRequired,
};

export default PaginationWrapper;
