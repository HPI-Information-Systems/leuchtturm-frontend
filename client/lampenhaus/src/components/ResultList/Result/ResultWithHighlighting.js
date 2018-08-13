import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Result from './Result';

// eslint-disable-next-line
class ResultWithHighlighting extends Component {
    render() {
        // escape regEx relevant characters in searchTerm
        // because escapes are necessary:
        // eslint-disable-next-line no-useless-escape
        const cleanedSearchTerm = this.props.activeSearchTerm.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1');
        // build regEx for finding searchTerm in body and split body accordingly
        const searchTermRegExp = new RegExp(`(${cleanedSearchTerm})`, 'gi');
        const parts = this.props.body.split(searchTermRegExp);
        // mark each part that is the searchTerm
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
                date={this.props.date}
            />
        );
    }
}

ResultWithHighlighting.propTypes = {
    body: PropTypes.string.isRequired,
    subject: PropTypes.string.isRequired,
    doc_id: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    activeSearchTerm: PropTypes.string.isRequired,
};

export default ResultWithHighlighting;
