import React, { Component } from 'react';
import { Col, Collapse, Row } from 'reactstrap';
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
        const snippets = this.props.snippets.map(snippet => {
            return (
                <Row
                    //key={snippet.position}
                    onClick={() => console.log('Go to page of snippet', this.props.docId, 'at', snippet)}>
                    <Col sm="2">
                        {/*<p>Position: {snippet.position}</p>*/}
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
                const entitiesPerType = this.props.entities[entityType].map(entity => {
                    return (
                        <li>
                            <a href="#" onClick={() => this.props.onEntitySearch(entity.name)}>
                                {entity.name} ({entity.count})
                            </a>
                        </li>
                    )
                });

                entityList.push(
                    <div>
                        <h6>{entityType}</h6>
                            <ul className="entityList">{entitiesPerType}</ul>
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
                        <Col sm="8">
                            {snippets}
                        </Col>
                        <Col sm="4">
                            {entityList}
                        </Col>
                    </Row>
                </Collapse>
            </div>
        );
    }
}

export default Result;
