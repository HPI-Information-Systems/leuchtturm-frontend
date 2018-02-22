import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Result from './Result';

// eslint-disable-next-line
class ResultWithHighlighting extends Component {
    render() {
        const searchTermRegExp = new RegExp(`(${this.props.activeSearchTerm})`, 'gi');
        const parts = this.props.body.split(searchTermRegExp);
        const bodyWithSearchTermHighlighted = parts.map((part, index) => (
            // eslint-disable-next-line
            <span key={index} >
                {part.toLowerCase() === this.props.activeSearchTerm.toLowerCase()
                    ? <mark>{part}</mark>
                    : part
                }
            </span>
        ));

        return (
            <Result
                body={bodyWithSearchTermHighlighted}
                subject={this.props.subject}
                doc_id={this.props.doc_id}
            />
        );
    }
}

ResultWithHighlighting.propTypes = {
    body: PropTypes.string.isRequired,
    subject: PropTypes.string.isRequired,
    doc_id: PropTypes.string.isRequired,
    activeSearchTerm: PropTypes.string.isRequired,
};

export default Result;
