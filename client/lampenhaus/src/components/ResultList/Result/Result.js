import React, { Component } from 'react';
import { Col, Collapse, Row } from 'reactstrap';
import FontAwesome from 'react-fontawesome';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import './Result.css';
import readableDate from '../../../utils/readableDate';

class Result extends Component {
    constructor(props) {
        super(props);
        this.state = {
            collapsed: true,
        };

        this.toggleEmailBody = this.toggleEmailBody.bind(this);
    }

    toggleEmailBody() {
        this.setState({ collapsed: !this.state.collapsed });
    }

    render() {
        return (
            <div>
                <Row className="collapsable-results-headline" onClick={this.toggleEmailBody}>
                    <Col sm="9">
                        <h5>
                            <FontAwesome name={this.state.collapsed ? 'caret-right' : 'caret-down'} className="mr-2" />
                            {this.props.subject}
                        </h5>
                    </Col>
                    <Col sm="3" className="text-right">
                        <p className="similarDate">{readableDate(this.props.date)}</p>
                    </Col>
                </Row>
                <Collapse isOpen={!this.state.collapsed}>
                    <Row>
                        <Col sm="11">
                            <pre>
                                {this.props.body}
                            </pre>
                        </Col>
                        <Col sm="1" className="email-link-column">
                            <Link to={`/email/${this.props.doc_id}`} color="primary">
                                <FontAwesome name="external-link" size="2x" />
                            </Link>
                        </Col>
                    </Row>
                </Collapse>
            </div>
        );
    }
}

Result.propTypes = {
    body: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(PropTypes.object),
    ]).isRequired,
    subject: PropTypes.string.isRequired,
    doc_id: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
};

export default Result;
