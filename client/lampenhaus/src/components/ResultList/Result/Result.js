import React, { Component } from 'react';
import { Col, Collapse, Row } from 'reactstrap';
import FontAwesome from 'react-fontawesome';

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
        console.log(this.props.snippets)
        const snippets = this.props.snippets.map(snippet => {
            console.log(snippet)
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

        return (
            <Row>
                <Col sm="12" onClick={() => this.toggleSnippetList()}>
                    <h6>
                        <FontAwesome name={this.state.collapsed ? 'caret-right' : 'caret-down'} className="mr-2"/>
                         Document ID: {this.props.docId}
                    </h6>
                </Col>
                <Col sm="12">
                    <Collapse isOpen={!this.state.collapsed}>
                        {snippets}
                    </Collapse>
                </Col>
            </Row>
        );
    }
}

export default Result;
