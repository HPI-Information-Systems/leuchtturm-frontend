import React, { Component } from 'react';
import { Col, Collapse, Row, Button, Badge, ListGroup, ListGroupItem } from 'reactstrap';
import FontAwesome from 'react-fontawesome';
import './Result.css';

class Result extends Component {
    constructor(props) {
        super(props);
        this.state = {
            collapsed: false,
        }
    }

    toggleSnippetList() {
        this.setState({collapsed: !this.state.collapsed});
    }

    render() {
        const snippets = this.props.snippets.map( (snippet, index) => {
            return (
                <Row key={index}
                    onClick={() => console.log('Go to page of snippet', this.props.docId, 'at', snippet)}>
                    <Col sm="2">
                        <p>Position: 112</p>
                    </Col>
                    <Col sm="10">
                        <p>{snippet}</p>
                    </Col>
                </Row>
            )
        });

        let entityList = [];

        for(const entityType in this.props.entities) {

            if(this.props.entities.hasOwnProperty(entityType)) {
                const entitiesPerType = this.props.entities[entityType].map( (entity, index) => {
                    return (
                        <ListGroupItem
                            tag="button"
                            action
                            key={index}
                            onClick={() => this.props.onEntitySearch(entity.name)}
                            className="text-primary">

                            {entity.name}&nbsp;
                            <Badge color="secondary" pill>
                                {entity.count}
                            </Badge>

                            <FontAwesome name="search" className="pull-right" />

                        </ListGroupItem>
                    )
                });

                entityList.push(
                    <div key={entityType}>
                        <h6>{entityType}</h6>
                            <ListGroup className="entityList">{entitiesPerType}</ListGroup>
                        <br/>
                    </div>
                );
            }
        }

        return (
            <div>
                <Row className="collapseResult" onClick={() => this.toggleSnippetList()}>
                    <Col sm="12">
                        <h5>
                            <FontAwesome name={this.state.collapsed ? 'caret-right' : 'caret-down'} className="mr-2"/>
                             Document ID: {this.props.docId}
                        </h5>
                    </Col>
                </Row>
                <Collapse isOpen={!this.state.collapsed}>
                    <Row>
                        <Col sm="9">
                            {snippets}
                        </Col>
                        <Col sm="3">
                            {entityList}
                        </Col>
                    </Row>
                </Collapse>
            </div>
        );
    }
}

export default Result;
