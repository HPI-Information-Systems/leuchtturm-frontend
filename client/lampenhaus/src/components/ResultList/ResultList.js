import React, { Component } from 'react';
import { ListGroup, ListGroupItem } from 'reactstrap';
import PropTypes from 'prop-types';
import Result from './Result/Result';
import PaginationWrapper from './PaginationWrapper/PaginationWrapper';
import './ResultList.css';

class ResultList extends Component {
    handlePageNumberChange(pageNumber) {
        if (pageNumber >= 1 && pageNumber <= this.props.maxPageNumber) {
            this.props.onPageNumberChange(pageNumber);
        }
    }

    render() {
        const resultElements = this.props.results.map(result => (
            <ListGroupItem key={result.doc_id}>
                <Result
                    body={result.body}
                    subject={result.header.subject}
                    doc_id={result.doc_id}
                    date={result.header.date}
                    category={result.category}
                />
            </ListGroupItem>
        ));

        return (
            <div className="result-list-wrapper">
                {this.props.results.length > 0 &&
                <ListGroup className="result-list">{resultElements}</ListGroup>
                }
                {this.props.maxPageNumber > 1 &&
                <PaginationWrapper
                    activePageNumber={this.props.activePageNumber}
                    maxPageNumber={this.props.maxPageNumber}
                    onPageNumberChange={pageNumber => this.handlePageNumberChange(pageNumber)}
                />
                }
            </div>
        );
    }
}

ResultList.propTypes = {
    activePageNumber: PropTypes.number.isRequired,
    maxPageNumber: PropTypes.number.isRequired,
    onPageNumberChange: PropTypes.func.isRequired,
    results: PropTypes.arrayOf(PropTypes.shape({
        body: PropTypes.string.isRequired,
        doc_id: PropTypes.string.isRequired,
        header: PropTypes.shape({
            subject: PropTypes.string.isRequired,
            date: PropTypes.string.isRequired,
        }).isRequired,
        category: PropTypes.string.isRequired,
    })).isRequired,
};

export default ResultList;
