import React, { Component } from 'react';
import { Col, Collapse, Row, Button } from 'reactstrap';
import FontAwesome from 'react-fontawesome';
import PropTypes from 'prop-types';
import EmailModal from './EmailModal/EmailModal';
import './Result.css';

class Result extends Component {
    constructor(props) {
        super(props);
        this.state = {
            collapsed: true,
            modalOpen: false,
        };

        this.toggleSnippetList = this.toggleSnippetList.bind(this);
        this.toggleModalOpen = this.toggleModalOpen.bind(this);
    }

    toggleSnippetList() {
        this.setState({ collapsed: !this.state.collapsed });
    }

    toggleModalOpen() {
        this.setState({ modalOpen: !this.state.modalOpen });
    }

    render() {
        const searchTermRegExp = new RegExp(`(${this.props.activeSearchTerm})`, 'gi');
        const parts = this.props.body[0].split(searchTermRegExp);
        const bodyWithSearchTermHighlighted = parts.map((part, index) => (
            // eslint-disable-next-line
            <span key={index} >
                {part.toLowerCase() === this.props.activeSearchTerm.toLowerCase()
                    ? <mark> {part} </mark>
                    : part
                }
            </span>
        ));

        return (
            <div>
                <Row className="collapsable-results-headline" onClick={this.toggleSnippetList}>
                    <Col sm="12">
                        <h5>
                            <FontAwesome name={this.state.collapsed ? 'caret-right' : 'caret-down'} className="mr-2" />
                            {this.props.subject}
                        </h5>
                    </Col>
                </Row>
                <Collapse isOpen={!this.state.collapsed}>
                    <Row>
                        <Col sm="11">
                            {bodyWithSearchTermHighlighted}
                        </Col>
                        <Col sm="1">
                            <Button color="primary" onClick={this.toggleModalOpen} >
                                <FontAwesome name="arrows-alt" size="2x" />
                            </Button>
                        </Col>
                    </Row>
                </Collapse>
                <EmailModal
                    isOpen={this.state.modalOpen}
                    toggleModalOpen={this.toggleModalOpen}
                    activeSearchTerm={this.props.activeSearchTerm}
                    subject={this.props.subject}
                    body={this.props.body}
                    entities={this.props.entities}
                />
            </div>
        );
    }
}

Result.defaultProps = {
    entities: {},
    subject: ['NO SUBJECT'],
    body: ['NO BODY'],
};

Result.propTypes = {
    entities: PropTypes.objectOf(PropTypes.array.isRequired),
    body: PropTypes.arrayOf(PropTypes.string),
    subject: PropTypes.arrayOf(PropTypes.string),
    activeSearchTerm: PropTypes.string.isRequired,
};

export default Result;
