import React, { Component } from 'react';
import { Col, Collapse, Row } from 'reactstrap';
import FontAwesome from 'react-fontawesome';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import './Result.css';

class Result extends Component {
    constructor(props) {
        super(props);
        this.state = {
            collapsed: true,
        };

        this.toggleSnippetList = this.toggleSnippetList.bind(this);
    }

    toggleSnippetList() {
        this.setState({ collapsed: !this.state.collapsed });
    }

    render() {
        const searchTermRegExp = new RegExp(`(${this.props.activeSearchTerm})`, 'gi');
        const parts = this.props.body[0].split(searchTermRegExp);
        let key = 0;
        const bodyWithSearchTermHighlighted = parts.map((part) => {
            key += 1;
            return (
                <span key={key} >
                    {part.toLowerCase() === this.props.activeSearchTerm.toLowerCase()
                        ? <mark>{ part }</mark>
                        : part
                    }
                </span>
            );
        });

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
                            <Link to={`/email/${this.props.id}`} color="primary">
                                <FontAwesome name="external-link" size="2x" />
                            </Link>
                        </Col>
                    </Row>
                </Collapse>
            </div>
        );
    }
}

Result.defaultProps = {
    subject: ['NO SUBJECT'],
    body: ['NO BODY'],
};

Result.propTypes = {
    body: PropTypes.arrayOf(PropTypes.string),
    subject: PropTypes.arrayOf(PropTypes.string),
    activeSearchTerm: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
};

export default Result;
