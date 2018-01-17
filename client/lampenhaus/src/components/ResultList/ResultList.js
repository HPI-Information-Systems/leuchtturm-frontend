import React, { Component } from 'react';
import { Col, Row, ListGroup, ListGroupItem } from 'reactstrap';
import PropTypes from 'prop-types';
import Result from './Result/Result';
import PaginationWrapper from './PaginationWrapper/PaginationWrapper';

class ResultList extends Component {
    handlePageNumberChange(pageNumber) {
        if (pageNumber >= 1 && pageNumber <= this.props.maxPageNumber) {
            this.props.onPageNumberChange(pageNumber);
        }
    }

    render() {
        const resultElements = this.props.results.map(result => (
            <ListGroupItem key={result.doc_id[0]}>
                <Result
                    activeSearchTerm={this.props.activeSearchTerm}
                    body={result.body}
                    raw={result.raw}
                    entities={result.entities}
                    subject={result.header.Subject}
                    onEntitySearch={entityName => this.props.onEntitySearch(entityName)}
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
    onEntitySearch: PropTypes.func.isRequired,
    onPageNumberChange: PropTypes.func.isRequired,
    results: PropTypes.arrayOf(PropTypes.shape({
        body: PropTypes.arrayOf(PropTypes.string.isRequired),
        raw: PropTypes.arrayOf(PropTypes.string.isRequired),
        doc_id: PropTypes.arrayOf(PropTypes.string.isRequired),
        entities: PropTypes.object,
    })).isRequired,
};

export default ResultList;
