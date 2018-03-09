import React, { Component } from 'react';
import { ListGroup, ListGroupItem } from 'reactstrap';
import PropTypes from 'prop-types';
import Result from './Result/Result';
import Spinner from '../Spinner/Spinner';

// eslint-disable-next-line
class ResultListDumb extends Component {
    render() {
        const resultElements = this.props.results.map(result => (
            <ListGroupItem key={result.doc_id}>
                <Result
                    body={result.body}
                    subject={result.header.subject}
                    doc_id={result.doc_id}
                    date={result.header.date}
                />
            </ListGroupItem>
        ));

        let displayedEmails;

        if (this.props.results.length === 0) {
            displayedEmails = (
                <div>
                    No emails found.
                </div>
            );
        } else {
            displayedEmails = (
                <div>
                    {this.props.results.length > 0 &&
                    <ListGroup>{resultElements}</ListGroup>
                    }
                </div>
            );
        }

        return (
            this.props.isFetching
                ? (<Spinner />) : displayedEmails
        );
    }
}

ResultListDumb.defaultProps = {
    isFetching: false,
};

ResultListDumb.propTypes = {
    results: PropTypes.arrayOf(PropTypes.shape({
        body: PropTypes.string.isRequired,
        doc_id: PropTypes.string.isRequired,
        header: PropTypes.shape({
            subject: PropTypes.string.isRequired,
            date: PropTypes.number.isRequired,
        }).isRequired,
    })).isRequired,
    isFetching: PropTypes.bool,
};

export default ResultListDumb;
