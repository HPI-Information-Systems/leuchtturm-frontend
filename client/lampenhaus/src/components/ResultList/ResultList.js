import React, { Component } from 'react';
import { ListGroup, ListGroupItem } from 'reactstrap';
import Result from './Result/Result';
import PaginationWrapper from './PaginationWrapper/PaginationWrapper';
import { Col, Row } from 'reactstrap';

class ResultList extends Component {
    handlePageNumberChange(pageNumber) {
        if (pageNumber >= 1 && pageNumber <= this.props.maxPageNumber) {
            this.props.onPageNumberChange(pageNumber);
        }
    }

    render() {
        const resultElements = this.props.results.map((result, index) => (
            <ListGroupItem key={index}>
                <Result
                    snippets={[result.body]}
                    docId={result.doc_id[0]}
                    entities={result.entities}
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

export default ResultList;
