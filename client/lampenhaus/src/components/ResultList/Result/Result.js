import React, { Component } from 'react';
import { Col, Collapse, Row } from 'reactstrap';
import FontAwesome from 'react-fontawesome';
import EntityList from './EntityList/EntityList';
import './Result.css';

class Result extends Component {
    constructor(props) {
        super(props);
        this.state = {
            collapsed: false,
        };
    }

    toggleSnippetList() {
        this.setState({ collapsed: !this.state.collapsed });
    }

    render() {
        const snippets = this.props.snippets.map(snippet => (
            <Row
                key={this.props.docId}
                onClick={() => console.log('Go to page of snippet', this.props.docId, 'at', snippet)}
            >
                <Col sm="2">
                    <p>Position: 112</p>
                </Col>
                <Col sm="10">
                    <p>{snippet}</p>
                </Col>
            </Row>
        ));

        let entityList = [];

        if (this.props.entities) {
            entityList = Object.keys(this.props.entities).map(entityType => (
                <EntityList
                    key={entityType}
                    entityType={entityType}
                    entities={this.props.entities[entityType]}
                    onEntitySearch={this.props.onEntitySearch}
                />
            ));
        }

        return (
            <div>
                <Row className="collapseResult" onClick={() => this.toggleSnippetList()}>
                    <Col sm="12">
                        <h5>
                            <FontAwesome name={this.state.collapsed ? 'caret-right' : 'caret-down'} className="mr-2" />
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
