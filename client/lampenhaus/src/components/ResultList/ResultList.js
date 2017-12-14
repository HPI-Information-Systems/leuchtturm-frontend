import React, { Component } from 'react';
import { ListGroup, ListGroupItem } from 'reactstrap';
import Result from './Result/Result';
import PaginationWrapper from "./PaginationWrapper/PaginationWrapper";
import { Col, Row } from 'reactstrap';

class ResultList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            entities: {
                persons: [
                    {
                        name: "Ken Lay",
                        count: 3,
                    },
                    {
                        name: "Andy",
                        count: 2,
                    },
                ],
                organizations: [
                    {
                        name: "Enron",
                        count: 3,
                    },
                    {
                        name: "TBG",
                        count: 2,
                    },
                ],
            },
        }
    }

    handlePageNumberChange(pageNumber) {
        if(pageNumber >= 1 && pageNumber <= this.props.maxPageNumber) {
            this.props.onPageNumberChange(pageNumber);
        }
    }

    render() {
        let resultElements = this.props.results.map( (result, index) => {
            return (
                <ListGroupItem key={index}>
                    <Result
                        snippets={[result.body]}
                        docId={result.doc_id[0]}
                        entities={this.state.entities}
                        onEntitySearch={(entityName) => this.props.onEntitySearch(entityName)}
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
                        {this.props.maxPageNumber > 1 &&
                        <PaginationWrapper
                            activePageNumber={this.props.activePageNumber}
                            maxPageNumber={this.props.maxPageNumber}
                            onPageNumberChange={pageNumber => this.handlePageNumberChange(pageNumber)}/>
                        }
                    </Col>
                </Row>
            </div>
        );
    }
}

export default ResultList;
