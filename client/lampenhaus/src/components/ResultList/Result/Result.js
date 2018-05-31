import React, { Component } from 'react';
import { Collapse } from 'reactstrap';
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
                <div
                    role="button"
                    className="collapsible-results-headline"
                    onClick={this.toggleEmailBody}
                    onKeyPress={this.toggleEmailBody}
                    tabIndex="0"
                >
                    <FontAwesome name={this.state.collapsed ? 'caret-right' : 'caret-down'} className="mr-2" />
                    <p className="category-badge small mr-2">{this.props.category}</p>
                    <p className="subject text-ellipsis mr-2">
                        {this.props.subject}
                    </p>
                    <p className="similar-date">{readableDate(this.props.date)}</p>
                    <Link className="email-link" to={`/email/${this.props.doc_id}`} color="primary">
                        <FontAwesome name="external-link" />
                    </Link>
                </div>
                <Collapse isOpen={!this.state.collapsed}>
                    <pre>
                        {this.props.body}
                    </pre>
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
    category: PropTypes.string.isRequired,
};

export default Result;
