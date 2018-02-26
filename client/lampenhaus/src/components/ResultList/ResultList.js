import React, { Component } from 'react';
import { Col, Row, ListGroup, ListGroupItem } from 'reactstrap';
import PropTypes from 'prop-types';
import ResultWithHighlighting from './Result/ResultWithHighlighting';
import PaginationWrapper from './PaginationWrapper/PaginationWrapper';

class ResultList extends Component {
    handlePageNumberChange(pageNumber) {
        if (pageNumber >= 1 && pageNumber <= this.props.maxPageNumber) {
            this.props.onPageNumberChange(pageNumber);
        }
    }

    render() {
        const resultElements = this.props.results.map(result => (
            <ListGroupItem key={result.doc_id}>
                <ResultWithHighlighting
                    activeSearchTerm={this.props.activeSearchTerm}
                    body={result.body}
                    subject={result.header.subject}
                    doc_id={result.doc_id}
                />
            </ListGroupItem>
        ));

        return (
            <div>
                {this.props.results.length > 0 &&
                <ListGroup>{resultElements}</ListGroup>
                }
                <br />
                <Row>
                    <Col>
                        {this.props.maxPageNumber > 1 &&
                        <PaginationWrapper
                            activePageNumber={this.props.activePageNumber}
                            maxPageNumber={this.props.maxPageNumber}
                            onPageNumberChange={pageNumber => this.handlePageNumberChange(pageNumber)}
                        />
                        }
                    </Col>
                </Row>
            </div>
        );
    }
}

ResultList.propTypes = {
    activeSearchTerm: PropTypes.string.isRequired,
    activePageNumber: PropTypes.number.isRequired,
    maxPageNumber: PropTypes.number.isRequired,
    onPageNumberChange: PropTypes.func.isRequired,
    results: PropTypes.arrayOf(PropTypes.shape({
        body: PropTypes.string.isRequired,
        doc_id: PropTypes.string.isRequired,
        header: PropTypes.shape({
            subject: PropTypes.string.isRequired,
        }).isRequired,
    })).isRequired,
};

export default ResultList;